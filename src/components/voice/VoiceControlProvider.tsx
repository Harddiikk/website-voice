"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export type VoiceSelection = { size: number | null; color: string | null; qty: number };
/** Short, speakable result the VoiceAgent forwards to the model. */
export type ActionResult = { ok: boolean; message: string };

type VoiceControlValue = {
  activeProduct: Product | null;
  selection: VoiceSelection;
  toast: string | null;
  registerProduct: (product: Product) => void;
  unregisterProduct: (productId: string) => void;
  selectSize: (size: number) => ActionResult;
  selectColor: (color: string | number) => ActionResult;
  setQty: (qty: number) => ActionResult;
  addActiveToCart: () => ActionResult;
  placeOrder: () => ActionResult;
  showToast: (message: string) => void;
};

const COLOR_NAMES = ["primary", "shadow", "accent"];
const Ctx = createContext<VoiceControlValue | null>(null);

export function VoiceControlProvider({ children }: { children: ReactNode }) {
  const cart = useCart();

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selection, setSelection] = useState<VoiceSelection>({ size: null, color: null, qty: 1 });
  const [toast, setToast] = useState<string | null>(null);

  // Mirror refs so action callbacks stay stable AND always read the latest state
  // (the Gemini Live handler is long-lived and must not capture stale values).
  const activeProductRef = useRef(activeProduct);
  activeProductRef.current = activeProduct;
  const selectionRef = useRef(selection);
  selectionRef.current = selection;
  const cartRef = useRef(cart);
  cartRef.current = cart;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const registerProduct = useCallback((product: Product) => {
    if (activeProductRef.current?.id !== product.id) {
      setActiveProduct(product);
      setSelection({ size: null, color: product.colorways[0], qty: 1 });
    }
  }, []);

  const unregisterProduct = useCallback((productId: string) => {
    // id-guard: the unmounting page must not clear a newer page's registration
    setActiveProduct((prev) => (prev?.id === productId ? null : prev));
  }, []);

  const selectSize = useCallback((size: number): ActionResult => {
    const p = activeProductRef.current;
    if (!p) return { ok: false, message: "No product is open yet — open one first." };
    const n = Number(size);
    if (!p.sizes.includes(n)) {
      return { ok: false, message: `The ${p.name} isn't offered in size ${size}. Available: ${p.sizes.join(", ")}.` };
    }
    setSelection((v) => ({ ...v, size: n }));
    showToast(`Size ${n} selected`);
    return { ok: true, message: `Selected US size ${n}.` };
  }, [showToast]);

  const selectColor = useCallback((color: string | number): ActionResult => {
    const p = activeProductRef.current;
    if (!p) return { ok: false, message: "No product is open yet — open one first." };
    let hex: string | undefined;
    if (typeof color === "number") hex = p.colorways[color - 1];
    else {
      const c = String(color).trim().toLowerCase();
      const nameIdx = COLOR_NAMES.indexOf(c);
      if (nameIdx >= 0) hex = p.colorways[nameIdx];
      else if (/^\d+$/.test(c)) hex = p.colorways[Number(c) - 1];
      else {
        const m = p.colorways.find((x) => x.toLowerCase() === c);
        if (m) hex = m;
      }
    }
    if (!hex) return { ok: false, message: `That colorway isn't available on the ${p.name}.` };
    setSelection((v) => ({ ...v, color: hex! }));
    showToast("Colorway updated");
    return { ok: true, message: "Colorway updated." };
  }, [showToast]);

  const setQty = useCallback((qty: number): ActionResult => {
    const n = Math.max(1, Math.round(Number(qty) || 1));
    setSelection((v) => ({ ...v, qty: n }));
    showToast(`Quantity: ${n}`);
    return { ok: true, message: `Quantity set to ${n}.` };
  }, [showToast]);

  const addActiveToCart = useCallback((): ActionResult => {
    const p = activeProductRef.current;
    if (!p) return { ok: false, message: "No product is open — open one first." };
    const { size, qty } = selectionRef.current;
    if (size == null) {
      showToast("Select a size first");
      return { ok: false, message: "No size selected yet — ask the shopper for their US size first." };
    }
    cartRef.current.addItem(p, size, qty);
    showToast("Added to bag");
    return { ok: true, message: `Added ${qty > 1 ? `${qty} ` : ""}${p.name} in size ${size} to your bag.` };
  }, [showToast]);

  const placeOrder = useCallback((): ActionResult => {
    const c = cartRef.current;
    if (c.count === 0) return { ok: false, message: "The bag is empty — nothing to order yet." };
    const summary = `${c.count} item${c.count > 1 ? "s" : ""}, ${formatPrice(c.subtotal)}`;
    c.clear();
    c.setOpen(false);
    showToast("Order placed ✓");
    return { ok: true, message: `Order placed — ${summary}. Thank you for shopping AURELIA.` };
  }, [showToast]);

  const value = useMemo<VoiceControlValue>(
    () => ({
      activeProduct,
      selection,
      toast,
      registerProduct,
      unregisterProduct,
      selectSize,
      selectColor,
      setQty,
      addActiveToCart,
      placeOrder,
      showToast,
    }),
    [activeProduct, selection, toast, registerProduct, unregisterProduct, selectSize, selectColor, setQty, addActiveToCart, placeOrder, showToast],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* transient confirmation for voice-driven actions */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4">
        {toast && (
          <div className="glass rounded-full px-5 py-3 text-sm font-medium shadow-card">
            {toast}
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}

export function useVoiceControl() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useVoiceControl must be used within a VoiceControlProvider");
  return ctx;
}
