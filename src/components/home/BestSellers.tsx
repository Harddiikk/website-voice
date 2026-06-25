import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Item, Stagger } from "@/components/ui/Reveal";
import { getBestSellers } from "@/lib/products";

export function BestSellers() {
  const products = getBestSellers();
  return (
    <section className="mx-auto max-w-site px-5 py-20 md:px-8">
      <SectionHeading kicker="Loved by members" title="Best sellers" href="/products" />
      <Stagger className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {products.map((p) => (
          <Item key={p.id}>
            <ProductCard product={p} />
          </Item>
        ))}
      </Stagger>
    </section>
  );
}
