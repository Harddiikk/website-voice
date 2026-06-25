import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductPlaceholder } from "@/components/product/ProductPlaceholder";
import { FadeUp, Item, Stagger } from "@/components/ui/Reveal";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "The Craft",
  description: "The AURELIA story — engineering, materials, and a relentless pursuit of the run.",
};

const values = [
  ["Engineering first", "Every silhouette starts in the lab, not the moodboard. Data drives the design."],
  ["Quiet luxury", "Restraint over noise. Premium materials, finished by hand, built to last."],
  ["Lighter footprint", "Recycled and bio-based materials, carbon-neutral shipping, repair over replace."],
];

const stats = [
  ["2019", "Founded in SoHo"],
  ["120k+", "Society members"],
  ["38", "Patents filed"],
  ["4.9", "Average rating"],
];

export default function AboutPage() {
  const macro = getProduct("aurora-glow");
  return (
    <div className="mx-auto max-w-site px-5 pt-32 md:px-8">
      <FadeUp className="max-w-3xl">
        <p className="font-tech mb-3 text-xs uppercase tracking-[0.3em] text-[var(--primary-soft)]">
          The Craft
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          We build instruments for <span className="text-gradient-gold">motion</span>.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--text-muted)]">
          AURELIA is a luxury sneaker house obsessed with the last millimeter. We fuse performance
          engineering with the restraint of a fashion atelier — obsidian glass, electric light, and
          shoes treated like jewelry under spotlight.
        </p>
      </FadeUp>

      {macro && (
        <FadeUp className="mt-14">
          <ProductPlaceholder product={macro} className="aspect-[16/7] rounded-[2rem] border border-black/[0.08]" />
        </FadeUp>
      )}

      <Stagger className="mt-20 grid gap-6 md:grid-cols-3">
        {values.map(([t, d]) => (
          <Item key={t}>
            <div className="glass h-full p-7">
              <h3 className="font-display text-xl">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{d}</p>
            </div>
          </Item>
        ))}
      </Stagger>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/[0.08] bg-black/[0.04] md:grid-cols-4">
        {stats.map(([n, l]) => (
          <div key={l} className="bg-[var(--surface-1)] p-8 text-center">
            <p className="font-display text-3xl font-bold text-gradient-iris sm:text-4xl">{n}</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-[var(--text-subtle)]">{l}</p>
          </div>
        ))}
      </div>

      <FadeUp className="my-24 text-center">
        <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Have a question? Just ask — out loud.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[var(--text-muted)]">
          Tap the voice concierge in the corner, or browse the collection.
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex items-center gap-2">
          Shop the collection <ArrowRight size={17} />
        </Link>
      </FadeUp>
    </div>
  );
}
