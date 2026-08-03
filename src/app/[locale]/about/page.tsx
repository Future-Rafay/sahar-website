import { saharMockCopy } from "@/content/phase-1";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  return <article className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-display text-4xl font-bold">{locale === "de" ? "?ber SAHAR" : "About SAHAR"}</h1><p className="mt-6 text-lg leading-8 text-muted">{locale === "de" ? saharMockCopy.aboutDe : saharMockCopy.aboutEn}</p></article>;
}
