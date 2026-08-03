"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatChf } from "@/lib/orders";

type AdminOrder = {
  orderNumber: string; customerName: string; customerPhone: string; fulfillmentType: string; status: string;
  paymentMethod: string; paymentStatus?: string | null; totalRappen: number; version: number;
  items: Array<{ id: string; name: string; quantity: number; options: string[] }>; allowedNextStatus: string | null;
};
type Product = { id: string; name: string; available: boolean };
const labels: Record<string, string> = { PAYMENT_PENDING: "Payment pending", CONFIRMED: "Confirmed", PREPARING: "Preparing", READY_FOR_PICKUP: "Ready for pickup", OUT_FOR_DELIVERY: "Out for delivery", COMPLETED: "Completed" };

export function AdminQueue({ orders, products }: { orders: AdminOrder[]; products: Product[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { const timer = window.setInterval(() => router.refresh(), 10_000); return () => window.clearInterval(timer); }, [router]);

  async function mutate(key: string, url: string, body?: unknown) {
    setBusy(key); setError("");
    const response = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    if (!response.ok) setError((await response.json()).error ?? "Action failed."); else router.refresh();
    setBusy("");
  }

  return <div className="mx-auto max-w-7xl px-4 py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-semibold text-secondary">SAHAR ADMIN</p><h1 className="font-display text-4xl font-bold">Live order queue</h1></div><p className="text-sm text-muted">Refreshes every 10 seconds</p></div>{error && <p role="alert" className="mt-5 rounded-xl border border-destructive p-3 text-destructive">{error}</p>}<section className="mt-8" aria-labelledby="active-orders-title"><h2 id="active-orders-title" className="font-display text-2xl font-semibold">Active orders</h2>{orders.length === 0 ? <Card className="mt-4"><p>No active orders.</p></Card> : <div className="mt-4 grid gap-4 lg:grid-cols-2">{orders.map((order) => <Card key={order.orderNumber}><div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-xl font-bold">{order.orderNumber}</h3><p className="text-sm text-muted">{order.customerName} · <a href={`tel:${order.customerPhone}`}>{order.customerPhone}</a></p></div><span className="rounded-full bg-background px-3 py-1 text-sm font-semibold">{labels[order.status] ?? order.status}</span></div><p className="mt-3 text-sm font-semibold">{order.fulfillmentType.replaceAll("_", " ")} · {formatChf(order.totalRappen, "en")} · {order.paymentStatus}</p><ul className="mt-4 space-y-2 border-t pt-4">{order.items.map((item) => <li key={item.id}>{item.quantity}× {item.name}{item.options.length > 0 && <small className="block text-muted">{item.options.join(", ")}</small>}</li>)}</ul><div className="mt-5 flex flex-wrap gap-3 border-t pt-4">{order.allowedNextStatus && <Button disabled={busy === order.orderNumber} onClick={() => mutate(order.orderNumber, `/api/v1/staff/orders/${order.orderNumber}/advance`, { version: order.version })}>Mark {labels[order.allowedNextStatus]?.toLowerCase()}</Button>}{order.paymentMethod !== "STRIPE" && order.paymentStatus === "PENDING" && <Button variant="secondary" disabled={busy === `${order.orderNumber}-cash`} onClick={() => mutate(`${order.orderNumber}-cash`, `/api/v1/staff/orders/${order.orderNumber}/cash-payment`)}>Confirm cash received</Button>}</div></Card>)}</div>}</section><section className="mt-12 border-t pt-10" aria-labelledby="availability-title"><h2 id="availability-title" className="font-display text-2xl font-semibold">Sold-out controls</h2><p className="mt-1 text-sm text-muted">Full menu structure is managed from the Menu section.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Card key={product.id} className="flex items-center gap-3"><span className="font-semibold">{product.name}</span><Button className="ml-auto" size="compact" variant={product.available ? "outline" : "secondary"} disabled={busy === product.id} onClick={() => mutate(product.id, `/api/v1/staff/products/${product.id}/availability`, { available: !product.available })}>{product.available ? "Mark sold out" : "Mark available"}</Button></Card>)}</div></section></div>;
}
