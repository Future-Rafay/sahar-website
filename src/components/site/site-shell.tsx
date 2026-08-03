"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useCart } from "@/components/site/cart-context";

export function SiteShell({ locale, children }: { locale: "de" | "en"; children: ReactNode }) {
  const other = locale === "de" ? "en" : "de";
  const labels = locale === "de"
    ? { home: "Start", menu: "Men?", about: "?ber uns", contact: "Kontakt", account: "Bestellungen", cart: "Warenkorb", language: "English" }
    : { home: "Home", menu: "Menu", about: "About", contact: "Contact", account: "Orders", cart: "Cart", language: "Deutsch" };
  const { count } = useCart();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b bg-surface/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center gap-4 px-4">
          <Link href={`/${locale}`} className="font-display text-xl font-bold tracking-wide text-primary">SAHAR</Link>
          <nav aria-label="Main navigation" className="ml-auto flex items-center gap-1 overflow-x-auto text-sm">
            <Link className="min-h-11 content-center rounded-lg px-3 hover:bg-background" href={`/${locale}`}>{labels.home}</Link>
            <Link className="min-h-11 content-center rounded-lg px-3 hover:bg-background" href={`/${locale}/menu`}>{labels.menu}</Link>
            <Link className="hidden min-h-11 content-center rounded-lg px-3 hover:bg-background sm:block" href={`/${locale}/about`}>{labels.about}</Link>
            <Link className="hidden min-h-11 content-center rounded-lg px-3 hover:bg-background sm:block" href={`/${locale}/contact`}>{labels.contact}</Link>
            <Link className="hidden min-h-11 content-center rounded-lg px-3 hover:bg-background md:block" href={`/${locale}/account/orders`}>{labels.account}</Link>
            <Link className="min-h-11 content-center rounded-lg bg-primary px-3 font-semibold text-primary-foreground" href={`/${locale}/cart`}>
              {labels.cart} ({count})
            </Link>
            <Link className="min-h-11 content-center rounded-lg px-2 text-muted hover:text-foreground" href={`/${other}`} hrefLang={other}>{labels.language}</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 border-t bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-5 px-4 py-8 text-sm text-muted">
          <span>? {new Date().getFullYear()} SAHAR Restaurant</span>
          <Link href={`/${locale}/privacy`}>Privacy</Link>
          <Link href={`/${locale}/terms`}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}
