"use client";

import dynamic from "next/dynamic";
import { Box, ImageIcon } from "lucide-react";
import { useState } from "react";
import { ProductPlaceholder } from "@/components/product/ProductPlaceholder";
import type { Product } from "@/types";

// Heavy (three.js) — loaded only when the shopper opts into 3D, client-only.
const ShoeViewer = dynamic(() => import("@/components/three/ShoeViewer"), {
  ssr: false,
  loading: () => <div className="skeleton h-full w-full rounded-3xl" />,
});

export function ShoeStage({
  product,
  primaryColor,
}: {
  product: Product;
  primaryColor?: string;
}) {
  const [is3d, setIs3d] = useState(false);
  const colorway = {
    primary: primaryColor ?? product.colorways[0],
    accent: product.colorways[1],
    sole: product.colorways[2],
  };

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-black/[0.08]">
      {is3d ? (
        <ShoeViewer colorway={colorway} />
      ) : (
        <ProductPlaceholder product={product} className="h-full w-full" />
      )}

      <button
        onClick={() => setIs3d((v) => !v)}
        className="glass absolute bottom-4 right-4 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition hover:bg-black/[0.06]"
      >
        {is3d ? (
          <>
            <ImageIcon size={15} /> View image
          </>
        ) : (
          <>
            <Box size={15} /> View in 3D
          </>
        )}
      </button>

      {!is3d && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/30 px-3 py-1.5 text-xs text-[var(--text-muted)] backdrop-blur">
          Interactive 3D available
        </div>
      )}
    </div>
  );
}
