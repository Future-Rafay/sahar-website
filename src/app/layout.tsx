import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { headers } from "next/headers";
import type { CSSProperties, ReactNode } from "react";

import { getPublicConfig } from "@/server/services/catalog";

import "./globals.css";

export const dynamic = "force-dynamic";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: { default: "Sahar Restaurant Wallisellen", template: "%s | Sahar" },
  description: "Sahar Restaurant in Wallisellen. Explore the menu and order online for pickup or delivery.",
  openGraph: { type: "website", siteName: "Sahar Restaurant", title: "Sahar Restaurant Wallisellen", description: "Explore the Sahar menu and order online for pickup or delivery.", images: [{ url: "/brand/sahar-logo.png", alt: "Sahar Restaurant" }] },
  twitter: { card: "summary_large_image", title: "Sahar Restaurant Wallisellen", description: "Explore the Sahar menu and order online.", images: ["/brand/sahar-logo.png"] },
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [{ brand }, requestHeaders] = await Promise.all([getPublicConfig(), headers()]);
  const language = requestHeaders.get("x-next-intl-locale") === "de" ? "de" : "en";
  const brandStyle = { "--brand-primary": brand.primaryColor, "--brand-secondary": brand.secondaryColor } as CSSProperties;
  const restaurantJsonLd = JSON.stringify({ "@context": "https://schema.org", "@type": "Restaurant", name: brand.displayName, url: process.env.APP_URL ?? "http://localhost:3000", logo: new URL("/brand/sahar-logo.png", process.env.APP_URL ?? "http://localhost:3000").href, telephone: brand.phone || undefined, email: brand.email || undefined, address: brand.address || undefined }).replaceAll("<", "\\u003c");
  return <html lang={language} data-scroll-behavior="smooth" className={`${manrope.variable} ${sora.variable}`}><body suppressHydrationWarning style={brandStyle}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: restaurantJsonLd }} />{children}</body></html>;
}
