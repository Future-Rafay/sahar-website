"use client";

import Image from "next/image";
import { useState } from "react";

import { useCart } from "@/components/site/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatChf } from "@/lib/orders";

type MenuCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  products: Array<{
    id: string;
    name: string;
    description: string | null;
    imageKey: string | null;
    available: boolean;
    isHalal: boolean;
    isVegetarian: boolean;
    isVegan: boolean;
    spiceLevel: string | null;
    allergens: Array<{ code: string; name: string }>;
    variants: Array<{ id: string; name: string; priceRappen: number }>;
    optionGroups: Array<{
      id: string;
      name: string;
      required: boolean;
      minimumSelections: number;
      maximumSelections: number;
      choices: Array<{ id: string; name: string; priceDeltaRappen: number }>;
    }>;
  }>;
};

export function MenuClient({ categories, locale }: { categories: MenuCategory[]; locale: "de" | "en" }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-2xl">
        <p className="font-semibold uppercase tracking-[0.24em] text-secondary">SAHAR</p>
        <h1 className="mt-2 font-display text-4xl font-bold">{locale === "de" ? "Men?" : "Menu"}</h1>
        <p className="mt-3 text-muted">{locale === "de" ? "W?hlen Sie Varianten und Optionen. Preise werden beim Checkout erneut gepr?ft." : "Choose variants and options. Prices are checked again at checkout."}</p>
      </div>
      <nav aria-label={locale === "de" ? "Men?kategorien" : "Menu categories"} className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => <a key={category.id} href={`#${category.slug}`} className="min-h-11 shrink-0 content-center rounded-full border bg-surface px-4 text-sm font-semibold">{category.name}</a>)}
      </nav>
      {categories.map((category) => (
        <section key={category.id} id={category.slug} className="scroll-mt-24 py-10" aria-labelledby={`${category.id}-title`}>
          <h2 id={`${category.id}-title`} className="font-display text-3xl font-bold">{category.name}</h2>
          {category.description && <p className="mt-2 text-muted">{category.description}</p>}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProductCard({ product, locale }: { product: MenuCategory["products"][number]; locale: "de" | "en" }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [choiceIds, setChoiceIds] = useState<string[]>([]);
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const selectedChoices = product.optionGroups.flatMap((group) => group.choices).filter((choice) => choiceIds.includes(choice.id));
  const unitPrice = (variant?.priceRappen ?? 0) + selectedChoices.reduce((sum, choice) => sum + choice.priceDeltaRappen, 0);
  const valid = product.optionGroups.every((group) => {
    const count = group.choices.filter((choice) => choiceIds.includes(choice.id)).length;
    return count >= group.minimumSelections && count <= group.maximumSelections;
  });

  const toggleChoice = (group: MenuCategory["products"][number]["optionGroups"][number], choiceId: string) => {
    setChoiceIds((current) => {
      if (current.includes(choiceId)) return current.filter((id) => id !== choiceId);
      const groupIds = group.choices.map((choice) => choice.id);
      if (group.maximumSelections === 1) return [...current.filter((id) => !groupIds.includes(id)), choiceId];
      return [...current, choiceId];
    });
  };

  return (
    <Card className="flex overflow-hidden p-0">
      <div className="relative min-h-36 w-32 shrink-0 bg-background">
        <Image src={product.imageKey?.startsWith("/") ? product.imageKey : "/images/placeholders/saffron-rice.jpg"} alt="" fill className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold">{product.name}</h3>
        <p className="mt-1 line-clamp-3 text-sm leading-5 text-muted">{product.description}</p>
        <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted">
          {product.isHalal && <span>Halal</span>}
          {product.isVegetarian && <span>Vegetarian</span>}
          {product.isVegan && <span>Vegan</span>}
          {product.allergens.length > 0 && <span>? {product.allergens.map((item) => item.name).join(", ")}</span>}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <strong>{formatChf(Math.min(...product.variants.map((item) => item.priceRappen)), locale)}</strong>
          {!product.available ? (
            <span className="rounded-full bg-background px-3 py-2 text-sm font-semibold text-muted">{locale === "de" ? "Ausverkauft" : "Sold out"}</span>
          ) : (
            <Dialog>
              <DialogTrigger asChild><Button size="compact">{locale === "de" ? "Hinzuf?gen" : "Add"}</Button></DialogTrigger>
              <DialogContent>
                <DialogTitle>{product.name}</DialogTitle>
                <DialogDescription>{product.description}</DialogDescription>
                <div className="mt-5 space-y-5">
                  <fieldset>
                    <legend className="font-semibold">{locale === "de" ? "Gr?sse / Variante" : "Size / variant"}</legend>
                    <div className="mt-2 space-y-2">
                      {product.variants.map((item) => (
                        <label key={item.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3">
                          <input type="radio" name={`variant-${product.id}`} checked={variantId === item.id} onChange={() => setVariantId(item.id)} />
                          <span>{item.name}</span><span className="ml-auto">{formatChf(item.priceRappen, locale)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {product.optionGroups.map((group) => (
                    <fieldset key={group.id}>
                      <legend className="font-semibold">{group.name} {group.required && <span className="text-destructive">*</span>}</legend>
                      <p className="text-xs text-muted">{locale === "de" ? `W?hlen Sie ${group.minimumSelections}?${group.maximumSelections}` : `Choose ${group.minimumSelections}?${group.maximumSelections}`}</p>
                      <div className="mt-2 space-y-2">
                        {group.choices.map((choice) => (
                          <label key={choice.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3">
                            <input type={group.maximumSelections === 1 ? "radio" : "checkbox"} name={`group-${group.id}`} checked={choiceIds.includes(choice.id)} onChange={() => toggleChoice(group, choice.id)} />
                            <span>{choice.name}</span>
                            {choice.priceDeltaRappen !== 0 && <span className="ml-auto">+ {formatChf(choice.priceDeltaRappen, locale)}</span>}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  <div className="flex items-center justify-between border-t pt-4"><strong>{formatChf(unitPrice, locale)}</strong>
                    <DialogClose asChild>
                      <Button disabled={!valid} onClick={() => add({ variantId: variant.id, choiceIds, quantity: 1, productName: product.name, variantName: variant.name, unitPriceRappen: unitPrice })}>
                        {locale === "de" ? "Zum Warenkorb" : "Add to cart"}
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </Card>
  );
}
