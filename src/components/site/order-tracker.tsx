"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { formatChf } from "@/lib/orders";

type Order = {
  orderNumber: string;
  status: string;
  paymentStatus?: string | null;
  fulfillmentType: string;
  scheduledFor: string | null;
  estimatedReadyAt: string | null;
  totalRappen: number;
  items: Array<{ id: string; name: string; variant: string | null; quantity: number; lineSubtotalRappen: number; options: string[] }>;
  timeline: Array<{ status: string; at: string }>;
};

export function OrderTracker({ initialOrder, token, locale }: { initialOrder: Order; token?: string; locale: "de" | "en" }) {
  const [order, setOrder] = useState(initialOrder);
  useEffect(() => {
    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/v1/customer/orders/${order.orderNumber}${token ? `?token=${encodeURIComponent(token)}` : ""}`);
      if (response.ok) setOrder((await response.json()).order);
    }, 10_000);
    return () => window.clearInterval(timer);
  }, [order.orderNumber, token]);
  const labels: Record<string, { de: string; en: string }> = {
    PAYMENT_PENDING: { de: "Zahlung ausstehend", en: "Payment pending" },
    CONFIRMED: { de: "Best?tigt", en: "Confirmed" },
    PREPARING: { de: "In Zubereitung", en: "Preparing" },
    READY_FOR_PICKUP: { de: "Abholbereit", en: "Ready for pickup" },
    OUT_FOR_DELIVERY: { de: "Unterwegs", en: "Out for delivery" },
    COMPLETED: { de: "Abgeschlossen", en: "Completed" },
    CANCELLED: { de: "Storniert", en: "Cancelled" },
  };
  return <div className="mx-auto max-w-3xl px-4 py-12"><p className="font-semibold text-secondary">SAHAR</p><h1 className="mt-2 font-display text-4xl font-bold">{order.orderNumber}</h1><p className="mt-3 text-lg font-semibold text-primary" role="status" aria-live="polite">{labels[order.status]?.[locale] ?? order.status}</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><Card><h2 className="font-semibold">{locale === "de" ? "Bestellung" : "Order"}</h2><ul className="mt-3 space-y-3">{order.items.map((item) => <li key={item.id} className="flex justify-between gap-3"><span>{item.quantity}? {item.name}<small className="block text-muted">{[item.variant, ...item.options].filter(Boolean).join(", ")}</small></span><span>{formatChf(item.lineSubtotalRappen, locale)}</span></li>)}</ul><p className="mt-4 flex justify-between border-t pt-3 font-bold"><span>Total</span><span>{formatChf(order.totalRappen, locale)}</span></p></Card><Card><h2 className="font-semibold">{locale === "de" ? "Verlauf" : "Timeline"}</h2><ol className="mt-3 space-y-3">{order.timeline.map((event, index) => <li key={`${event.status}-${index}`}><strong>{labels[event.status]?.[locale] ?? event.status}</strong><time className="block text-sm text-muted">{new Intl.DateTimeFormat(locale === "de" ? "de-CH" : "en-CH", { timeZone: "Europe/Zurich", dateStyle: "medium", timeStyle: "short" }).format(new Date(event.at))}</time></li>)}</ol></Card></div></div>;
}
