import assert from "node:assert/strict";
import { test } from "node:test";

import { allowedOrderActions } from "@/server/services/staff-mobile-actions";

test("staff allowed actions keep refund-required Stripe orders out of routine cancellation", () => {
  assert.deepEqual(
    allowedOrderActions({
      status: "CONFIRMED",
      fulfillmentType: "DELIVERY",
      payment: { provider: "STRIPE", status: "PAID" },
    }),
    { nextStatus: "PREPARING", canConfirmCash: false, canCancel: false },
  );
});

test("staff allowed actions expose routine cash confirmation and cancellation", () => {
  assert.deepEqual(
    allowedOrderActions({
      status: "CONFIRMED",
      fulfillmentType: "PICKUP",
      payment: { provider: "CASH", status: "PENDING" },
    }),
    { nextStatus: "PREPARING", canConfirmCash: true, canCancel: true },
  );
});
