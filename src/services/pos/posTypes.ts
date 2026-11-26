/**
 * PLACEHOLDER shapes of the POS API responses.
 *
 * These are an educated guess, NOT the real POS format. When the POS team shares its API
 * documentation, update these types to match, then fix `posMapper.ts` until it type-checks.
 * Nothing outside `services/pos/` uses these types.
 */

export type PosId = string | number;

/** A product as the POS API returns it. */
export interface PosProduct {
  id: PosId;
  /** Store code / barcode, shown on the product page as the reference ID. */
  sku?: string | null;
  name: string;
  description?: string | null;
  /** Selling price. Some APIs send money as a string, e.g. "1499.00". */
  price: number | string;
  /** Price before discount, if the product is on sale. */
  original_price?: number | string | null;
  /** Main image. Absolute URL, or a path relative to `VITE_POS_IMAGE_BASE_URL`. */
  image_url?: string | null;
  /** Gallery images, main image first. */
  images?: readonly string[] | null;
  category_id?: PosId | null;
  category_name?: string | null;
  brand_name?: string | null;
  /** Short tag for product cards, e.g. "Gaming". Falls back to the category name. */
  label?: string | null;
  stock_quantity?: number | null;
  /** e.g. "available", "low_stock", "out_of_stock". Used when the quantity is not sent. */
  stock_status?: string | null;
  /** Whether the product should appear on the website. Missing means yes. */
  show_on_website?: boolean | null;
  is_featured?: boolean | null;
  /** Technical specifications, either as a list or as a name → value object. */
  specifications?:
    | readonly { name: string; value: string | number }[]
    | Readonly<Record<string, string | number>>
    | null;
  /** Higher = more popular; drives "Most Popular" sorting. */
  popularity?: number | null;
  created_at?: string | null;
}

/** List endpoints may return a bare array or wrap it, e.g. `{ "data": [...] }`. */
export type PosListResponse<T> = readonly T[] | { data: readonly T[] };

/** Single-item endpoints may return the item or wrap it, e.g. `{ "data": {...} }`. */
export type PosItemResponse<T> = T | { data: T };
