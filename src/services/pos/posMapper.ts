import { siteCategories } from '@/features/products/categories';
import { stockStatusFor } from '@/features/products/lib/stock';
import type {
  Brand,
  Category,
  KeySpec,
  ProcessorFamily,
  ProductImage,
  ProductView,
  SpecKind,
  SpecRow,
  StockStatus,
} from '@/features/products/types';
import { apiConfig } from '../apiConfig';
import type { PosItemResponse, PosListResponse, PosProduct } from './posTypes';

/**
 * Converts POS API responses into the website's types. This is the only place that knows the
 * POS field names: when the POS format changes, change this file and `posTypes.ts`, and every
 * page keeps working.
 */

// ---------- Unwrapping ----------

export function unwrapList<T>(response: PosListResponse<T>): readonly T[] {
  return Array.isArray(response) ? response : (response as { data: readonly T[] }).data;
}

export function unwrapItem<T extends object>(response: PosItemResponse<T>): T {
  return 'data' in response && typeof response.data === 'object' && response.data !== null
    ? (response.data as T)
    : (response as T);
}

// ---------- Small helpers ----------

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toNumber(value: number | string | null | undefined): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function imageUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${apiConfig.posImageBaseUrl}/${path.replace(/^\/+/, '')}`;
}

// ---------- Category & brand ----------

/**
 * POS category name (lower-case) → website category id, for names that do not simply slugify
 * to a website category. TO BE CONFIRMED against the real POS category list.
 */
const CATEGORY_ALIASES: Record<string, string> = {
  laptop: 'laptops',
  notebook: 'laptops',
  notebooks: 'laptops',
  desktop: 'desktops',
  'desktop pc': 'desktops',
  'all in one': 'all-in-one',
  aio: 'all-in-one',
  workstation: 'workstations',
  'gaming pc': 'gaming-pcs',
  monitor: 'monitors',
  component: 'components',
  'pc components': 'components',
  accessory: 'accessories',
  printer: 'printers',
  'security camera': 'cctv',
  'cctv and security': 'cctv',
  service: 'services',
  repair: 'services',
  'repair and services': 'services',
};

/** Matches a POS category to a website category, or builds one for an unknown category. */
export function mapCategory(posName: string | null | undefined): Category {
  const name = posName?.trim() || 'Other';
  const key = name.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ');
  const id = CATEGORY_ALIASES[key] ?? slugify(name);
  return (
    siteCategories.find((category) => category.id === id) ?? {
      id,
      slug: id,
      name,
      description: '',
      icon: 'component',
    }
  );
}

export function mapBrand(posName: string | null | undefined): Brand {
  const name = posName?.trim() || 'Other';
  return { id: slugify(name), name, status: 'active' };
}

// ---------- Stock ----------

const STOCK_STATUS_ALIASES: Record<string, StockStatus> = {
  available: 'in-stock',
  in_stock: 'in-stock',
  'in-stock': 'in-stock',
  low_stock: 'low-stock',
  'low-stock': 'low-stock',
  out_of_stock: 'out-of-stock',
  'out-of-stock': 'out-of-stock',
  unavailable: 'out-of-stock',
};

function mapStock(pos: PosProduct): { stockStatus: StockStatus; stockQuantity: number } {
  const quantity = toNumber(pos.stock_quantity);
  if (quantity !== undefined) {
    const stockQuantity = Math.max(0, Math.floor(quantity));
    return { stockQuantity, stockStatus: stockStatusFor(stockQuantity) };
  }
  const status = STOCK_STATUS_ALIASES[pos.stock_status?.trim().toLowerCase() ?? ''];
  // Unknown stock: show it as available rather than hiding a product the store may have.
  return { stockQuantity: 0, stockStatus: status ?? 'in-stock' };
}

// ---------- Specifications ----------

function mapSpecifications(specs: PosProduct['specifications']): SpecRow[] {
  if (!specs) return [];
  const entries = Array.isArray(specs)
    ? (specs as readonly { name: string; value: string | number }[]).map(
        (spec) => [spec.name, spec.value] as const,
      )
    : Object.entries(specs as Record<string, string | number>);
  return entries
    .map(([label, value]) => ({ label: String(label).trim(), value: String(value).trim() }))
    .filter((row) => row.label && row.value);
}

/** Spec label words → the key spec kind shown with an icon on product cards. */
const KEY_SPEC_PATTERNS: [SpecKind, RegExp][] = [
  ['processor', /processor|cpu|chip/i],
  ['memory', /memory|ram/i],
  ['storage', /storage|ssd|hdd|disk/i],
  ['graphics', /graphics|gpu|vga/i],
  ['display', /display|screen/i],
  ['battery', /battery/i],
];

function keySpecsFrom(rows: SpecRow[]): KeySpec[] {
  return KEY_SPEC_PATTERNS.flatMap(([kind, pattern]) => {
    const row = rows.find((item) => pattern.test(item.label));
    return row ? [{ kind, label: row.label, value: row.value }] : [];
  });
}

const PROCESSOR_PATTERNS: [ProcessorFamily, RegExp][] = [
  ['Apple Silicon', /\b(apple|m[1-4])\b/i],
  ['Intel Xeon', /xeon/i],
  ['Intel Core i9', /\b(core\s*)?i9\b|core\s*ultra\s*9/i],
  ['Intel Core i7', /\b(core\s*)?i7\b|core\s*ultra\s*7/i],
  ['Intel Core i5', /\b(core\s*)?i5\b|core\s*ultra\s*5/i],
  ['AMD Ryzen 9', /ryzen\s*(ai\s*)?9/i],
  ['AMD Ryzen 7', /ryzen\s*(ai\s*)?7/i],
];

function processorFamilyOf(processor: string | undefined): ProcessorFamily | undefined {
  if (!processor) return undefined;
  return PROCESSOR_PATTERNS.find(([, pattern]) => pattern.test(processor))?.[0];
}

/** "16GB DDR5" → 16, "1TB SSD" → 1024. */
function sizeInGb(value: string | undefined): number | undefined {
  const [, amount, unit] = value?.match(/(\d+(?:\.\d+)?)\s*(TB|GB)/i) ?? [];
  if (!amount || !unit) return undefined;
  return Math.round(Number(amount) * (unit.toUpperCase() === 'TB' ? 1024 : 1));
}

// ---------- Product ----------

/** Whether a POS product should appear on the website. */
export function isVisibleOnWebsite(pos: PosProduct): boolean {
  return pos.show_on_website !== false;
}

export function mapProduct(pos: PosProduct): ProductView {
  const id = String(pos.id);
  const category = mapCategory(pos.category_name);
  const brand = mapBrand(pos.brand_name);
  const price = toNumber(pos.price) ?? 0;
  const originalPrice = toNumber(pos.original_price);

  const imagePaths = pos.images?.length ? pos.images : pos.image_url ? [pos.image_url] : [];
  const images: ProductImage[] = imagePaths.map((path, index) => ({
    src: imageUrl(path),
    alt: index === 0 ? pos.name : `${pos.name} — view ${index + 1}`,
  }));

  const specifications = mapSpecifications(pos.specifications);
  const keySpecs = keySpecsFrom(specifications);
  const spec = (kind: SpecKind) => keySpecs.find((item) => item.kind === kind)?.value;
  const isComputer = ['laptop', 'desktop', 'workstation', 'gaming'].includes(category.icon);

  return {
    id,
    slug: id,
    referenceId: `#${pos.sku?.trim() || id}`,
    name: pos.name,
    brandId: brand.id,
    categoryId: category.id,
    label: pos.label?.trim() || category.name,
    price,
    compareAtPrice:
      originalPrice !== undefined && originalPrice > price ? originalPrice : undefined,
    ...mapStock(pos),
    images,
    keySpecs,
    specifications,
    description: (pos.description ?? '')
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    // Filter fields only apply to computers, as with the mock catalogue.
    processorFamily: isComputer ? processorFamilyOf(spec('processor')) : undefined,
    memoryGb: isComputer ? sizeInGb(spec('memory')) : undefined,
    storageGb: isComputer ? sizeInGb(spec('storage')) : undefined,
    isFeatured: pos.is_featured ?? false,
    popularity: toNumber(pos.popularity) ?? 0,
    createdAt: pos.created_at ?? '',
    brand,
    category,
  };
}

/** Maps a list of POS products, dropping the ones not shown on the website. */
export function mapProducts(products: readonly PosProduct[]): ProductView[] {
  return products.filter(isVisibleOnWebsite).map(mapProduct);
}
