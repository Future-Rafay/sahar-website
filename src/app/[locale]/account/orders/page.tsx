import Link from "next/link";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { formatChf } from "@/lib/orders";
import { getCurrentUser } from "@/server/auth/current-user";
import { getCustomerOrders } from "@/server/services/ordering";

export default async function AccountOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  const orders = await getCustomerOrders(user.id);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">{locale === "de" ? "Meine Bestellungen" : "My orders"}</h1>
      {orders.length === 0 ? (
        <Card className="mt-8"><p>{locale === "de" ? "Noch keine Bestellungen." : "No orders yet."}</p></Card>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {orders.map((order) => (
            <li key={order.orderNumber}>
              <Link href={`/${locale}/order/${order.orderNumber}`}>
                <Card className="h-full transition hover:border-primary">
                  <div className="flex justify-between gap-4"><strong>{order.orderNumber}</strong><span>{formatChf(order.totalRappen, locale)}</span></div>
                  <p className="mt-2 text-sm text-muted">{order.status.replaceAll("_", " ")}</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
