import { MenuClient } from "@/components/site/menu-client";
import { getPublicMenu } from "@/server/services/catalog";

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "en" ? "en" : "de";
  return <MenuClient locale={locale} categories={await getPublicMenu(locale.toUpperCase() as "DE" | "EN")} />;
}
