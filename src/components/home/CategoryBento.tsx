import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SneakerMark } from "@/components/product/SneakerMark";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeUp } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";

type Tile = {
  title: string;
  copy: string;
  href: string;
  gradient: string;
  colors: [string, string, string];
  className: string;
  premium?: boolean;
};

const tiles: Tile[] = [
  {
    title: "Running",
    copy: "Responsive foam, built for the long miles.",
    href: "/products",
    gradient: "radial-gradient(120% 120% at 20% 15%, #7C5CFF55, transparent 55%), linear-gradient(160deg,#15151f,#0a0a0f)",
    colors: ["#7C5CFF", "#14141C", "#F5F5F7"],
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Lifestyle",
    copy: "Everyday icons.",
    href: "/products",
    gradient: "radial-gradient(120% 120% at 80% 20%, #22D3EE44, transparent 55%), linear-gradient(160deg,#13171a,#080a0c)",
    colors: ["#22D3EE", "#14141C", "#F5F5F7"],
    className: "md:col-span-2",
  },
  {
    title: "Limited",
    copy: "Members-only drops.",
    href: "/products",
    gradient: "radial-gradient(120% 120% at 70% 70%, #E8B87344, transparent 55%), linear-gradient(160deg,#1a160f,#0c0a06)",
    colors: ["#E8B873", "#14141C", "#F5D9A8"],
    className: "",
    premium: true,
  },
  {
    title: "Trail",
    copy: "Off-grid grip.",
    href: "/products",
    gradient: "radial-gradient(120% 120% at 30% 70%, #34D39944, transparent 55%), linear-gradient(160deg,#10160f,#070a06)",
    colors: ["#606c38", "#283618", "#dda15e"],
    className: "",
  },
];

export function CategoryBento() {
  return (
    <section className="mx-auto max-w-site px-5 py-20 md:px-8">
      <SectionHeading kicker="Find your fit" title="Shop by category" />
      <div className="grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {tiles.map((tile) => (
          <FadeUp key={tile.title} className={tile.className}>
            <Link
              href={tile.href}
              className="group border-iris relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 p-6"
              style={{ background: tile.gradient }}
            >
              <div className="flex items-start justify-between">
                <div>
                  {tile.premium && <Badge variant="gold" className="mb-2">Premium</Badge>}
                  <h3 className="font-display text-2xl font-bold">{tile.title}</h3>
                  <p className="mt-1 max-w-[16ch] text-sm text-[var(--text-muted)]">{tile.copy}</p>
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-[var(--text-muted)] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--text)]"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-6 -right-4 h-32 w-44 opacity-80 transition-transform duration-500 group-hover:scale-110">
                <SneakerMark primary={tile.colors[0]} accent={tile.colors[1]} sole={tile.colors[2]} />
              </div>
            </Link>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
