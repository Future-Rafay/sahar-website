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
  const de = locale === "de";

  useEffect(() => {
    const timer = window.setInterval(async () => {
      const response = await fetch(`/api/v1/customer/orders/${order.orderNumber}${token ? `?token=${encodeURIComponent(token)}` : ""}`);
      if (response.ok) setOrder((await response.json()).order);
    }, 10_000);
    return () => window.clearInterval(timer);
  }, [order.orderNumber, token]);

  const labels: Record<string, { de: string; en: string }> = {
    PAYMENT_PENDING: { de: "Zahlung ausstehend", en: "Payment pending" },
    CONFIRMED: { de: "Bestätigt", en: "Confirmed" },
    PREPARING: { de: "In Zubereitung", en: "Preparing" },
    READY_FOR_PICKUP: { de: "Abholbereit", en: "Ready for pickup" },
    OUT_FOR_DELIVERY: { de: "Unterwegs", en: "Out for delivery" },
    COMPLETED: { de: "Abgeschlossen", en: "Completed" },
    CANCELLED: { de: "Storniert", en: "Cancelled" },
  };

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-blue-600 text-white",
    PREPARING: "bg-amber-600 text-white animate-pulse",
    READY_FOR_PICKUP: "bg-emerald-600 text-white",
    OUT_FOR_DELIVERY: "bg-secondary text-secondary-foreground animate-pulse",
    COMPLETED: "bg-success text-white",
    CANCELLED: "bg-destructive text-white",
    PAYMENT_PENDING: "bg-muted text-foreground",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-border/60 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
            SAHAR RESTAURANT
          </span>
          <h1 className="font-display text-4xl font-extrabold text-primary mt-1">
            {order.orderNumber}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className={`rounded-full px-4 py-1.5 text-xs font-bold shadow ${statusColors[order.status] ?? "bg-primary text-white"}`}>
            {labels[order.status]?.[locale] ?? order.status}
          </span>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Card 1: Order Details */}
        <Card className="p-6 space-y-6">
          <h2 className="font-display text-xl font-bold text-primary border-b border-border/60 pb-3">
            {de ? "Bestellte Artikel" : "Ordered Items"}
          </h2>

          <ul className="space-y-4 divide-y divide-border/40 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="pt-3 flex justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-foreground">{item.quantity}× {item.name}</span>
                  <small className="block text-xs text-muted">
                    {[item.variant, ...item.options].filter(Boolean).join(", ")}
                  </small>
                </div>
                <strong className="font-bold text-primary">{formatChf(item.lineSubtotalRappen, locale)}</strong>
              </li>
            ))}
          </ul>

          <div className="flex justify-between border-t border-border/80 pt-4 text-lg font-bold text-primary">
            <span>Total</span>
            <span className="font-display">{formatChf(order.totalRappen, locale)}</span>
          </div>
        </Card>

        {/* Card 2: Timeline */}
        <Card className="p-6 space-y-6">
          <h2 className="font-display text-xl font-bold text-primary border-b border-border/60 pb-3">
            {de ? "Statusverlauf" : "Status History"}
          </h2>

          <ol className="relative border-l-2 border-secondary/40 ml-3 space-y-6">
            {order.timeline.map((event, index) => (
              <li key={`${event.status}-${index}`} className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary ring-4 ring-surface" />
                <strong className="block text-base font-bold text-primary">
                  {labels[event.status]?.[locale] ?? event.status}
                </strong>
                <time className="block text-xs text-muted mt-0.5 font-medium">
                  {new Intl.DateTimeFormat(de ? "de-CH" : "en-CH", { timeZone: "Europe/Zurich", dateStyle: "medium", timeStyle: "short" }).format(new Date(event.at))}
                </time>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

