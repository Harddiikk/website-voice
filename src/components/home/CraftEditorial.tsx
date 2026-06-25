import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductPlaceholder } from "@/components/product/ProductPlaceholder";
import { FadeUp } from "@/components/ui/Reveal";
import { getProduct } from "@/lib/products";

export function CraftEditorial() {
  const hero = getProduct("velocity-carbon");
  if (!hero) return null;
  return (
    <section className="mx-auto max-w-site px-5 py-20 md:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <FadeUp>
          <ProductPlaceholder product={hero} className="aspect-[4/3] rounded-3xl border border-black/[0.08]" />
        </FadeUp>
        <FadeUp delay={0.1} className="lg:pl-8">
          <p className="font-tech mb-3 text-xs uppercase tracking-[0.3em] text-[var(--primary-soft)]">
            The Craft
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Obsessed with the <span className="text-gradient-gold">last millimeter</span>.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-[var(--text-muted)]">
            Every AURELIA silhouette begins as a sketch and ends as an instrument. Carbon plates
            tuned in the lab, foams developed over hundreds of iterations, and uppers knit to the
            gram. We don&apos;t add features — we remove everything that isn&apos;t the run.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-4 text-sm">
            {[
              ["Nitrogen foam", "Responsive, lightweight cushioning"],
              ["Carbon propulsion", "Energy return where it counts"],
              ["Engineered knit", "Breathable, sock-like lockdown"],
              ["Recycled build", "40% lower carbon footprint"],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4">
                <p className="font-medium">{t}</p>
                <p className="mt-1 text-xs text-[var(--text-subtle)]">{d}</p>
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn-glass mt-8 inline-flex items-center gap-2">
            Read our story <ArrowRight size={16} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
