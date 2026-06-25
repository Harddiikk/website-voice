import type { Metadata } from "next";
import { CatalogGrid } from "@/components/product/CatalogGrid";
import { FadeUp } from "@/components/ui/Reveal";
import { getAllProducts, getCategories } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "The full AURELIA collection — running, lifestyle, trail, racing and more.",
};

export default function ProductsPage() {
  const products = getAllProducts();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-site px-5 pt-32 md:px-8">
      <FadeUp className="mb-10">
        <p className="font-tech mb-3 text-xs uppercase tracking-[0.3em] text-[var(--primary-soft)]">
          The Collection
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Every step, <span className="text-gradient-iris">engineered</span>.
        </h1>
        <p className="mt-4 max-w-lg text-[var(--text-muted)]">
          {products.length} performance and lifestyle silhouettes. Filter by category, or just ask
          the voice concierge to find your fit.
        </p>
      </FadeUp>

      <CatalogGrid products={products} categories={categories} />
    </div>
  );
}
