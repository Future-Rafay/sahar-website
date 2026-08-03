import Link from "next/link";

import { AdminPage, Empty, Notice } from "@/components/admin/admin-ui";
import { Card } from "@/components/ui/card";
import { formatChf } from "@/lib/orders";
import { getOrderHistory } from "@/server/services/admin";

const statuses = ["ALL", "PAYMENT_PENDING", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; saved?: string; error?: string }> }) {
  const query = await searchParams;
  const orders = await getOrderHistory(query.status);
  return <AdminPage title="Order history" description="The latest 200 orders, including completed and cancelled orders."><Notice {...query} /><form className="mb-5 flex flex-wrap items-end gap-3"><div><label htmlFor="status" className="block text-sm font-semibold">Status</label><select id="status" name="status" defaultValue={query.status ?? "ALL"} className="mt-1 min-h-11 rounded-[var(--radius-control)] border bg-surface px-3">{statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></div><button className="min-h-11 rounded-[var(--radius-control)] bg-primary px-5 text-sm font-semibold text-primary-foreground" type="submit">Filter</button></form>{orders.length === 0 ? <Empty>No orders match this filter.</Empty> : <div className="overflow-x-auto rounded-[var(--radius-card)] border bg-surface"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b bg-background"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Placed</th><th className="p-4">Status</th><th className="p-4">Payment</th><th className="p-4 text-right">Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b last:border-0"><td className="p-4"><Link className="font-semibold text-primary underline-offset-4 hover:underline" href={`/admin/orders/${order.orderNumber}`}>{order.orderNumber}</Link><br /><span className="text-xs text-muted">{order.fulfillmentType}</span></td><td className="p-4">{order.customerName}<br /><span className="text-xs text-muted">{order.customerEmail}</span></td><td className="p-4">{new Date(order.createdAt).toLocaleString("en-CH", { timeZone: "Europe/Zurich" })}</td><td className="p-4 font-semibold">{order.status.replaceAll("_", " ")}</td><td className="p-4">{order.payment?.status ?? "—"}</td><td className="p-4 text-right font-semibold">{formatChf(order.totalRappen, "en")}</td></tr>)}</tbody></table></div>}</AdminPage>;
}
