"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const sortLabels: Record<Sort, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Top Rated",
};

export function CatalogGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = useMemo(() => {
    let list = category === "All" ? products : products.filter((p) => p.category === category);
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, sort]);

  const chips = ["All", ...categories];

  return (
    <div>
      {/* sticky control bar */}
      <div className="sticky top-[68px] z-30 -mx-5 mb-8 border-y border-black/[0.08] bg-[var(--bg)]/70 px-5 py-3 backdrop-blur-xl md:mx-0 md:rounded-2xl md:border md:px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm transition",
                  category === c
                    ? "border-[var(--primary)] bg-[rgba(0,0,0,0.06)] text-[var(--text)]"
                    : "border-black/[0.08] text-[var(--text-muted)] hover:border-black/15 hover:text-[var(--text)]",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="shrink-0 rounded-full border border-black/[0.08] bg-black/[0.04] px-4 py-2 text-sm text-[var(--text-muted)] outline-none"
            aria-label="Sort products"
          >
            {(Object.keys(sortLabels) as Sort[]).map((s) => (
              <option key={s} value={s} className="bg-[var(--surface-2)]">
                {sortLabels[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-6 text-sm text-[var(--text-subtle)]">
        {filtered.length} {filtered.length === 1 ? "style" : "styles"}
      </p>

      <motion.div layout className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
