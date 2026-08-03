import assert from "node:assert/strict";
import test from "node:test";

import { openingWindowSchema, promoSchema, refundSchema } from "@/server/validators/admin";

test("Phase 4 admin trust boundaries reject unsafe schedule, promo, and refund input", () => {
  assert.equal(openingWindowSchema.safeParse({ fulfillmentType: "DELIVERY", weekday: "MONDAY", startMinute: 900, endMinute: 800, active: "on", sortOrder: 0 }).success, false);
  assert.equal(promoSchema.safeParse({ code: "TOO-MUCH", type: "PERCENT", value: 10001, minimumSubtotalRappen: 0, startsAt: "", endsAt: "", totalUsageLimit: "", perCustomerLimit: "", active: "on" }).success, false);
  assert.equal(refundSchema.safeParse({ orderNumber: "SAH-000123", amountRappen: 0, reason: "requested", refundKey: crypto.randomUUID(), cancelOrder: "false" }).success, false);
});
