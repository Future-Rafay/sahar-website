import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

import { getPublicConfig } from "@/server/services/catalog";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Sahar", template: "%s | Sahar" },
  description: "Sahar restaurant",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { brand } = await getPublicConfig();
  const brandStyle = { "--brand-primary": brand.primaryColor, "--brand-secondary": brand.secondaryColor } as CSSProperties;
  return <html lang="de"><body suppressHydrationWarning  style={brandStyle}>{children}</body></html>;
}
