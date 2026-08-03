import Image from "next/image";
import Link from "next/link";

import { saharMockCopy } from "@/content/phase-1";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  const title = locale === "de" ? saharMockCopy.heroTitleDe : saharMockCopy.heroTitleEn;
  const subtitle = locale === "de" ? saharMockCopy.heroSubtitleDe : saharMockCopy.heroSubtitleEn;
  return (
    <div>
      <section className="relative isolate min-h-[70dvh] overflow-hidden">
        <Image src="/images/placeholders/persian-kebab.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-transparent" />
        <div className="relative mx-auto flex min-h-[70dvh] max-w-6xl items-center px-4 py-20">
          <div className="max-w-2xl text-white">
            <p className="mb-4 font-semibold uppercase tracking-[0.3em] text-secondary">Wallisellen ? Z?rich</p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">{title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">{subtitle}</p>
            <Link href={`/${locale}/menu`} className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-secondary px-6 font-semibold text-secondary-foreground">
              {locale === "de" ? "Jetzt bestellen" : "Order now"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
