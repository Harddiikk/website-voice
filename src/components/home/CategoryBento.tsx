import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp } from "@/components/ui/Reveal";

type Tile = {
  title: string;
  copy: string;
  href: string;
  image: string;
  className: string;
};

const tiles: Tile[] = [
  {
    title: "Running",
    copy: "Responsive foam, built for the long miles.",
    href: "/products",
    image: "/products/aether-runner.jpg",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Lifestyle",
    copy: "Everyday icons.",
    href: "/products",
    image: "/products/solstice-high.jpg",
    className: "md:col-span-2",
  },
  {
    title: "Limited",
    copy: "Members-only drops.",
    href: "/products",
    image: "/products/velocity-carbon.jpg",
    className: "",
  },
  {
    title: "Trail",
    copy: "Off-grid grip.",
    href: "/products",
    image: "/products/terra-trail.jpg",
    className: "",
  },
];

export function CategoryBento() {
  return (
    <section className="mx-auto max-w-site px-5 py-20 md:px-8">
      <SectionHeading kicker="Find your fit" title="Shop by category" />
      <div className="grid auto-rows-[210px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {tiles.map((tile) => (
          <FadeUp key={tile.title} className={tile.className}>
            <Link
              href={tile.href}
              className="group relative flex h-full flex-col justify-end overflow-hidden rounded-3xl border border-black/[0.06] bg-[var(--surface-2)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.image}
                alt={tile.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {/* legibility scrim */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 55%)" }}
              />
              <div className="relative flex items-end justify-between p-6 text-white">
                <div>
                  <h3 className="font-display text-2xl font-bold">{tile.title}</h3>
                  <p className="mt-1 max-w-[18ch] text-sm text-white/75">{tile.copy}</p>
                </div>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </div>
            </Link>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
