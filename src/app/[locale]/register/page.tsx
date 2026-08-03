import Link from "next/link";

import { AuthForm } from "@/components/site/auth-form";
import { Card } from "@/components/ui/card";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  return <div className="mx-auto max-w-md px-4 py-16"><Card><h1 className="font-display text-3xl font-bold">{locale === "de" ? "Konto erstellen" : "Create account"}</h1><div className="mt-6"><AuthForm locale={locale} mode="register" /></div><p className="mt-5 text-sm text-muted"><Link className="text-primary underline" href={`/${locale}/login`}>{locale === "de" ? "Zur Anmeldung" : "Back to sign in"}</Link></p></Card></div>;
}
