import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { saharMockCopy, saharMockDeliveryZones, saharRealContent } from "@/content/phase-1";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  const de = locale === "de";

  const heroTitle = de ? saharMockCopy.heroTitleDe : saharMockCopy.heroTitleEn;
  const heroSubtitle = de ? saharMockCopy.heroSubtitleDe : saharMockCopy.heroSubtitleEn;
  const aboutText = de ? saharMockCopy.aboutDe : saharMockCopy.aboutEn;

  const featuredDishes = [
    {
      name: de ? "Kabab Koobideh" : "Kabab Koobideh",
      category: de ? "Kebabs & Grill" : "Kebabs & Grills",
      description: de ? "Zwei Hackfleischspiesse mit Safranreis und Grilltomate." : "Two minced beef skewers with saffron rice and grilled tomato.",
      price: "CHF 27.50",
      image: "/images/placeholders/persian-kebab.jpg",
      tag: de ? "Bestseller" : "Bestseller",
    },
    {
      name: de ? "Baghali Polow ba Mahicheh" : "Baghali Polow with Lamb Shank",
      category: de ? "Reisgerichte (Polow)" : "Rice Dishes (Polow)",
      description: de ? "Dill-Bohnen-Reis mit langsam geschmorter Lammhaxe." : "Dill and broad bean rice with slow-braised lamb shank.",
      price: "CHF 34.50",
      image: "/images/placeholders/saffron-rice.jpg",
      tag: de ? "Spezialität" : "Specialty",
    },
    {
      name: de ? "Ghormeh Sabzi" : "Ghormeh Sabzi",
      category: de ? "Schmorgerichte (Khoresht)" : "Stews (Khoresht)",
      description: de ? "Kräuterschmorgericht mit Bohnen, getrockneter Limette und Rindfleisch, dazu Reis." : "Herb stew with beans, dried lime, and beef, served with rice.",
      price: "CHF 27.00",
      image: "/images/placeholders/gheimeh-tahdig.jpg",
      tag: de ? "Klassiker" : "Classic",
    },
  ];

  const categories = [
    { name: de ? "Vorspeisen" : "Starters", image: "/images/placeholders/saffron-rice.jpg" },
    { name: de ? "Kebabs & Grill" : "Kebabs & Grills", image: "/images/placeholders/persian-kebab.jpg" },
    { name: de ? "Reisgerichte" : "Rice Dishes", image: "/images/placeholders/saffron-rice.jpg" },
    { name: de ? "Schmorgerichte" : "Stews", image: "/images/placeholders/gheimeh-tahdig.jpg" },
    { name: de ? "Desserts" : "Desserts", image: "/images/placeholders/sholeh-zard.jpg" },
    { name: de ? "Getränke" : "Drinks", image: "/images/placeholders/persian-tea.jpg" },
  ];

  return (
    <div className="space-y-20 pb-16 overflow-x-hidden">
      {/* SECTION 1: HERO */}
      <section className="relative isolate min-h-[85dvh] overflow-hidden flex items-center">
        <Image
          src="/images/placeholders/persian-kebab.jpg"
          alt="Persian Cuisine Kebabs at SAHAR"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 flex flex-col justify-center min-h-[85dvh]">
          <div className="max-w-2xl text-white space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/20 px-4 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary-light">
                Wallisellen • Zürich
              </span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1] text-white">
              {heroTitle.trim()}
            </h1>

            <p className="text-lg sm:text-xl leading-relaxed text-white/85 max-w-xl font-normal">
              {heroSubtitle.trim()}
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link
                href={`/${locale}/menu`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-secondary px-8 text-base font-bold text-secondary-foreground shadow-xl transition-all hover:bg-secondary-light hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
              >
                {de ? "Jetzt bestellen" : "Order now"}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-md transition-all hover:border-white hover:bg-white/20"
              >
                {de ? "Über uns" : "About us"}
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Feature Badges */}
        <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-4 text-white/90 text-xs font-medium">
          <div className="flex items-center gap-2 rounded-xl bg-black/40 px-4 py-2.5 backdrop-blur-md border border-white/10">
            <svg className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{de ? "100% Halal Fleisch" : "100% Halal Meat"}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-black/40 px-4 py-2.5 backdrop-blur-md border border-white/10">
            <svg className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{de ? "Lieferung & Abholung" : "Delivery & Pickup"}</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED DISHES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
            {de ? "Kulinarier Highlights" : "Culinary Highlights"}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-primary">
            {de ? "Unsere Spezialitäten" : "Our Signature Dishes"}
          </h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-secondary rounded-full" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDishes.map((dish, i) => (
            <Card key={i} hover className="overflow-hidden p-0 flex flex-col group">
              <div className="relative h-64 w-full bg-surface-warm overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 rounded-full bg-primary/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow">
                  {dish.tag}
                </div>
                <div className="absolute bottom-4 right-4 rounded-xl bg-surface/90 backdrop-blur-md px-3 py-1.5 text-sm font-extrabold text-primary shadow">
                  {dish.price}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    {dish.category}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {dish.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {dish.description}
                  </p>
                </div>
                <Link
                  href={`/${locale}/menu`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
                >
                  <span>{de ? "Im Menü ansehen" : "View in menu"}</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/menu`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-primary/20 bg-surface px-6 text-sm font-bold text-primary hover:border-primary hover:bg-primary/5 transition-all"
          >
            <span>{de ? "Gesamte Speisekarte ansehen" : "Explore full menu"}</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* SECTION 3: ABOUT TEASER */}
      <section className="bg-surface-warm/60 border-y border-border/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative h-80 sm:h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/placeholders/saffron-rice.jpg"
                alt="Persian Saffron Rice & Traditions"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-xl bg-black/30 backdrop-blur-md border border-white/20">
                <p className="font-display font-bold text-lg">{de ? "Authentische persische Rezepte" : "Authentic Persian Recipes"}</p>
                <p className="text-xs text-white/80 mt-0.5">{de ? "Mit Liebe & Safran zubereitet" : "Prepared with passion & saffron"}</p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
                {de ? "Gastfreundschaft & Tradition" : "Hospitality & Tradition"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
                {de ? "Willkommen bei SAHAR Restaurant" : "Welcome to SAHAR Restaurant"}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted">
                {aboutText.trim()}
              </p>
              <div className="pt-2 flex items-center gap-6">
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex min-h-11 items-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow transition-transform hover:-translate-y-0.5"
                >
                  {de ? "Mehr erfahren" : "Learn more"}
                </Link>
                <div className="flex items-center gap-3 text-xs text-muted font-medium">
                  <span className="flex h-3 w-3 rounded-full bg-success" />
                  <span>Richtiplatz 3, Wallisellen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CATEGORIES QUICK NAV */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
              {de ? "Vielfalt Entdecken" : "Discover Variety"}
            </p>
            <h2 className="font-display text-3xl font-bold text-primary mt-1">
              {de ? "Kategorien" : "Categories"}
            </h2>
          </div>
          <Link href={`/${locale}/menu`} className="text-sm font-bold text-primary hover:text-secondary transition-colors">
            {de ? "Alle zeigen →" : "View all →"}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link key={i} href={`/${locale}/menu`} className="group">
              <Card hover className="p-4 text-center flex flex-col items-center gap-3">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-background shadow-inner">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform group-hover:scale-110" />
                </div>
                <span className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 5: DELIVERY ZONES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="plum-gradient text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-block rounded-full bg-secondary/20 px-3.5 py-1 text-xs font-bold text-secondary-light border border-secondary/30 uppercase tracking-widest">
              {de ? "Lieferservice in Ihrer Nähe" : "Delivery Service Near You"}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {de ? "Frisch geliefert nach Wallisellen & Umgebung" : "Freshly delivered to Wallisellen & surroundings"}
            </h2>
            <p className="text-white/85 text-base sm:text-lg">
              {de ? "Wir bringen duftende Reisgerichte und saftige Kebabs direkt zu Ihnen nach Hause oder ins Büro." : "We bring fragrant rice dishes and juicy kebabs directly to your home or office."}
            </p>

            <div className="grid gap-4 sm:grid-cols-3 pt-4">
              {saharMockDeliveryZones.map((zone, i) => (
                <div key={i} className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/15 space-y-1">
                  <p className="font-bold text-secondary-light text-base">{zone.nameDe.trim()}</p>
                  <p className="text-xs text-white/70">PLZ: {zone.postalCodes.join(", ").trim()}</p>
                  <div className="pt-2 text-xs flex justify-between text-white/90 font-medium">
                    <span>Lieferung: {zone.deliveryFee.trim()}</span>
                    <span>Min: {zone.minimumOrder.trim()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* SECTION 6: HOURS & LOCATION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Hours Card */}
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">{de ? "Öffnungszeiten" : "Opening Hours"}</h2>
            </div>

            <dl className="divide-y divide-border/60 text-sm">
              <div className="py-3 flex justify-between items-center">
                <dt className="font-semibold">{de ? "Montag – Freitag" : "Monday – Friday"}</dt>
                <dd className="font-bold text-primary">{saharRealContent.openingHours.mondayToFriday}</dd>
              </div>
              <div className="py-3 flex justify-between items-center">
                <dt className="font-semibold">{de ? "Samstag" : "Saturday"}</dt>
                <dd className="font-bold text-primary">{saharRealContent.openingHours.saturday}</dd>
              </div>
              <div className="py-3 flex justify-between items-center">
                <dt className="font-semibold">{de ? "Sonntag" : "Sunday"}</dt>
                <dd className="font-bold text-destructive">{de ? "Geschlossen" : "Closed"}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted">{saharRealContent.openingHours.holidayNote}</p>
          </Card>

          {/* Location Card */}
          <Card className="p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-bold text-primary">{de ? "Standort & Kontakt" : "Location & Contact"}</h2>
              </div>

              <address className="not-italic space-y-3 text-sm">
                <p className="font-bold text-base text-foreground">{saharRealContent.displayName} Restaurant</p>
                <p className="text-muted">{saharRealContent.address.street}, {saharRealContent.address.postalCode} {saharRealContent.address.city} ({saharRealContent.address.region})</p>
                <p className="text-muted"><strong className="text-foreground">Tel:</strong> {saharRealContent.phone}</p>
                <p className="text-muted"><strong className="text-foreground">Email:</strong> {saharRealContent.email}</p>
              </address>
            </div>

            <Link
              href={`/${locale}/contact`}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all text-center"
            >
              {de ? "Anfahrt & Kontakt" : "Get Directions & Contact"}
            </Link>
          </Card>

        </div>
      </section>

      {/* SECTION 7: FINAL CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-surface border border-secondary/30 p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
              {de ? "Lust auf echte persische Küche?" : "Craving authentic Persian food?"}
            </h2>
            <p className="text-muted text-base">
              {de ? "Bestellen Sie bequem online für Abholung oder schnelle Lieferung in Wallisellen." : "Order easily online for pickup or fast delivery in Wallisellen."}
            </p>
            <div className="pt-4">
              <Link
                href={`/${locale}/menu`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-secondary px-8 text-base font-bold text-secondary-foreground shadow-lg hover:bg-secondary-light transition-all hover:scale-105"
              >
                {de ? "Jetzt Speisekarte öffnen" : "Open menu now"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
