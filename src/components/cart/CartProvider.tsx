"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "@/types";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: Product, size?: number, qty?: number) => void;
  removeLine: (id: string, size: number) => void;
  updateQty: (id: string, size: number, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "aurelia-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const addItem = useCallback((product: Product, size?: number, qty = 1) => {
    const resolvedSize = size ?? product.sizes[Math.floor(product.sizes.length / 2)];
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.product.id === product.id && l.size === resolvedSize);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { product, size: resolvedSize, qty }];
    });
    setOpen(true);
  }, []);

  const removeLine = useCallback((id: string, size: number) => {
    setLines((prev) => prev.filter((l) => !(l.product.id === id && l.size === size)));
  }, []);

  const updateQty = useCallback((id: string, size: number, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.product.id === id && l.size === size ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
    return { lines, count, subtotal, isOpen, setOpen, addItem, removeLine, updateQty, clear };
  }, [lines, isOpen, addItem, removeLine, updateQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
