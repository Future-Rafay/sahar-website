import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export const colors = {
  plum: "#6A1F3D",
  saffron: "#C58A1F",
  bg: "#FFF9F3",
  surface: "#FFFFFF",
  text: "#211A1D",
  muted: "#6E5F65",
  border: "#E8D9CE",
  success: "#287A54",
  danger: "#B42318",
};

export function Button({
  label,
  onPress,
  danger,
  disabled,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        danger ? styles.dangerButton : styles.primaryButton,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function Field(props: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        accessibilityLabel={props.label}
        autoCapitalize="none"
        style={[styles.input, props.multiline && styles.multiline]}
        {...props}
      />
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.plum} />
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { gap: 14, padding: 16, paddingBottom: 28 },
  center: { alignItems: "center", flex: 1, justifyContent: "center" },
  title: { color: colors.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, elevation: 2, gap: 8, padding: 16 },
  row: { alignItems: "center", flexDirection: "row", gap: 8, justifyContent: "space-between" },
  label: { color: colors.text, fontSize: 13, fontWeight: "700" },
  muted: { color: colors.muted, fontSize: 13 },
  field: { gap: 6 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, minHeight: 50, paddingHorizontal: 14 },
  multiline: { minHeight: 96, paddingTop: 12, textAlignVertical: "top" },
  button: { alignItems: "center", borderRadius: 12, justifyContent: "center", minHeight: 50, paddingHorizontal: 16 },
  primaryButton: { backgroundColor: colors.plum },
  dangerButton: { backgroundColor: colors.danger },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.78 },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  status: { alignSelf: "flex-start", borderColor: colors.border, borderRadius: 999, borderWidth: 1, color: colors.text, fontSize: 12, fontWeight: "800", paddingHorizontal: 8, paddingVertical: 4 },
});
