"use client";

import Link from "next/link";

import { useCart } from "@/components/site/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatChf } from "@/lib/orders";

export function CartPage({ locale }: { locale: "de" | "en" }) {
  const { items, remove } = useCart();
  const de = locale === "de";
  const total = items.reduce((sum, item) => sum + item.unitPriceRappen * item.quantity, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-border/60 pb-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
            SAHAR
          </span>
          <h1 className="font-display text-4xl font-extrabold text-primary mt-1">
            {de ? "Ihr Warenkorb" : "Your Cart"}
          </h1>
        </div>
        {items.length > 0 && (
          <span className="rounded-full bg-secondary/15 px-4 py-1 text-xs font-bold text-secondary-light">
            {items.length} {de ? (items.length === 1 ? "Position" : "Positionen") : (items.length === 1 ? "Item" : "Items")}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="p-12 text-center space-y-6 max-w-xl mx-auto">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-primary">
              {de ? "Ihr Warenkorb ist noch leer" : "Your cart is empty"}
            </h2>
            <p className="text-sm text-muted">
              {de
                ? "Entdecken Sie unsere persischen Kebabs, Safranreis und hausgemachten Eintöpfe."
                : "Explore our Persian kebabs, saffron rice, and homemade stews."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href={`/${locale}/menu`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow hover:bg-primary-light transition-all"
            >
              {de ? "Zur Speisekarte" : "Browse Menu"}
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          {/* Cart Items List */}
          <div className="space-y-4">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.key}>
                  <Card hover className="p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                      <h2 className="font-display text-lg font-bold text-foreground">
                        {item.productName}
                      </h2>
                      <p className="text-xs text-muted flex items-center gap-2">
                        <span className="rounded bg-background px-2 py-0.5 font-semibold text-primary">
                          {item.variantName}
                        </span>
                        <span>•</span>
                        <span>
                          {de ? "Menge" : "Qty"}: <strong className="text-foreground">{item.quantity}</strong>
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <strong className="font-display text-lg font-bold text-primary">
                        {formatChf(item.unitPriceRappen * item.quantity, locale)}
                      </strong>
                      <Button
                        variant="ghost"
                        size="compact"
                        onClick={() => remove(item.key)}
                        aria-label={de ? `${item.productName} entfernen` : `Remove ${item.productName}`}
                        className="text-muted hover:text-destructive hover:bg-destructive/10"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href={`/${locale}/menu`}
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
              >
                <span>← {de ? "Weiter stöbern" : "Continue browsing"}</span>
              </Link>
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div>
            <Card className="sticky top-24 p-6 space-y-6 border-secondary/30 bg-surface shadow-lg">
              <h2 className="font-display text-xl font-bold text-primary border-b border-border/60 pb-3">
                {de ? "Zusammenfassung" : "Summary"}
              </h2>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <dt>{de ? "Zwischensumme" : "Subtotal"}</dt>
                  <dd className="font-semibold text-foreground">{formatChf(total, locale)}</dd>
                </div>
                <div className="flex justify-between text-xs text-muted/80">
                  <dt>{de ? "Lieferung & Steuern" : "Delivery & Tax"}</dt>
                  <dd>{de ? "Wird im nächsten Schritt berechnet" : "Calculated at next step"}</dd>
                </div>

                <div className="flex justify-between border-t border-border/80 pt-3 text-lg font-bold text-primary">
                  <dt>Gesamt</dt>
                  <dd className="font-display">{formatChf(total, locale)}</dd>
                </div>
              </dl>

              <Link
                href={`/${locale}/checkout`}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-md transition-all hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5"
              >
                {de ? "Zur Kasse →" : "Proceed to Checkout →"}
              </Link>

              <p className="text-center text-[11px] text-muted">
                🔒 {de ? "Sichere 256-Bit SSL Verschlüsselung" : "Secure 256-bit SSL encryption"}
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
