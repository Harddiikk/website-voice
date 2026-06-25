import { SneakerMark } from "@/components/product/SneakerMark";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

// Tiny inline fractal-noise tile (~grain) — fully local, no network.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Gallery-grade product visual built only from data: layered mesh gradient,
 * film grain, studio glow, a floor shadow, and a tinted SVG sneaker.
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
  const [primary, accent, sole] = product.colorways;
  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{ background: product.gradient }}
    >
      {/* studio rim glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[38%] -z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: accent ?? primary, opacity: 0.35 }}
      />
      {/* film grain */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: GRAIN, opacity: 0.08 }}
      />
      {/* the shoe */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-[14%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          shoeClassName,
        )}
      >
        <SneakerMark primary={primary} accent={accent} sole={sole} className="max-h-full -rotate-[6deg]" />
      </div>
      {/* floor vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 -80px 120px rgba(0,0,0,0.5)" }}
      />
    </div>
  );
}
