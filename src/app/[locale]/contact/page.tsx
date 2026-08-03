import { saharRealContent } from "@/content/phase-1";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const de = (await params).locale !== "en";
  return <section className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-display text-4xl font-bold">{de ? "Kontakt" : "Contact"}</h1><address className="mt-6 not-italic leading-8"><p>{saharRealContent.address.street}, {saharRealContent.address.postalCode} {saharRealContent.address.city}</p><p><a href={`tel:${saharRealContent.phone.replace(/\s/g, "")}`}>{saharRealContent.phone}</a></p><p><a href={`mailto:${saharRealContent.email}`}>{saharRealContent.email}</a></p></address></section>;
}
