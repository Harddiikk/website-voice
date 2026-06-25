export const SITE = {
  name: "AURELIA",
  tagline: "The future, underfoot.",
  description:
    "AURELIA is a luxury sneaker house — performance engineering wrapped in obsidian glass and electric light.",
  email: "concierge@aurelia.studio",
  phone: "+1 (212) 555-0142",
  address: "118 Mercer Street, SoHo, New York",
  hours: "Mon–Sat 10–8 · Sun 11–6",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
};

export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "The Craft", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Human-readable route map handed to the voice agent so it can navigate. */
export const ROUTE_MAP: { path: string; name: string; about: string }[] = [
  { path: "/", name: "Home", about: "Landing page: hero, featured drops, categories, best sellers, membership." },
  { path: "/products", name: "Shop / Catalog", about: "The full shoe catalog with category filters and sorting." },
  { path: "/about", name: "The Craft", about: "Brand story, materials, and the design philosophy." },
  { path: "/contact", name: "Contact", about: "Contact form, boutique address, hours, phone and email." },
];
