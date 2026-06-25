"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductPlaceholder } from "@/components/product/ProductPlaceholder";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import type { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCart();
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "spotlight-card border-iris group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-3 transition-transform duration-500 hover:-translate-y-1",
        className,
      )}
    >
      <Link href={`/products/${product.id}`} className="relative block">
        <ProductPlaceholder
          product={product}
          className="aspect-square rounded-2xl"
          shoeClassName="group-hover:scale-[1.05]"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.badge && <Badge>{product.badge}</Badge>}
        </div>
        {/* quick add */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="absolute bottom-3 right-3 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-[var(--surface-3)]/80 text-[var(--text)] opacity-0 backdrop-blur transition-all duration-300 hover:bg-[var(--primary)] group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`Quick add ${product.name}`}
        >
          <Plus size={18} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-2 pb-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-medium leading-tight transition-colors group-hover:text-[var(--primary-soft)]">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-[var(--text-subtle)]">{product.category}</p>
          </div>
          <span className="font-tech text-gradient-gold whitespace-nowrap text-lg font-semibold">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            {product.colorways.map((c) => (
              <span
                key={c}
                className="h-3.5 w-3.5 rounded-full border border-white/20"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
          <RatingStars rating={product.rating} />
        </div>
      </div>
    </div>
  );
}
