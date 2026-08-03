import Image from "next/image";
import Link from "next/link";

import { AuthForm } from "@/components/site/auth-form";
import { Card } from "@/components/ui/card";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  const de = locale === "de";

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <Card className="p-8 space-y-6 shadow-xl border-secondary/30">
        <div className="text-center space-y-3">
          <div className="relative h-12 w-40 mx-auto">
            <Image src="/brand/sahar-logo.png" alt="SAHAR Logo" fill className="object-contain" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary">
            {de ? "Konto erstellen" : "Create account"}
          </h1>
          <p className="text-xs text-muted">
            {de ? "Erstellen Sie ein Konto für schnellere Bestellungen." : "Create an account for faster ordering."}
          </p>
        </div>

        <AuthForm locale={locale} mode="register" />

        <p className="text-center text-xs text-muted border-t border-border/60 pt-4">
          {de ? "Bereits ein Konto?" : "Already have an account?"}{" "}
          <Link className="font-bold text-primary hover:text-secondary underline" href={`/${locale}/login`}>
            {de ? "Zur Anmeldung" : "Back to sign in"}
          </Link>
        </p>
      </Card>
    </div>
  );
}

