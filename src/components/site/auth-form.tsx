"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ locale, mode, admin = false }: { locale: "de" | "en"; mode: "login" | "register"; admin?: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const de = locale === "de";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(mode === "register" ? "/api/auth/register" : "/api/auth/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error === "EMAIL_IN_USE" ? (de ? "Diese E-Mail wird bereits verwendet." : "That email is already in use.") : (de ? "Anmeldung nicht m?glich. Pr?fen Sie Ihre Angaben." : "Unable to sign in. Check your details."));
      setBusy(false);
      return;
    }
    window.location.assign(admin ? "/admin" : `/${locale}/account/orders`);
  }
  return <form onSubmit={submit} className="space-y-4">
    {mode === "register" && <div><Label htmlFor="name">{de ? "Name" : "Name"}</Label><Input id="name" name="name" autoComplete="name" required /></div>}
    <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
    <div><Label htmlFor="password">{de ? "Passwort" : "Password"}</Label><Input id="password" name="password" type="password" minLength={mode === "register" ? 10 : 1} autoComplete={mode === "register" ? "new-password" : "current-password"} required /></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" className="w-full" disabled={busy}>{busy ? "?" : mode === "register" ? (de ? "Konto erstellen" : "Create account") : (de ? "Anmelden" : "Sign in")}</Button>
    {!admin && <a className="flex min-h-11 items-center justify-center rounded-xl border font-semibold" href={`/api/auth/signin/google?callbackUrl=/${locale}/account/orders`}>{de ? "Mit Google fortfahren" : "Continue with Google"}</a>}
  </form>;
}
