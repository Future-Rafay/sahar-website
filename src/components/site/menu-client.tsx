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
  const de = locale === "de";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="rounded-2xl bg-surface-warm/80 border border-border/80 p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
            SAHAR RESTAURANT
          </span>
          <h1 className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
            {de ? "Unsere Speisekarte" : "Our Menu"}
          </h1>
          <p className="text-muted leading-relaxed text-base">
            {de
              ? "Entdecken Sie aromatische persische Spezialitäten. Wählen Sie Ihre gewünschten Artikel, Varianten und Optionen."
              : "Discover aromatic Persian specialties. Select your desired items, variants, and options."}
          </p>
        </div>
      </div>

      {/* Sticky Category Scroll Nav */}
      <nav
        aria-label={de ? "Menükategorien" : "Menu categories"}
        className="sticky top-[4.5rem] sm:top-[5rem] z-30 -mx-4 px-4 py-3 bg-surface/95 backdrop-blur-md border-y border-border/60 flex gap-2 overflow-x-auto no-scrollbar shadow-sm"
      >
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.slug}`}
            className="min-h-10 shrink-0 content-center rounded-full border border-border/80 bg-surface px-5 text-sm font-bold text-foreground/80 hover:border-secondary hover:text-primary transition-all duration-200 shadow-sm"
          >
            {category.name}
          </a>
        ))}
      </nav>

      {/* Menu Categories & Products */}
      <div className="space-y-16">
        {categories.map((category) => (
          <section
            key={category.id}
            id={category.slug}
            className="scroll-mt-36 space-y-6"
            aria-labelledby={`${category.id}-title`}
          >
            <div className="border-b border-border/60 pb-3">
              <h2 id={`${category.id}-title`} className="font-display text-3xl font-bold text-primary flex items-center gap-3">
                <span>{category.name}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              </h2>
              {category.description && (
                <p className="mt-1 text-sm text-muted">{category.description}</p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </section>
        ))}
      </div>
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

  const minPrice = Math.min(...product.variants.map((item) => item.priceRappen));
  const hasMultipleVariants = product.variants.length > 1;

  return (
    <Card hover className="flex flex-col overflow-hidden p-0 h-full justify-between group">
      {/* Product Image */}
      <div className="relative h-48 w-full bg-surface-warm overflow-hidden">
        <Image
          src={product.imageKey?.startsWith("/") ? product.imageKey : "/images/placeholders/saffron-rice.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Dietary Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.isHalal && (
            <span className="rounded-full bg-emerald-700/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              Halal
            </span>
          )}
          {product.isVegetarian && (
            <span className="rounded-full bg-green-700/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              Veggie
            </span>
          )}
          {product.isVegan && (
            <span className="rounded-full bg-teal-700/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              Vegan
            </span>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 rounded-xl bg-surface/95 backdrop-blur-md px-3 py-1 font-extrabold text-sm text-primary shadow">
          {hasMultipleVariants && <span className="text-xs font-normal text-muted mr-1">{locale === "de" ? "ab" : "from"}</span>}
          {formatChf(minPrice, locale)}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-5 justify-between space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          {product.allergens.length > 0 && (
            <p className="mt-3 text-[11px] text-muted/80">
              <span className="font-semibold">{locale === "de" ? "Allergene:" : "Allergens:"}</span>{" "}
              {product.allergens.map((item) => item.name).join(", ")}
            </p>
          )}
        </div>

        {/* Action Area */}
        <div className="pt-2 flex items-center justify-between border-t border-border/50">
          <span className="text-xs font-semibold text-muted">
            {product.variants.length > 1
              ? `${product.variants.length} ${locale === "de" ? "Varianten" : "variants"}`
              : product.variants[0]?.name}
          </span>

          {!product.available ? (
            <span className="rounded-xl bg-muted/20 px-3 py-1.5 text-xs font-bold text-muted">
              {locale === "de" ? "Ausverkauft" : "Sold out"}
            </span>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="compact" variant="secondary">
                  {locale === "de" ? "+ Hinzufügen" : "+ Add"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogTitle>{product.name}</DialogTitle>
                {product.description && (
                  <DialogDescription>{product.description}</DialogDescription>
                )}

                <div className="mt-5 space-y-6">
                  {/* Variant Selection */}
                  <fieldset className="space-y-2">
                    <legend className="font-display text-sm font-bold text-primary">
                      {locale === "de" ? "Grösse / Variante wählen" : "Select size / variant"}
                    </legend>
                    <div className="space-y-2">
                      {product.variants.map((item) => (
                        <label
                          key={item.id}
                          className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border p-3 text-sm font-medium transition-all ${
                            variantId === item.id
                              ? "border-secondary bg-secondary/10 font-bold text-primary"
                              : "border-border hover:bg-background"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`variant-${product.id}`}
                              checked={variantId === item.id}
                              onChange={() => setVariantId(item.id)}
                              className="h-4 w-4 accent-secondary"
                            />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-bold">{formatChf(item.priceRappen, locale)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Option Groups Selection */}
                  {product.optionGroups.map((group) => (
                    <fieldset key={group.id} className="space-y-2">
                      <legend className="font-display text-sm font-bold text-primary">
                        {group.name} {group.required && <span className="text-destructive">*</span>}
                      </legend>
                      <p className="text-xs text-muted">
                        {locale === "de"
                          ? `Wählen Sie ${group.minimumSelections}–${group.maximumSelections}`
                          : `Choose ${group.minimumSelections}–${group.maximumSelections}`}
                      </p>
                      <div className="space-y-2">
                        {group.choices.map((choice) => (
                          <label
                            key={choice.id}
                            className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border p-3 text-sm font-medium transition-all ${
                              choiceIds.includes(choice.id)
                                ? "border-secondary bg-secondary/10 font-bold text-primary"
                                : "border-border hover:bg-background"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type={group.maximumSelections === 1 ? "radio" : "checkbox"}
                                name={`group-${group.id}`}
                                checked={choiceIds.includes(choice.id)}
                                onChange={() => toggleChoice(group, choice.id)}
                                className="h-4 w-4 accent-secondary"
                              />
                              <span>{choice.name}</span>
                            </div>
                            {choice.priceDeltaRappen !== 0 && (
                              <span className="text-xs font-bold text-secondary">
                                +{formatChf(choice.priceDeltaRappen, locale)}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}

                  {/* Total & Add Button */}
                  <div className="flex items-center justify-between border-t border-border/80 pt-4">
                    <div>
                      <span className="block text-xs text-muted">{locale === "de" ? "Gesamtpreis" : "Total price"}</span>
                      <strong className="font-display text-2xl font-bold text-primary">
                        {formatChf(unitPrice, locale)}
                      </strong>
                    </div>
                    <DialogClose asChild>
                      <Button
                        disabled={!valid}
                        onClick={() =>
                          add({
                            variantId: variant.id,
                            choiceIds,
                            quantity: 1,
                            productName: product.name,
                            variantName: variant.name,
                            unitPriceRappen: unitPrice,
                          })
                        }
                      >
                        {locale === "de" ? "In den Warenkorb" : "Add to cart"}
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
