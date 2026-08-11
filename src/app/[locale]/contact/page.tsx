import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/site/contact-form";
import { saharMockDeliveryZones, saharRealContent } from "@/content/phase-1";
import { localizedMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata((await params).locale, "/contact", { de: "Kontakt und Anfahrt", en: "Contact and location" }, { de: "Kontaktieren Sie Sahar oder finden Sie das Restaurant in Wallisellen.", en: "Contact Sahar or find the restaurant in Wallisellen." });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  const de = locale !== "en";

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative py-16 bg-surface-warm border-b border-border/80 text-center">
        <div className="mx-auto max-w-3xl px-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
            SAHAR RESTAURANT
          </span>
          <h1 className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
            {de ? "Kontakt & Anfahrt" : "Contact & Location"}
          </h1>
          <p className="text-muted text-base">
            {de
              ? "Wir freuen uns auf Ihren Besuch in Wallisellen oder Ihre Anfrage."
              : "We look forward to your visit in Wallisellen or your inquiry."}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Card 1: Address */}
          <Card hover className="p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-primary">{de ? "Adresse" : "Address"}</h2>
              <address className="not-italic text-sm text-muted leading-relaxed space-y-1">
                <p className="font-semibold text-foreground">{saharRealContent.legalBusinessName}</p>
                <p>{saharRealContent.address.street}</p>
                <p>{saharRealContent.address.postalCode} {saharRealContent.address.city}</p>
                <p>{saharRealContent.address.region}, {saharRealContent.address.country}</p>
              </address>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${saharRealContent.address.street}, ${saharRealContent.address.postalCode} ${saharRealContent.address.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors pt-2"
            >
              <span>{de ? "Auf Google Maps öffnen →" : "Open in Google Maps →"}</span>
            </a>
          </Card>

          {/* Card 2: Phone & Email */}
          <Card hover className="p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-primary">{de ? "Direktkontakt" : "Direct Contact"}</h2>
              <div className="space-y-3 text-sm text-muted">
                <div>
                  <span className="block text-xs text-muted/70 font-semibold uppercase">{de ? "Telefon" : "Phone"}</span>
                  <a href={`tel:${saharRealContent.phone.replace(/\s/g, "")}`} className="font-bold text-foreground hover:text-primary transition-colors text-base">
                    {saharRealContent.phone}
                  </a>
                </div>
                <div>
                  <span className="block text-xs text-muted/70 font-semibold uppercase">Email</span>
                  <a href={`mailto:${saharRealContent.email}`} className="font-bold text-foreground hover:text-primary transition-colors">
                    {saharRealContent.email}
                  </a>
                </div>
              </div>
            </div>
            <a
              href={saharRealContent.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors pt-2"
            >
              <span>Instagram: @saharzurich →</span>
            </a>
          </Card>

          {/* Card 3: Opening Hours */}
          <Card hover className="p-8 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold text-primary">{de ? "Öffnungszeiten" : "Opening Hours"}</h2>
            <dl className="space-y-2 text-sm text-muted">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span>{de ? "Montag – Freitag" : "Monday – Friday"}</span>
                <strong className="text-foreground">{saharRealContent.openingHours.mondayToFriday}</strong>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span>{de ? "Samstag" : "Saturday"}</span>
                <strong className="text-foreground">{saharRealContent.openingHours.saturday}</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span>{de ? "Sonntag" : "Sunday"}</span>
                <strong className="text-destructive">{de ? "Geschlossen" : "Closed"}</strong>
              </div>
            </dl>
            <p className="text-xs text-muted/80 pt-2">{saharRealContent.openingHours.holidayNote}</p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6" aria-labelledby="contact-form-heading">
        <Card className="p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">{de ? "Schreiben Sie uns" : "Send a message"}</p>
          <h2 id="contact-form-heading" className="mt-2 font-display text-2xl font-bold text-primary">{de ? "Wie können wir helfen?" : "How can we help?"}</h2>
          <p className="mb-6 mt-2 text-sm text-muted">{de ? "Wir antworten so bald wie möglich per E-Mail." : "We will reply by email as soon as possible."}</p>
          <ContactForm locale={locale} />
        </Card>
      </section>

      {/* Delivery Zones Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
              {de ? "Liefergebiete" : "Delivery Coverage"}
            </span>
            <h2 className="font-display text-2xl font-bold text-primary">
              {de ? "Übersicht der Lieferzonen" : "Delivery Zones Overview"}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {saharMockDeliveryZones.map((zone, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-4 space-y-2">
                <p className="font-bold text-primary text-base">{zone.nameDe.trim()}</p>
                <p className="text-xs text-muted">PLZ: {zone.postalCodes.join(", ").trim()}</p>
                <div className="pt-2 text-xs flex justify-between font-semibold border-t border-border/60">
                  <span>Lieferung: {zone.deliveryFee.trim()}</span>
                  <span>Mindestbestellung: {zone.minimumOrder.trim()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <Link
          href={`/${locale}/menu`}
          className="inline-flex min-h-12 items-center rounded-xl bg-secondary px-8 text-base font-bold text-secondary-foreground shadow-lg hover:bg-secondary-light transition-all"
        >
          {de ? "Jetzt online bestellen" : "Order online now"}
        </Link>
      </section>
    </div>
  );
}

