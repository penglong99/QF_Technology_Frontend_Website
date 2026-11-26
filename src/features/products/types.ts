/**
 * Product domain types: the shape every page and component works with. Data from the POS is
 * converted into these types by `services/pos/posMapper.ts`, so the UI never sees raw POS
 * responses and does not change when the POS response format does.
 */

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export type EntityStatus = 'active' | 'inactive';

export type SpecKind =
  | 'processor'
  | 'memory'
  | 'storage'
  | 'graphics'
  | 'display'
  | 'battery'
  | 'connectivity'
  | 'feature';

export interface KeySpec {
  kind: SpecKind;
  label: string;
  value: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Brand {
  id: string;
  name: string;
  /** Inactive brands are hidden from the catalog brand filter. */
  status: EntityStatus;
}

export type CategoryIcon =
  | 'laptop'
  | 'desktop'
  | 'workstation'
  | 'gaming'
  | 'monitor'
  | 'component'
  | 'accessory'
  | 'printer'
  | 'cctv'
  | 'service';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: CategoryIcon;
}

export interface Product {
  id: string;
  /** Used in the product URL (`/products/:slug`). Equal to `id` for POS products. */
  slug: string;
  /** Store reference shown on the details page, e.g. "#QF-BK14-9821". */
  referenceId: string;
  name: string;
  brandId: string;
  categoryId: string;
  /** Short tag shown on cards, e.g. "Gaming", "Ultrabook". */
  label: string;
  /** Extra words search should match that aren't shown on the card, e.g. "Gaming". */
  searchTags?: readonly string[];
  price: number;
  compareAtPrice?: number;
  stockStatus: StockStatus;
  stockQuantity: number;
  images: ProductImage[];
  keySpecs: KeySpec[];
  specifications: SpecRow[];
  description: string[];
  /** Normalised values used by catalog filters. Absent for non-computer products. */
  processorFamily?: ProcessorFamily;
  memoryGb?: number;
  storageGb?: number;
  isFeatured: boolean;
  /** Higher is more popular; drives "Most Popular" sorting. */
  popularity: number;
  createdAt: string;
}

export type ProcessorFamily =
  | 'Intel Core i9'
  | 'Intel Core i7'
  | 'Intel Core i5'
  | 'Intel Xeon'
  | 'AMD Ryzen 9'
  | 'AMD Ryzen 7'
  | 'Apple Silicon';

/** A product joined with its brand and category, as list and detail views need. */
export interface ProductView extends Product {
  brand: Brand;
  category: Category;
}
