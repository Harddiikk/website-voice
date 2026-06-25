"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-nav py-3" : "py-5",
      )}
    >
      <nav className="mx-auto flex max-w-site items-center justify-between gap-6 px-5 md:px-8">
        <MagneticButton strength={0.4}>
          <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
            <span className="text-gradient-iris">{SITE.name}</span>
          </Link>
        </MagneticButton>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    active ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]",
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-white/5 ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <button
            className="hidden rounded-full p-2.5 text-[var(--text-muted)] transition hover:bg-white/10 hover:text-[var(--text)] sm:grid"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="relative rounded-full p-2.5 text-[var(--text-muted)] transition hover:bg-white/10 hover:text-[var(--text)]"
            aria-label="Open bag"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="font-tech absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2.5 text-[var(--text-muted)] transition hover:bg-white/10 hover:text-[var(--text)] md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="glass-nav mx-4 mt-3 overflow-hidden rounded-2xl md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ul className="flex flex-col p-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-[var(--text-muted)] transition hover:bg-white/5 hover:text-[var(--text)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
