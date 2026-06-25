import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllProducts, getProduct } from "@/lib/products";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getAllProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  const fallback = getAllProducts().filter((p) => p.id !== product.id).slice(0, 4);
  const suggestions = related.length >= 2 ? related : fallback;

  return (
    <div className="mx-auto max-w-site px-5 pt-28 md:px-8">
      {/* breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-[var(--text-subtle)]">
        <Link href="/" className="transition hover:text-[var(--text)]">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="transition hover:text-[var(--text)]">Shop</Link>
        <ChevronRight size={14} />
        <span className="text-[var(--text-muted)]">{product.name}</span>
      </nav>

      <ProductDetailClient product={product} />

      {/* spec strip */}
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-4">
        {[
          ["Weight", "248g"],
          ["Drop", "8mm"],
          ["Cushioning", "Nitrogen foam"],
          ["Category", product.category],
        ].map(([k, v]) => (
          <div key={k} className="bg-[var(--surface-1)] p-5">
            <p className="text-xs uppercase tracking-wider text-[var(--text-subtle)]">{k}</p>
            <p className="font-tech mt-1 text-lg">{v}</p>
          </div>
        ))}
      </div>

      {/* accordions */}
      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="font-display mb-4 text-xl">Product details</h3>
          <Accordion
            items={[
              {
                title: "Details & materials",
                content:
                  "Engineered knit upper with welded overlays, nitrogen-infused foam midsole, and a durable rubber outsole. Recycled content where possible.",
              },
              {
                title: "Size & fit",
                content:
                  "True to size. If you're between sizes, we recommend sizing up for performance fits and down for lifestyle silhouettes.",
              },
              {
                title: "Shipping & returns",
                content:
                  "Free 48-hour shipping for members. 30-day free returns on unworn pairs in original packaging.",
              },
            ]}
          />
        </div>
        <div>
          <h3 className="font-display mb-4 text-xl">The story</h3>
          <p className="leading-relaxed text-[var(--text-muted)]">{product.description}</p>
          <p className="mt-4 leading-relaxed text-[var(--text-muted)]">
            Part of the SS26 collection, the {product.name} is built around a single idea: remove
            everything that isn&apos;t the run. Try it in 3D above, then ask our voice concierge how
            it compares to the rest of the line.
          </p>
        </div>
      </div>

      {/* related */}
      <div className="mt-24">
        <SectionHeading kicker="Complete the look" title="You may also like" href="/products" />
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {suggestions.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
