"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";

export function CartSheet() {
  const { lines, isOpen, setOpen, count, subtotal, updateQty, removeLine } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="glass fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col rounded-none border-l border-black/[0.08]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            role="dialog"
            aria-label="Shopping bag"
          >
            <header className="flex items-center justify-between border-b border-black/[0.08] px-6 py-5">
              <h2 className="font-display flex items-center gap-2 text-lg">
                <ShoppingBag size={18} /> Your Bag
                <span className="font-tech text-sm text-[var(--text-muted)]">({count})</span>
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-[var(--text-muted)] transition hover:bg-black/[0.06] hover:text-[var(--text)]"
                aria-label="Close bag"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-black/[0.04]">
                    <ShoppingBag size={28} className="text-[var(--text-subtle)]" />
                  </div>
                  <p className="text-[var(--text-muted)]">Your bag is empty.</p>
                  <Link href="/products" onClick={() => setOpen(false)} className="btn-glass text-sm">
                    Browse the collection
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {lines.map((line) => (
                    <li
                      key={`${line.product.id}-${line.size}`}
                      className="flex gap-4 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-3"
                    >
                      <Link
                        href={`/products/${line.product.id}`}
                        onClick={() => setOpen(false)}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                        style={{ background: line.product.gradient }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={line.product.image}
                          alt={line.product.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium leading-tight">{line.product.name}</p>
                            <p className="text-xs text-[var(--text-subtle)]">
                              Size {line.size} · {line.product.category}
                            </p>
                          </div>
                          <button
                            onClick={() => removeLine(line.product.id, line.size)}
                            className="text-[var(--text-subtle)] transition hover:text-[var(--danger)]"
                            aria-label="Remove item"
                          >
                            <X size={15} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-black/[0.08]">
                            <button
                              onClick={() => updateQty(line.product.id, line.size, line.qty - 1)}
                              className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-black/[0.06]"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="font-tech w-4 text-center text-sm">{line.qty}</span>
                            <button
                              onClick={() => updateQty(line.product.id, line.size, line.qty + 1)}
                              className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-black/[0.06]"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="font-tech text-gradient-gold font-semibold">
                            {formatPrice(line.product.price * line.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-black/[0.08] px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Subtotal</span>
                  <span className="font-tech text-gradient-gold text-xl font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <button className="btn-primary w-full">Checkout</button>
                <p className="mt-3 text-center text-xs text-[var(--text-subtle)]">
                  Shipping &amp; taxes calculated at checkout.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
