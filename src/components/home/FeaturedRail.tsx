import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeatured } from "@/lib/products";

export function FeaturedRail() {
  const products = getFeatured();
  return (
    <section className="mx-auto max-w-site px-5 py-20 md:px-8">
      <SectionHeading kicker="The SS26 Drop" title="Featured this week" href="/products" />
      <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[78vw] shrink-0 snap-start sm:w-[340px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
