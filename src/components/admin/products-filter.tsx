"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Search, X, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";

type Product = {
  id: string;
  nameEn: string;
  nameDe: string;
  active: boolean;
  available: boolean;
  category: { id: string; nameEn: string };
  variants: { id: string }[];
  optionGroups: { id: string }[];
};

type Category = { id: string; nameEn: string };

export function ProductsFilter({
  products,
  categories,
  children,
}: {
  products: Product[];
  categories: Category[];
  children: React.ReactNode; // "Add product" form card
}) {
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("ALL");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCategoryId !== "ALL" && p.category.id !== activeCategoryId) return false;
      if (q) {
        const haystack = `${p.nameEn} ${p.nameDe} ${p.category.nameEn}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [products, query, activeCategoryId]);

  const isFiltered = query.trim() !== "" || activeCategoryId !== "ALL";

  return (
    <div className="space-y-6">
      {/* Add Product form (passed as children) */}
      {children}

      {/* Search + Category Filter */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            ref={inputRef}
            id="product-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full min-h-10 rounded-lg border border-[#E1E3E5] bg-white pl-10 pr-9 text-sm font-medium text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            aria-label="Search products"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategoryId("ALL")}
            className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-bold transition-all ${
              activeCategoryId === "ALL"
                ? "bg-foreground text-white border-foreground"
                : "bg-white border-[#E1E3E5] text-muted hover:bg-[#F6F6F7]"
            }`}
            aria-pressed={activeCategoryId === "ALL"}
          >
            All categories
            <span className="ml-1.5 rounded-full bg-current/10 px-1.5 py-0.5 text-[10px] font-extrabold">
              {products.length}
            </span>
          </button>
          {categories.map((cat) => {
            const catCount = products.filter((p) => p.category.id === cat.id).length;
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white border-[#E1E3E5] text-foreground hover:bg-[#F6F6F7]"
                }`}
                aria-pressed={isActive}
              >
                {cat.nameEn}
                <span className="ml-1.5 rounded-full bg-current/10 px-1.5 py-0.5 text-[10px] font-extrabold">
                  {catCount}
                </span>
              </button>
            );
          })}

          {isFiltered && (
            <button
              type="button"
              onClick={() => { setQuery(""); setActiveCategoryId("ALL"); }}
              className="ml-auto inline-flex min-h-8 items-center gap-1 rounded-full border border-destructive/30 bg-white px-3 text-xs font-bold text-destructive hover:bg-destructive/5"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted" role="status" aria-live="polite">
          {isFiltered
            ? `${filteredProducts.length} of ${products.length} products`
            : `${products.length} products total`}
        </p>
      </div>

      {/* Product Cards */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-bold text-muted">No products match your search.</p>
          <button
            type="button"
            onClick={() => { setQuery(""); setActiveCategoryId("ALL"); }}
            className="mt-3 text-xs font-bold text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductAdminCard key={product.id} product={product} searchQuery={query} />
          ))}
        </div>
      )}
    </div>
  );
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-secondary/25 text-primary rounded px-0.5 not-italic">{text.slice(idx, idx + query.trim().length)}</mark>
      {text.slice(idx + query.trim().length)}
    </>
  );
}

function ProductAdminCard({ product, searchQuery }: { product: Product; searchQuery: string }) {
  const statusLabel = product.active ? (product.available ? "Available" : "Sold out") : "Unpublished";
  const statusColor = product.active && product.available
    ? "text-emerald-700"
    : product.active
      ? "text-orange-600"
      : "text-muted";

  return (
    <Card className="border-[#E1E3E5] bg-white p-4 shadow-xs hover:shadow-sm transition-shadow">
      <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">
        {highlightText(product.category.nameEn, searchQuery)}
      </p>
      <h2 className="mt-1 font-display text-lg font-bold text-foreground leading-tight">
        {highlightText(product.nameEn, searchQuery)}
      </h2>
      <p className="mt-0.5 text-xs text-muted">
        {highlightText(product.nameDe, searchQuery)}
      </p>
      <p className="mt-2 text-xs text-muted">
        {product.variants.length} variant{product.variants.length !== 1 ? "s" : ""} · {product.optionGroups.length} option group{product.optionGroups.length !== 1 ? "s" : ""}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F1F1F1] pt-3">
        <span className={`flex items-center gap-1.5 text-xs font-bold ${statusColor}`}>
          {product.active && product.available ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          {statusLabel}
        </span>
        <a
          href={`/admin/menu/products/${product.id}`}
          className="inline-flex min-h-8 items-center rounded-lg border border-[#E1E3E5] bg-[#F6F6F7] px-3 text-xs font-bold text-foreground hover:bg-[#EBECEF] transition-colors"
        >
          Edit
        </a>
      </div>
    </Card>
  );
}
