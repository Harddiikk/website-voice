"use client";

import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SneakerMark } from "@/components/product/SneakerMark";
import { MagneticButton } from "@/components/ui/MagneticButton";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const shoeY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -120]);
  const glowY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 80]);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 md:px-8">
      <div className="mx-auto grid w-full max-w-site items-center gap-10 lg:grid-cols-2">
        {/* Copy */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="border-iris mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-[var(--text-muted)]"
          >
            <Mic size={13} className="text-[var(--primary-soft)]" />
            New — ask our AI voice concierge anything
          </motion.div>

          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            <motion.span
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              className="block"
            >
              Engineered
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="text-gradient-iris block"
            >
              light,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
              className="block"
            >
              for every step.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            className="mt-6 max-w-md text-base leading-relaxed text-[var(--text-muted)] md:text-lg"
          >
            A luxury sneaker house where performance engineering meets obsidian glass and
            electric light. Discover the SS26 collection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <MagneticButton>
              <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                Shop the Drop <ArrowRight size={17} />
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <Link href="/about" className="btn-glass inline-flex items-center">
                Explore the Craft
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

        {/* Floating shoe */}
        <div className="relative flex h-[40vh] items-center justify-center lg:h-[70vh]">
          <motion.div
            style={{ y: glowY }}
            className="spotlight-bg absolute aspect-square w-[90%] rounded-full blur-2xl"
          />
          <motion.div
            style={{ y: shoeY }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="relative w-[88%] max-w-xl"
          >
            <div className="animate-floaty">
              <SneakerMark primary="#7C5CFF" accent="#14141C" sole="#F5F5F7" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex h-9 w-5 justify-center rounded-full border border-white/20 p-1">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-white/60"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}
