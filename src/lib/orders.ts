import { createHash } from "node:crypto";

import type { FulfillmentType, OrderStatus, PromoType } from "@/generated/prisma/enums";

export function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function formatOrderNumber(id: bigint | number | string) {
  return `SAH-${id.toString().padStart(6, "0")}`;
}

export function parseOrderNumber(value: string) {
  const match = /^SAH-(\d+)$/.exec(value.toUpperCase());
  return match ? BigInt(match[1]) : null;
}

export function formatChf(rappen: number, locale: "de" | "en" = "de") {
  return new Intl.NumberFormat(locale === "de" ? "de-CH" : "en-CH", {
    style: "currency",
    currency: "CHF",
  }).format(rappen / 100);
}

export function promoDiscount(
  subtotalRappen: number,
  promo: { type: PromoType; value: number; minimumSubtotalRappen: number } | null,
) {
  if (!promo || subtotalRappen < promo.minimumSubtotalRappen) return 0;
  const discount =
    promo.type === "FIXED"
      ? promo.value
      : Math.round((subtotalRappen * Math.min(promo.value, 10_000)) / 10_000);
  return Math.max(0, Math.min(subtotalRappen, discount));
}

export function nextOrderStatus(status: OrderStatus, fulfillmentType: FulfillmentType) {
  const transitions: Partial<Record<OrderStatus, OrderStatus>> =
    fulfillmentType === "PICKUP"
      ? {
          CONFIRMED: "PREPARING",
          PREPARING: "READY_FOR_PICKUP",
          READY_FOR_PICKUP: "COMPLETED",
        }
      : {
          CONFIRMED: "PREPARING",
          PREPARING: "OUT_FOR_DELIVERY",
          OUT_FOR_DELIVERY: "COMPLETED",
        };
  return transitions[status] ?? null;
}

export function assertOptionCount(
  group: { minimumSelections: number; maximumSelections: number },
  selectedCount: number,
) {
  return selectedCount >= group.minimumSelections && selectedCount <= group.maximumSelections;
}
