import Link from "next/link";

import { AuthForm } from "@/components/site/auth-form";
import { Card } from "@/components/ui/card";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  return <div className="mx-auto max-w-md px-4 py-16"><Card><h1 className="font-display text-3xl font-bold">{locale === "de" ? "Anmelden" : "Sign in"}</h1><div className="mt-6"><AuthForm locale={locale} mode="login" /></div><p className="mt-5 text-sm text-muted">{locale === "de" ? "Noch kein Konto?" : "No account yet?"} <Link className="text-primary underline" href={`/${locale}/register`}>{locale === "de" ? "Registrieren" : "Register"}</Link></p></Card></div>;
}
