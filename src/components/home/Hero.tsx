"use client";

import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { getProduct } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const shoeY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -90]);
  const hero = getProduct("aether-runner");

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 md:px-8">
      <div className="mx-auto grid w-full max-w-site items-center gap-10 lg:grid-cols-2">
        {/* Copy */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] px-4 py-2 text-xs text-[var(--text-muted)]"
          >
            <Mic size={13} className="text-[var(--text)]" />
            New — ask our AI voice concierge anything
          </motion.div>

          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            {["Engineered", "light,", "for every step."].map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.05 + i * 0.1 }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            className="mt-6 max-w-md text-base leading-relaxed text-[var(--text-muted)] md:text-lg"
          >
            A sneaker house built on one idea — remove everything that isn&apos;t the run.
            Meet the SS26 collection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <MagneticButton>
              <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                Shop the collection <ArrowRight size={17} />
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <Link href="/about" className="btn-glass inline-flex items-center">
                Our story
              </Link>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex items-center gap-8"
          >
            {[
              ["120k+", "Members"],
              ["4.9", "Avg. rating"],
              ["48h", "Free shipping"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-tech text-2xl font-semibold text-[var(--text)]">{n}</p>
                <p className="text-xs uppercase tracking-wider text-[var(--text-subtle)]">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero product */}
        <motion.div
          style={{ y: shoeY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[var(--surface-2)] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.3)]">
            {hero && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="animate-floaty h-full w-full object-cover"
                />
                <Link
                  href={`/products/${hero.id}`}
                  className="glass absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl px-4 py-3 transition hover:bg-white/90"
                >
                  <div>
                    <p className="font-medium leading-tight">{hero.name}</p>
                    <p className="text-xs text-[var(--text-subtle)]">{hero.tagline}</p>
                  </div>
                  <span className="font-tech font-semibold">{formatPrice(hero.price)}</span>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex h-9 w-5 justify-center rounded-full border border-black/20 p-1">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-black/40"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}
