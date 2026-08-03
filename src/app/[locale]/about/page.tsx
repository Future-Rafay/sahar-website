import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { saharMockCopy, saharRealContent } from "@/content/phase-1";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  const de = locale === "de";

  const aboutText = de ? saharMockCopy.aboutDe : saharMockCopy.aboutEn;

  const values = [
    {
      title: de ? "Authentische Rezepte" : "Authentic Recipes",
      desc: de
        ? "Rezepturen mit traditionellen Gewürzen, echtem iranischen Safran und feinsten Zutaten."
        : "Traditional recipes with authentic spices, genuine Iranian saffron, and finest ingredients.",
      icon: (
        <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: de ? "Frische & Qualität" : "Freshness & Quality",
      desc: de
        ? "Täglich frisch zubereiteter Safranreis, langsam geschmorte Eintöpfe und zarte Grillgerichte."
        : "Freshly prepared saffron rice daily, slow-simmered stews, and tender grilled specialties.",
      icon: (
        <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: de ? "Persische Gastfreundschaft" : "Persian Hospitality",
      desc: de
        ? "Gastfreundschaft hat in der persischen Kultur höchsten Stellenwert. Wir empfangen Sie wie Familie."
        : "Hospitality holds the highest value in Persian culture. We welcome you like family.",
      icon: (
        <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative isolate py-20 bg-surface-warm border-b border-border/80 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
            SAHAR RESTAURANT WALLISELLEN
          </span>
          <h1 className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
            {de ? "Über SAHAR" : "About SAHAR"}
          </h1>
          <p className="text-muted text-lg leading-relaxed">
            {de
              ? "Die Geschichte von Sahar — Eine kulinarische Reise durch die Aromen Persiens im Herzen von Zürich."
              : "The Story of Sahar — A culinary journey through the flavours of Persia in the heart of Zurich."}
          </p>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
              {de ? "Unsere Philosophie" : "Our Philosophy"}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-primary leading-tight">
              {de ? "Authentische Küche & Traditionelles Handwerk" : "Authentic Cuisine & Traditional Craft"}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-muted">
              {aboutText.trim()}
            </p>
            <p className="text-sm leading-relaxed text-muted">
              {de
                ? "Der Name 'Sahar' bedeutet Dämmerung und Morgenröte — das Versprechen eines frischen Tages voller neuer kulinarischer Erlebnisse. Wir legen grossen Wert auf frische Zutaten, traditionelle Gewürzmischungen und sorgfältige Zubereitung."
                : "The name 'Sahar' means dawn — the promise of a fresh day filled with culinary discovery. We emphasize fresh ingredients, traditional spice blends, and meticulous preparation."}
            </p>
          </div>

          <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/placeholders/persian-kebab.jpg"
              alt="SAHAR Persian Grill Specialties"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-surface py-16 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
              {de ? "Wofür wir stehen" : "What We Stand For"}
            </span>
            <h2 className="font-display text-3xl font-bold text-primary">
              {de ? "Unsere Werte" : "Our Core Values"}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {values.map((val, i) => (
              <Card key={i} hover className="p-8 text-center space-y-4 flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
                  {val.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-primary">{val.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{val.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-primary">
            {de ? "Einblicke & Speisen" : "Insights & Dishes"}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden shadow">
            <Image src="/images/placeholders/saffron-rice.jpg" alt="Saffron Rice" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden shadow">
            <Image src="/images/placeholders/gheimeh-tahdig.jpg" alt="Gheimeh Stew" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden shadow">
            <Image src="/images/placeholders/sholeh-zard.jpg" alt="Sholeh Zard Dessert" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden shadow">
            <Image src="/images/placeholders/persian-tea.jpg" alt="Persian Tea" fill className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl plum-gradient text-white p-8 sm:p-12 text-center shadow-xl space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            {de ? "Besuchen Sie uns oder bestellen Sie online" : "Visit us or order online"}
          </h2>
          <p className="text-white/85 max-w-xl mx-auto text-base">
            {saharRealContent.address.street}, {saharRealContent.address.postalCode} {saharRealContent.address.city}
          </p>
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <Link
              href={`/${locale}/menu`}
              className="inline-flex min-h-12 items-center rounded-xl bg-secondary px-8 text-base font-bold text-secondary-foreground shadow hover:bg-secondary-light transition-all"
            >
              {de ? "Zur Speisekarte" : "Go to Menu"}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex min-h-12 items-center rounded-xl border border-white/40 bg-white/10 px-8 text-base font-semibold text-white hover:bg-white/20 transition-all"
            >
              {de ? "Kontaktieren Sie uns" : "Contact Us"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
