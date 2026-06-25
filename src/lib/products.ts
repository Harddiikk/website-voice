import type { Product } from "@/types";

/**
 * Placeholder catalog. Every product renders from this data alone — gradients +
 * SVG silhouettes, no external image service — so the store is fully self-hosted.
 * Swap `gradient`/add real images later without touching the rest of the app.
 */
const rawProducts: Omit<Product, "image">[] = [
  {
    id: "aether-runner",
    name: "Aether Runner",
    tagline: "Weightless daily trainer",
    price: 189,
    category: "Running",
    colorways: ["#e23744", "#1b1b1f", "#f5f5f0"],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    gradient:
      "radial-gradient(120% 120% at 20% 15%, #ff6b6b66, transparent 50%), radial-gradient(120% 120% at 85% 80%, #ff8e3c55, transparent 55%), linear-gradient(160deg,#16161c,#0b0b0f)",
    description:
      "A featherlight knit upper over a responsive nitrogen-infused foam midsole. Built for sunrise miles and city sprints alike.",
    badge: "New",
    rating: 4.8,
    reviews: 214,
  },
  {
    id: "obsidian-pro",
    name: "Obsidian Pro",
    tagline: "Stealth performance",
    price: 225,
    category: "Running",
    colorways: ["#1b1b1f", "#3a3a44", "#7afcff"],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
    gradient:
      "radial-gradient(120% 120% at 25% 20%, #2b2b3a88, transparent 55%), radial-gradient(110% 110% at 80% 85%, #7afcff44, transparent 55%), linear-gradient(150deg,#101015,#050507)",
    description:
      "Matte triple-black with a cyan ice sole. Carbon plate for propulsion, engineered mesh for breathability.",
    badge: "Pro",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "solstice-high",
    name: "Solstice High",
    tagline: "Court icon, reborn",
    price: 160,
    category: "Lifestyle",
    colorways: ["#f5f5f0", "#e23744", "#1b1b1f"],
    sizes: [6, 7, 8, 9, 10, 11, 12],
    gradient:
      "radial-gradient(120% 120% at 18% 18%, #ffffff55, transparent 50%), radial-gradient(120% 120% at 82% 82%, #e2374455, transparent 55%), linear-gradient(160deg,#1d1d22,#0c0c10)",
    description:
      "A heritage high-top silhouette in premium full-grain leather with a vulcanized cupsole and padded collar.",
    badge: "Classic",
    rating: 4.7,
    reviews: 389,
  },
  {
    id: "nimbus-cloud",
    name: "Nimbus Cloud",
    tagline: "Recovery comfort",
    price: 140,
    category: "Lifestyle",
    colorways: ["#cdb4db", "#bde0fe", "#ffffff"],
    sizes: [5, 6, 7, 8, 9, 10, 11],
    gradient:
      "radial-gradient(120% 120% at 22% 16%, #cdb4db66, transparent 52%), radial-gradient(120% 120% at 80% 84%, #bde0fe66, transparent 55%), linear-gradient(160deg,#1a1a20,#0b0b0f)",
    description:
      "Pillow-soft pastel foam from heel to toe. Slip it on after the run and float through the rest of the day.",
    badge: "Comfort",
    rating: 4.6,
    reviews: 271,
  },
  {
    id: "velocity-carbon",
    name: "Velocity Carbon",
    tagline: "Race-day weapon",
    price: 260,
    category: "Racing",
    colorways: ["#ff8e3c", "#1b1b1f", "#fffb00"],
    sizes: [7, 8, 9, 10, 11, 12],
    gradient:
      "radial-gradient(120% 120% at 20% 15%, #ff8e3c77, transparent 50%), radial-gradient(120% 120% at 85% 80%, #fffb0044, transparent 55%), linear-gradient(155deg,#17120c,#0a0805)",
    description:
      "Full-length carbon plate, ultralight PEBA foam, and a featherweight race upper engineered for the marathon PR.",
    badge: "Limited",
    rating: 4.9,
    reviews: 98,
  },
  {
    id: "terra-trail",
    name: "Terra Trail",
    tagline: "Off-grid grip",
    price: 175,
    category: "Trail",
    colorways: ["#606c38", "#283618", "#dda15e"],
    sizes: [7, 8, 9, 10, 11, 12, 13],
    gradient:
      "radial-gradient(120% 120% at 22% 18%, #606c3877, transparent 52%), radial-gradient(120% 120% at 80% 82%, #dda15e55, transparent 55%), linear-gradient(160deg,#15170f,#080a06)",
    description:
      "Aggressive lugged outsole, rock plate protection, and a water-repellent ripstop upper for technical terrain.",
    badge: "Trail",
    rating: 4.7,
    reviews: 142,
  },
  {
    id: "halo-knit",
    name: "Halo Knit",
    tagline: "Seamless everyday",
    price: 150,
    category: "Lifestyle",
    colorways: ["#f5f5f0", "#adb5bd", "#1b1b1f"],
    sizes: [6, 7, 8, 9, 10, 11, 12],
    gradient:
      "radial-gradient(120% 120% at 20% 16%, #ffffff44, transparent 50%), radial-gradient(120% 120% at 82% 84%, #adb5bd55, transparent 55%), linear-gradient(160deg,#1c1c22,#0b0b0f)",
    description:
      "A one-piece sock-fit knit upper with a sculpted foam sole. Minimal, monochrome, made to disappear on your feet.",
    badge: "Eco",
    rating: 4.5,
    reviews: 203,
  },
  {
    id: "flux-skate",
    name: "Flux Skate",
    tagline: "Built to grind",
    price: 120,
    category: "Skate",
    colorways: ["#3a86ff", "#ffbe0b", "#1b1b1f"],
    sizes: [6, 7, 8, 9, 10, 11, 12, 13],
    gradient:
      "radial-gradient(120% 120% at 22% 18%, #3a86ff66, transparent 52%), radial-gradient(120% 120% at 80% 82%, #ffbe0b55, transparent 55%), linear-gradient(160deg,#101522,#06080f)",
    description:
      "Reinforced suede toe, impact-absorbing insole, and a gum rubber outsole tuned for board feel and durability.",
    badge: null,
    rating: 4.4,
    reviews: 176,
  },
  {
    id: "aurora-glow",
    name: "Aurora Glow",
    tagline: "Light-up lifestyle",
    price: 195,
    category: "Lifestyle",
    colorways: ["#b5179e", "#7209b7", "#4cc9f0"],
    sizes: [5, 6, 7, 8, 9, 10, 11],
    gradient:
      "radial-gradient(120% 120% at 20% 15%, #b5179e66, transparent 50%), radial-gradient(120% 120% at 85% 80%, #4cc9f055, transparent 55%), linear-gradient(155deg,#160a1f,#08040d)",
    description:
      "Iridescent TPU overlays shift color as you move, paired with a translucent gradient sole. A statement piece.",
    badge: "New",
    rating: 4.8,
    reviews: 67,
  },
  {
    id: "granite-hike",
    name: "Granite Hike",
    tagline: "All-weather support",
    price: 210,
    category: "Hiking",
    colorways: ["#495057", "#6c757d", "#e76f51"],
    sizes: [7, 8, 9, 10, 11, 12, 13, 14],
    gradient:
      "radial-gradient(120% 120% at 22% 18%, #6c757d66, transparent 52%), radial-gradient(120% 120% at 80% 82%, #e76f5144, transparent 55%), linear-gradient(160deg,#15171a,#080a0c)",
    description:
      "A waterproof membrane, ankle-locking support, and a high-traction outsole for multi-day backcountry treks.",
    badge: "Pro",
    rating: 4.7,
    reviews: 119,
  },
  {
    id: "mono-slip",
    name: "Mono Slip",
    tagline: "Effortless slip-on",
    price: 110,
    category: "Lifestyle",
    colorways: ["#1b1b1f", "#f5f5f0", "#e23744"],
    sizes: [6, 7, 8, 9, 10, 11, 12],
    gradient:
      "radial-gradient(120% 120% at 20% 16%, #2b2b3a66, transparent 52%), radial-gradient(120% 120% at 82% 84%, #e2374433, transparent 55%), linear-gradient(160deg,#161620,#09090d)",
    description:
      "No laces, all attitude. Stretch-collar entry, memory-foam footbed, and a clean cupsole for grab-and-go days.",
    badge: null,
    rating: 4.3,
    reviews: 88,
  },
  {
    id: "zenith-court",
    name: "Zenith Court",
    tagline: "Heritage tennis",
    price: 170,
    category: "Court",
    colorways: ["#ffffff", "#2a9d8f", "#264653"],
    sizes: [6, 7, 8, 9, 10, 11, 12, 13],
    gradient:
      "radial-gradient(120% 120% at 20% 15%, #ffffff44, transparent 50%), radial-gradient(120% 120% at 85% 80%, #2a9d8f55, transparent 55%), linear-gradient(160deg,#10211f,#060f0e)",
    description:
      "Crisp tumbled-leather upper with a perforated toe and a low-profile herringbone sole. Timeless courtside style.",
    badge: "Classic",
    rating: 4.6,
    reviews: 154,
  },
];

/** Catalog with self-hosted product photos derived from each id. */
export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  image: `/products/${p.id}.jpg`,
}));

export function getAllProducts(): Product[] {
  return products;
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

/** Curated rails for the home page. */
export function getFeatured(): Product[] {
  return products.filter((p) => ["aether-runner", "obsidian-pro", "velocity-carbon", "aurora-glow"].includes(p.id));
}

export function getBestSellers(): Product[] {
  return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
}

/** Loose text search used by the voice agent's search tool. */
export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  );
}

/**
 * Compact, model-friendly catalog summary embedded in the voice agent's
 * system instruction so it can answer questions and pick the right product id.
 */
export function getCatalogSummary(): string {
  return products
    .map(
      (p) =>
        `- ${p.name} (id: ${p.id}) — ${p.category}, $${p.price}. ${p.tagline}. Sizes ${p.sizes[0]}–${
          p.sizes[p.sizes.length - 1]
        }.`,
    )
    .join("\n");
}
