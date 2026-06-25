export type Product = {
  /** Stable id, also used as the URL slug. */
  id: string;
  name: string;
  tagline: string;
  price: number;
  category: string;
  /** Colorway hex values; index 0 is treated as the primary. */
  colorways: string[];
  sizes: number[];
  /** Layered CSS gradient string used to render the product placeholder. */
  gradient: string;
  description: string;
  /** Optional pill label shown on the card, e.g. "New", "Pro". */
  badge: string | null;
  /** Editorial flags used to compose home-page rails. */
  rating: number;
  reviews: number;
};

export type CartLine = {
  product: Product;
  size: number;
  qty: number;
};
