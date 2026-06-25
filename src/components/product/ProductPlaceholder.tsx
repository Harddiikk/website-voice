import type { Product } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Product visual: a self-hosted photo (object-cover) over the product's gradient
 * backdrop, with a floor vignette for depth. The gradient shows through if the
 * image ever fails to load.
 */
export function ProductPlaceholder({
  product,
  className,
  shoeClassName,
}: {
  product: Product;
  className?: string;
  shoeClassName?: string;
}) {
  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{ background: product.gradient }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          shoeClassName,
        )}
      />
      {/* floor vignette for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 -70px 110px rgba(0,0,0,0.5)" }}
      />
    </div>
  );
}
