import Link from "next/link";
import { Newsletter } from "@/components/layout/Newsletter";
import { NAV_LINKS, SITE } from "@/lib/site";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Sneakers", href: "/products" },
      { label: "Running", href: "/products" },
      { label: "Lifestyle", href: "/products" },
      { label: "Limited Drops", href: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "The Craft", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/about" },
      { label: "Press", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", href: "/contact" },
      { label: "Returns", href: "/contact" },
      { label: "Size Guide", href: "/products" },
      { label: "Authenticity", href: "/about" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/10 bg-[var(--surface-1)]/60">
      <div className="mx-auto max-w-site px-5 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="font-display text-2xl font-extrabold">
              <span className="text-gradient-iris">{SITE.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
              {SITE.description}
            </p>
            <div className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                Join the Society
              </p>
              <Newsletter compact />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-display mb-4 text-sm tracking-wide text-[var(--text)]">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-[var(--text-subtle)] sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {SITE.socials.map((s) => (
              <a key={s.label} href={s.href} className="transition hover:text-[var(--text)]" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
          <nav className="flex gap-5">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-[var(--text)]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
