"use client";

import { Check, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ShoeStage } from "@/components/three/ShoeStage";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [color, setColor] = useState(product.colorways[0]);
  const [size, setSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, size ?? undefined, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* gallery / 3D */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <ShoeStage product={product} primaryColor={color} />
      </div>

      {/* detail panel */}
      <div>
        <div className="mb-3 flex items-center gap-3">
          {product.badge && <Badge>{product.badge}</Badge>}
          <span className="text-sm text-[var(--text-subtle)]">{product.category}</span>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-2 text-[var(--text-muted)]">{product.tagline}</p>

        <div className="mt-4 flex items-center gap-4">
          <span className="font-tech text-gradient-gold text-3xl font-semibold">
            {formatPrice(product.price)}
          </span>
          <RatingStars rating={product.rating} reviews={product.reviews} />
        </div>

        <p className="mt-6 max-w-md leading-relaxed text-[var(--text-muted)]">{product.description}</p>

        {/* colorways */}
        <div className="mt-8">
          <p className="mb-3 text-sm text-[var(--text-muted)]">
            Colorway —{" "}
            <span className="text-[var(--text)]">{colorName(product.colorways.indexOf(color))}</span>
          </p>
          <div className="flex gap-3">
            {product.colorways.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "h-10 w-10 rounded-full border-2 transition",
                  color === c ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/40" : "border-white/20",
                )}
                style={{ background: c }}
                aria-label={`Select colorway ${c}`}
              />
            ))}
          </div>
        </div>

        {/* sizes */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">Select size (US)</p>
            <button className="text-sm text-[var(--text-subtle)] underline-offset-4 hover:underline">
              Size guide
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "font-tech rounded-xl border py-3 text-sm transition",
                  size === s
                    ? "border-[var(--primary)] bg-[rgba(124,92,255,0.15)] text-[var(--text)]"
                    : "border-white/10 text-[var(--text-muted)] hover:border-white/30",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* buy actions */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-full border border-white/10 px-2 py-1.5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="font-tech w-5 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <MagneticButton strength={0.2} className="flex-1">
            <button onClick={handleAdd} className="btn-primary flex w-full items-center justify-center gap-2">
              {added ? (
                <>
                  <Check size={18} /> Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to bag
                </>
              )}
            </button>
          </MagneticButton>
          <button
            onClick={() => setWished((w) => !w)}
            className={cn(
              "grid h-[52px] w-[52px] place-items-center rounded-full border transition",
              wished ? "border-[var(--magenta)] text-[var(--magenta)]" : "border-white/10 text-[var(--text-muted)] hover:text-[var(--text)]",
            )}
            aria-label="Add to wishlist"
          >
            <Heart size={18} className={wished ? "fill-[var(--magenta)]" : ""} />
          </button>
        </div>
        {!size && (
          <p className="mt-3 text-xs text-[var(--text-subtle)]">
            Tip: pick a size, or just ask the concierge — &quot;add the {product.name} in my size&quot;.
          </p>
        )}

        {/* trust row */}
        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center text-xs text-[var(--text-subtle)]">
          <div>Free 48h shipping</div>
          <div>30-day returns</div>
          <div>Authenticity guaranteed</div>
        </div>
      </div>
    </div>
  );
}

function colorName(index: number) {
  return ["Primary", "Shadow", "Accent"][index] ?? "Primary";
}
