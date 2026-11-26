import { formatPrice } from '@/lib/formatPrice';
import type { KeySpec, ProductView } from '@/features/products/types';

export type CompareRowKey =
  | 'price'
  | 'processor'
  | 'graphics'
  | 'memory'
  | 'storage'
  | 'display'
  | 'battery'
  | 'weight'
  | 'bestFor';

export const compareRows: ReadonlyArray<{ key: CompareRowKey; label: string }> = [
  { key: 'price', label: 'Price' },
  { key: 'processor', label: 'Processor' },
  { key: 'graphics', label: 'Graphics' },
  { key: 'memory', label: 'Memory' },
  { key: 'storage', label: 'Storage' },
  { key: 'display', label: 'Display' },
  { key: 'battery', label: 'Battery Life' },
  { key: 'weight', label: 'Weight' },
  { key: 'bestFor', label: 'Best For' },
];

export const COMPARE_COLUMN_COUNT = 3;

/** Our three house lines, compared until the visitor picks something else. */
const DEFAULT_SLUGS = ['qfbook-air-13', 'qfbook-pro-14', 'qf-coreline-x1'];

/** Shown where a product has no value recorded for a row. */
const NOT_LISTED = '—';

const BEST_FOR_BY_CATEGORY: Record<string, string> = {
  laptops: 'Work & Study on the Go',
  desktops: 'Home & Office',
  'all-in-one': 'Home & Front Desk',
  workstations: 'Engineers & Heavy Rendering',
  'gaming-pcs': 'Gaming & Creative Work',
};

function keySpec(product: ProductView, kind: KeySpec['kind']): string | undefined {
  return product.keySpecs.find((spec) => spec.kind === kind)?.value;
}

function bestFor(product: ProductView): string {
  if (product.searchTags?.includes('Gaming')) return 'Gaming & Streaming';
  return BEST_FOR_BY_CATEGORY[product.categoryId] ?? NOT_LISTED;
}

export function compareValues(product: ProductView): Record<CompareRowKey, string> {
  const onBattery = product.categoryId === 'laptops';

  return {
    price: formatPrice(product.price),
    processor: keySpec(product, 'processor') ?? NOT_LISTED,
    graphics: keySpec(product, 'graphics') ?? NOT_LISTED,
    memory: keySpec(product, 'memory') ?? NOT_LISTED,
    storage: keySpec(product, 'storage') ?? NOT_LISTED,
    display: keySpec(product, 'display') ?? NOT_LISTED,
    battery: keySpec(product, 'battery') ?? (onBattery ? NOT_LISTED : 'N/A (Desktop Power)'),
    weight: product.specifications.find((row) => row.label === 'Weight')?.value ?? NOT_LISTED,
    bestFor: bestFor(product),
  };
}

/**
 * The products to show, from the slugs in the page link. Unknown and repeated slugs are skipped,
 * and any empty column falls back to the defaults, so a stale link still shows a full table.
 */
export function resolveSelection(
  requested: readonly string[],
  products: readonly ProductView[],
): ProductView[] {
  const slugs = [
    ...requested.slice(0, COMPARE_COLUMN_COUNT),
    ...DEFAULT_SLUGS,
    ...products.map((product) => product.slug),
  ];

  const selected: ProductView[] = [];
  for (const slug of slugs) {
    const product = products.find((item) => item.slug === slug);
    if (product && !selected.includes(product)) selected.push(product);
  }
  return selected.slice(0, COMPARE_COLUMN_COUNT);
}
