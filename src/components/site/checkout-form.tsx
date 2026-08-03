"use client";

import { useEffect, useState, type FormEvent } from "react";

import { useCart } from "@/components/site/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatChf } from "@/lib/orders";

type Quote = { subtotalRappen: number; discountRappen: number; deliveryFeeRappen: number; totalRappen: number };
type Slot = { id: string; startsAt: string; capacity: number; bookedCount: number };

const messages: Record<string, { de: string; en: string }> = {
  POSTCODE_NOT_DELIVERABLE: { de: "An diese Postleitzahl liefern wir derzeit nicht.", en: "We do not currently deliver to this postcode." },
  DELIVERY_MINIMUM_NOT_MET: { de: "Der Mindestbestellwert ist noch nicht erreicht.", en: "The delivery minimum has not been reached." },
  PRODUCT_UNAVAILABLE: { de: "Ein Artikel ist nicht mehr verf?gbar.", en: "An item is no longer available." },
  PRODUCT_UNAVAILABLE_AT_TIME: { de: "Ein Artikel ist zur gew?hlten Zeit nicht verf?gbar.", en: "An item is unavailable at the selected time." },
  PROMO_INVALID: { de: "Dieser Gutscheincode ist ung?ltig.", en: "This promo code is invalid." },
  PROMO_LIMIT_REACHED: { de: "Dieser Gutschein kann nicht mehr verwendet werden.", en: "This promo code can no longer be used." },
  SLOT_FULL: { de: "Dieser Termin ist inzwischen ausgebucht.", en: "That slot has just filled up." },
  INVALID_INPUT: { de: "Bitte pr?fen Sie Ihre Eingaben.", en: "Please check your details." },
};

