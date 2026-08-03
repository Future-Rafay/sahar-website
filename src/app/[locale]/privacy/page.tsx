export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const de = (await params).locale !== "en";
  return <article className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-display text-4xl font-bold">{de ? "Datenschutz" : "Privacy"}</h1><p className="mt-6 text-muted">{de ? "MOCK: Der endg?ltige rechtliche Text muss vor der Ver?ffentlichung best?tigt werden." : "MOCK: Final legal copy must be confirmed before publication."}</p></article>;
}
