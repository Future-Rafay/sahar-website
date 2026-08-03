import { CartPage } from "@/components/site/cart-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <CartPage locale={(await params).locale === "en" ? "en" : "de"} />;
}