export function CheckoutForm({ locale, user }: { locale: "de" | "en"; user?: { name?: string | null; email?: string | null } }) {
  const { items, clear } = useCart();
  const [fulfillmentType, setFulfillmentType] = useState<"DELIVERY" | "PICKUP">("PICKUP");
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "CASH_ON_DELIVERY" | "PAY_AT_PICKUP">("PAY_AT_PICKUP");
  const [timing, setTiming] = useState<"ASAP" | "SCHEDULED">("ASAP");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [scheduledFor, setScheduledFor] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (timing !== "SCHEDULED" || !date) return;
    fetch(`/api/v1/public/slots?fulfillmentType=${fulfillmentType}&date=${date}`)
      .then((response) => response.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]));
  }, [date, fulfillmentType, timing]);

  const cartPayload = items.map(({ variantId, choiceIds, quantity }) => ({ variantId, choiceIds, quantity }));
  const showError = (code: string) => setError(messages[code]?.[locale] ?? (locale === "de" ? "Etwas ist schiefgelaufen." : "Something went wrong."));

  async function requestQuote(form: HTMLFormElement) {
    const data = new FormData(form);
    const response = await fetch("/api/v1/customer/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartPayload,
        fulfillmentType,
        scheduledFor: timing === "SCHEDULED" ? scheduledFor : null,
        postcode: fulfillmentType === "DELIVERY" ? data.get("postalCode") : undefined,
        promoCode: data.get("promoCode") || undefined,
        customerEmail: data.get("customerEmail") || undefined,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    setQuote(result);
    return result as Quote;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return showError("INVALID_INPUT");
    if (timing === "SCHEDULED" && !scheduledFor) return showError("INVALID_INPUT");
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await requestQuote(form);
      const address = fulfillmentType === "DELIVERY" ? {
        recipientName: data.get("customerName"),
        phone: data.get("customerPhone"),
        street: data.get("street"),
        streetExtra: data.get("streetExtra") || undefined,
        postalCode: data.get("postalCode"),
        city: data.get("city"),
      } : undefined;
      const response = await fetch("/api/v1/customer/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutKey: crypto.randomUUID(),
          locale,
          items: cartPayload,
          fulfillmentType,
          scheduledFor: timing === "SCHEDULED" ? scheduledFor : null,
          postcode: fulfillmentType === "DELIVERY" ? data.get("postalCode") : undefined,
          promoCode: data.get("promoCode") || undefined,
          customerName: data.get("customerName"),
          customerEmail: data.get("customerEmail"),
          customerPhone: data.get("customerPhone"),
          paymentMethod,
          note: data.get("note") || undefined,
          address,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      clear();
      window.location.assign(result.checkoutUrl ?? `/${locale}/order/${result.orderNumber}?token=${result.trackingToken}`);
    } catch (caught) {
      showError(caught instanceof Error ? caught.message : "");
      setBusy(false);
    }
  }

  if (items.length === 0) return <Card><p>{locale === "de" ? "Ihr Warenkorb ist leer." : "Your cart is empty."}</p></Card>;

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-6">
        <Card>
          <h2 className="font-display text-xl font-semibold">{locale === "de" ? "Abholung oder Lieferung" : "Pickup or delivery"}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(["PICKUP", "DELIVERY"] as const).map((type) => <label key={type} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4"><input type="radio" name="fulfillment" checked={fulfillmentType === type} onChange={() => { setFulfillmentType(type); setPaymentMethod(type === "PICKUP" ? "PAY_AT_PICKUP" : "CASH_ON_DELIVERY"); setQuote(null); }} />{type === "PICKUP" ? (locale === "de" ? "Abholung" : "Pickup") : (locale === "de" ? "Lieferung" : "Delivery")}</label>)}
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-xl font-semibold">{locale === "de" ? "Zeit" : "Time"}</h2>
          <div className="mt-4 flex gap-4"><label className="flex min-h-11 items-center gap-2"><input type="radio" checked={timing === "ASAP"} onChange={() => { setTiming("ASAP"); setScheduledFor(""); }} />ASAP</label><label className="flex min-h-11 items-center gap-2"><input type="radio" checked={timing === "SCHEDULED"} onChange={() => setTiming("SCHEDULED")} />{locale === "de" ? "Geplant" : "Scheduled"}</label></div>
          {timing === "SCHEDULED" && <div className="mt-4 grid gap-4 sm:grid-cols-2"><div><Label htmlFor="slot-date">{locale === "de" ? "Datum" : "Date"}</Label><Input id="slot-date" type="date" value={date} onChange={(event) => { setDate(event.target.value); setScheduledFor(""); }} required /></div><div><Label htmlFor="slot">{locale === "de" ? "Zeitfenster" : "Time slot"}</Label><select id="slot" className="mt-1 min-h-11 w-full rounded-xl border bg-surface px-3" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} required><option value="">{locale === "de" ? "Bitte w?hlen" : "Choose"}</option>{slots.map((slot) => <option key={slot.id} value={slot.startsAt}>{new Intl.DateTimeFormat(locale === "de" ? "de-CH" : "en-CH", { timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit" }).format(new Date(slot.startsAt))}</option>)}</select></div></div>}
        </Card>
        <Card>
          <h2 className="font-display text-xl font-semibold">{locale === "de" ? "Kontaktdaten" : "Contact details"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field id="customerName" label={locale === "de" ? "Name" : "Name"} defaultValue={user?.name ?? ""} autoComplete="name" />
            <Field id="customerEmail" label="Email" type="email" defaultValue={user?.email ?? ""} autoComplete="email" />
            <Field id="customerPhone" label={locale === "de" ? "Telefon" : "Phone"} type="tel" autoComplete="tel" />
          </div>
          {fulfillmentType === "DELIVERY" && <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field id="street" label={locale === "de" ? "Strasse und Hausnummer" : "Street and number"} autoComplete="street-address" /><Field id="streetExtra" label={locale === "de" ? "Adresszusatz (optional)" : "Address extra (optional)"} required={false} /><Field id="postalCode" label={locale === "de" ? "Postleitzahl" : "Postcode"} inputMode="numeric" pattern="[0-9]{4}" autoComplete="postal-code" /><Field id="city" label={locale === "de" ? "Ort" : "City"} autoComplete="address-level2" /></div>}
          <div className="mt-4"><Label htmlFor="note">{locale === "de" ? "Hinweis (optional)" : "Note (optional)"}</Label><textarea id="note" name="note" maxLength={1000} className="mt-1 min-h-24 w-full rounded-xl border bg-surface p-3" /></div>
        </Card>
        <Card>
          <h2 className="font-display text-xl font-semibold">{locale === "de" ? "Zahlung" : "Payment"}</h2>
          <div className="mt-4 space-y-2">
            <label className="flex min-h-11 items-center gap-3 rounded-xl border px-4"><input type="radio" checked={paymentMethod === "STRIPE"} onChange={() => setPaymentMethod("STRIPE")} />{locale === "de" ? "Karte (Stripe)" : "Card (Stripe)"}</label>
            <label className="flex min-h-11 items-center gap-3 rounded-xl border px-4"><input type="radio" checked={paymentMethod !== "STRIPE"} onChange={() => setPaymentMethod(fulfillmentType === "PICKUP" ? "PAY_AT_PICKUP" : "CASH_ON_DELIVERY")} />{fulfillmentType === "PICKUP" ? (locale === "de" ? "Bei Abholung bezahlen" : "Pay at pickup") : (locale === "de" ? "Bar bei Lieferung" : "Cash on delivery")}</label>
          </div>
        </Card>
      </div>
      <aside>
        <Card className="sticky top-24">
          <h2 className="font-display text-xl font-semibold">{locale === "de" ? "Zusammenfassung" : "Summary"}</h2>
          <ul className="mt-4 space-y-2 text-sm">{items.map((item) => <li key={item.key} className="flex justify-between gap-3"><span>{item.quantity}? {item.productName}</span><span>{formatChf(item.unitPriceRappen * item.quantity, locale)}</span></li>)}</ul>
          <div className="mt-4"><Label htmlFor="promoCode">{locale === "de" ? "Gutscheincode" : "Promo code"}</Label><Input id="promoCode" name="promoCode" maxLength={64} /></div>
          {quote && <dl className="mt-4 space-y-2 border-t pt-4 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{formatChf(quote.subtotalRappen, locale)}</dd></div><div className="flex justify-between"><dt>{locale === "de" ? "Rabatt" : "Discount"}</dt><dd>? {formatChf(quote.discountRappen, locale)}</dd></div><div className="flex justify-between"><dt>{locale === "de" ? "Lieferung" : "Delivery"}</dt><dd>{formatChf(quote.deliveryFeeRappen, locale)}</dd></div><div className="flex justify-between border-t pt-2 text-base font-bold"><dt>Total</dt><dd>{formatChf(quote.totalRappen, locale)}</dd></div></dl>}
          {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
          <Button type="submit" className="mt-5 w-full" disabled={busy}>{busy ? (locale === "de" ? "Wird verarbeitet?" : "Processing?") : (locale === "de" ? "Bestellung pr?fen & aufgeben" : "Review & place order")}</Button>
          <p className="mt-3 text-xs leading-5 text-muted">{locale === "de" ? "Preise, Verf?gbarkeit, Lieferzone und Termin werden sicher auf dem Server gepr?ft." : "Prices, availability, delivery area, and slot are securely checked on the server."}</p>
        </Card>
      </aside>
    </form>
  );
}

function Field({ id, label, required = true, ...props }: { id: string; label: string; required?: boolean } & React.ComponentProps<typeof Input>) {
  return <div><Label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</Label><Input id={id} name={id} required={required} aria-required={required} {...props} /></div>;
}
