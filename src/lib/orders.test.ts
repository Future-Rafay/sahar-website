import assert from "node:assert/strict";
import test from "node:test";

import { assertOptionCount, formatOrderNumber, nextOrderStatus, promoDiscount } from "@/lib/orders";
import { zurichDateToUtc, zurichParts } from "@/lib/zurich-time";

test("order money and lifecycle rules stay server-shaped", () => {
  assert.equal(formatOrderNumber(42), "SAH-000042");
  assert.equal(promoDiscount(5_000, { type: "PERCENT", value: 1_000, minimumSubtotalRappen: 2_500 }), 500);
  assert.equal(promoDiscount(300, { type: "FIXED", value: 500, minimumSubtotalRappen: 0 }), 300);
  assert.equal(nextOrderStatus("PREPARING", "PICKUP"), "READY_FOR_PICKUP");
  assert.equal(nextOrderStatus("PREPARING", "DELIVERY"), "OUT_FOR_DELIVERY");
  assert.equal(nextOrderStatus("COMPLETED", "DELIVERY"), null);
  assert.equal(assertOptionCount({ minimumSelections: 1, maximumSelections: 2 }, 2), true);
  assert.equal(assertOptionCount({ minimumSelections: 1, maximumSelections: 2 }, 3), false);
});

test("Zurich local slots convert correctly across daylight saving time", () => {
  const winter = zurichDateToUtc("2026-01-15", 12 * 60);
  const summer = zurichDateToUtc("2026-07-15", 12 * 60);
  assert.equal(winter.toISOString(), "2026-01-15T11:00:00.000Z");
  assert.equal(summer.toISOString(), "2026-07-15T10:00:00.000Z");
  assert.deepEqual(zurichParts(summer), { date: "2026-07-15", weekday: "WEDNESDAY", minute: 720 });
});
