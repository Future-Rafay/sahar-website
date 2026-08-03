"use client";

import Link from "next/link";

import { useCart } from "@/components/site/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatChf } from "@/lib/orders";

export function CartPage({ locale }: { locale: "de" | "en" }) {
  const { items, remove } = useCart();
  const total = items.reduce((sum, item) => sum + item.unitPriceRappen * item.quantity, 0);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">{locale === "de" ? "Warenkorb" : "Cart"}</h1>
      {items.length === 0 ? <Card className="mt-8"><p>{locale === "de" ? "Ihr Warenkorb ist leer." : "Your cart is empty."}</p><Link className="mt-4 inline-block text-primary underline" href={`/${locale}/menu`}>{locale === "de" ? "Zum Men?" : "Browse menu"}</Link></Card> : (
        <>
          <ul className="mt-8 space-y-3">
            {items.map((item) => <li key={item.key}><Card className="flex items-center gap-4"><div><h2 className="font-semibold">{item.productName}</h2><p className="text-sm text-muted">{item.variantName} ? {locale === "de" ? "Menge" : "Qty"} {item.quantity}</p></div><strong className="ml-auto">{formatChf(item.unitPriceRappen * item.quantity, locale)}</strong><Button variant="ghost" size="compact" onClick={() => remove(item.key)} aria-label={locale === "de" ? `${item.productName} entfernen` : `Remove ${item.productName}`}>{locale === "de" ? "Entfernen" : "Remove"}</Button></Card></li>)}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t pt-6"><strong className="text-xl">{formatChf(total, locale)}</strong><Link href={`/${locale}/checkout`} className="inline-flex min-h-11 items-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground">{locale === "de" ? "Zur Kasse" : "Checkout"}</Link></div>
        </>
      )}
    </div>
  );
}
