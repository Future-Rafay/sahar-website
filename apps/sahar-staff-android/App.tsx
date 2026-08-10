import React, { useCallback, useEffect, useState } from "react";
import { Alert, AppState, FlatList, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import * as api from "./src/api";
import { POLL_MS } from "./src/config";
import { printReceipt, type PrinterConfig } from "./src/printer/adapter";
import { registerDeviceForPush, playNewOrderAlert } from "./src/push";
import { loadCachedOrders, loadSession, saveCachedOrders, saveSession } from "./src/storage";
import type { Order, Session } from "./src/types";
import { Button, Field, Loading, colors, styles } from "./src/ui";

type Screen = "queue" | "settings";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [screen, setScreen] = useState<Screen>("queue");
  const [offline, setOffline] = useState(false);
  const [printer, setPrinter] = useState<PrinterConfig>({ paperWidth: 58, connection: "bluetooth-escpos" });

  useEffect(() => {
    Promise.all([loadSession(), loadCachedOrders()]).then(([savedSession, cachedOrders]) => {
      setSession(savedSession);
      setOrders(cachedOrders);
      setBooting(false);
    });
  }, []);

  const loadOrders = useCallback(async () => {
    if (!session) return;
    try {
      const next = await api.getOrders(session.accessToken);
      if (orders.length && next[0]?.orderNumber && next[0].orderNumber !== orders[0]?.orderNumber) playNewOrderAlert();
      setOrders(next);
      setOffline(false);
      await saveCachedOrders(next);
    } catch {
      setOffline(true);
    }
  }, [orders, session]);

  useEffect(() => {
    void loadOrders();
    const timer = setInterval(loadOrders, POLL_MS);
    const appState = AppState.addEventListener("change", (state) => {
      if (state === "active") void loadOrders();
    });
    return () => {
      clearInterval(timer);
      appState.remove();
    };
  }, [loadOrders]);

  if (booting) return <Loading />;
  if (!session) return <LoginScreen onLogin={async (next) => { setSession(next); await saveSession(next); }} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <View style={[styles.row, { borderBottomColor: colors.border, borderBottomWidth: 1, padding: 12 }]}>
          <View>
            <Text style={styles.title}>Sahar Orders</Text>
            <Text style={styles.subtitle}>{offline ? "Offline cache, actions disabled" : "Live queue refreshes every 10 seconds"}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open settings" hitSlop={12} onPress={() => setScreen(screen === "queue" ? "settings" : "queue")}>
            <Text style={{ color: colors.plum, fontWeight: "800" }}>{screen === "queue" ? "Settings" : "Queue"}</Text>
          </Pressable>
        </View>
        {screen === "settings" ? (
          <SettingsScreen
            session={session}
            printer={printer}
            setPrinter={setPrinter}
            onLogout={async () => {
              await api.logout(session.refreshToken).catch(() => null);
              await saveSession(null);
              setSession(null);
            }}
          />
        ) : (
          <QueueScreen orders={orders} offline={offline} onSelect={setSelected} />
        )}
        {selected ? (
          <OrderModal
            order={selected}
            offline={offline}
            printer={printer}
            token={session.accessToken}
            onClose={() => setSelected(null)}
            onChanged={async () => {
              setSelected(null);
              await loadOrders();
            }}
          />
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function LoginScreen({ onLogin }: { onLogin: (session: Session) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceName, setDeviceName] = useState("Sahar Android");
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <View style={[styles.content, { flex: 1, justifyContent: "center" }]}>
          <Text style={styles.title}>Staff login</Text>
          <Text style={styles.subtitle}>Use an owner or staff account from the Sahar admin panel.</Text>
          <Field label="Email" value={email} onChangeText={setEmail} />
          <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <Field label="Device name" value={deviceName} onChangeText={setDeviceName} />
          <Button
            label={loading ? "Signing in..." : "Sign in"}
            disabled={loading}
            onPress={async () => {
              setLoading(true);
              try {
                await onLogin(await api.login(email, password, deviceName));
              } catch {
                Alert.alert("Login failed", "Check the account and password.");
              } finally {
                setLoading(false);
              }
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function QueueScreen({ orders, offline, onSelect }: { orders: Order[]; offline: boolean; onSelect: (order: Order) => void }) {
  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={orders}
      keyExtractor={(item) => item.orderNumber}
      ListEmptyComponent={<Text style={styles.subtitle}>No active orders.</Text>}
      renderItem={({ item }) => (
        <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.orderNumber}`} disabled={offline} onPress={() => onSelect(item)} style={({ pressed }) => [styles.card, pressed && styles.pressed, offline && styles.disabled]}>
          <View style={styles.row}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>{item.orderNumber}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
          <Text style={styles.muted}>{item.customerName} · {item.fulfillmentType} · CHF {(item.totalRappen / 100).toFixed(2)}</Text>
        </Pressable>
      )}
    />
  );
}

function OrderModal({ order, token, offline, printer, onClose, onChanged }: { order: Order; token: string; offline: boolean; printer: PrinterConfig; onClose: () => void; onChanged: () => Promise<void> }) {
  const [reasonOpen, setReasonOpen] = useState(false);
  const [reason, setReason] = useState("");
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.row}>
            <Text style={styles.title}>{order.orderNumber}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close order" hitSlop={12} onPress={onClose}>
              <Text style={{ color: colors.plum, fontWeight: "800" }}>Close</Text>
            </Pressable>
          </View>
          <Text style={styles.status}>{order.status}</Text>
          <View style={styles.card}>
            <Text style={styles.label}>{order.customerName}</Text>
            <Text style={styles.muted}>{order.customerPhone}</Text>
            {order.address ? <Text style={styles.muted}>{order.address.street}, {order.address.postalCode} {order.address.city}</Text> : null}
          </View>
          <View style={styles.card}>
            {order.items.map((item) => (
              <Text key={item.id} style={styles.muted}>{item.quantity}x {item.productNameEnSnapshot}</Text>
            ))}
          </View>
          <Button label="Print receipt" disabled={offline} onPress={async () => Alert.alert("Printer", (await printReceipt(order, printer)).message)} />
          <Button label="Add 10 min" disabled={offline || ["COMPLETED", "CANCELLED"].includes(order.status)} onPress={async () => { const base = order.estimatedReadyAt ? new Date(order.estimatedReadyAt) : new Date(); await api.updateEta(token, order, new Date(base.getTime() + 10 * 60_000).toISOString()); await onChanged(); }} />
          <Button label={order.allowedActions.nextStatus ? `Move to ${order.allowedActions.nextStatus}` : "No next status"} disabled={offline || !order.allowedActions.nextStatus} onPress={async () => { await api.advanceOrder(token, order); await onChanged(); }} />
          <Button label="Confirm cash paid" disabled={offline || !order.allowedActions.canConfirmCash} onPress={async () => { await api.confirmCash(token, order.orderNumber); await onChanged(); }} />
          <View style={{ height: 20 }} />
          <Button label="Cancel order" danger disabled={offline || !order.allowedActions.canCancel} onPress={() => setReasonOpen(true)} />
          {reasonOpen ? (
            <View style={[styles.card, { borderColor: colors.danger }]}>
              <Text style={styles.label}>Cancellation reason</Text>
              <Field label="Reason" value={reason} onChangeText={setReason} multiline />
              <Button label="Confirm cancellation" danger disabled={reason.trim().length < 3} onPress={async () => { await api.cancelOrder(token, order.orderNumber, reason); await onChanged(); }} />
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function SettingsScreen({ session, printer, setPrinter, onLogout }: { session: Session; printer: PrinterConfig; setPrinter: (config: PrinterConfig) => void; onLogout: () => Promise<void> }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>{session.user.name ?? session.user.email}</Text>
        <Text style={styles.muted}>{session.user.role}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Printer setup</Text>
        <Text style={styles.muted}>Current width: {printer.paperWidth}mm</Text>
        <View style={styles.row}>
          <Button label="58mm" onPress={() => setPrinter({ ...printer, paperWidth: 58 })} />
          <Button label="80mm" onPress={() => setPrinter({ ...printer, paperWidth: 80 })} />
        </View>
      </View>
      <Button label="Register push alerts" onPress={() => registerDeviceForPush(session.accessToken).catch(() => Alert.alert("Push setup failed", "Check Firebase configuration."))} />
      <View style={{ height: 24 }} />
      <Button label="Sign out" danger onPress={onLogout} />
    </ScrollView>
  );
}
