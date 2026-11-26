import type { ProductView } from '@/features/products/types';
import type { ProductFilters, ProductSort } from '../types';

/** Lower-cased text a search query is matched against. */
function searchableText(product: ProductView): string {
  return [
    product.name,
    product.brand.name,
    product.category.name,
    product.label,
    ...(product.searchTags ?? []),
    ...product.keySpecs.map((spec) => spec.value),
  ]
    .join(' ')
    .toLowerCase();
}

/** Every word of the query must appear somewhere in the product's text. */
export function matchesSearch(product: ProductView, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const text = searchableText(product);
  return terms.every((term) => text.includes(term));
}

export function filterProducts(
  products: readonly ProductView[],
  filters: Partial<ProductFilters>,
): ProductView[] {
  const {
    search = '',
    categoryIds = [],
    brandIds = [],
    processorFamilies = [],
    memoryGb = [],
    inStockOnly = false,
  } = filters;

  return products.filter(
    (product) =>
      matchesSearch(product, search) &&
      (categoryIds.length === 0 || categoryIds.includes(product.categoryId)) &&
      (brandIds.length === 0 || brandIds.includes(product.brandId)) &&
      (processorFamilies.length === 0 ||
        (product.processorFamily !== undefined &&
          processorFamilies.includes(product.processorFamily))) &&
      (memoryGb.length === 0 ||
        (product.memoryGb !== undefined && memoryGb.includes(product.memoryGb))) &&
      (!inStockOnly || product.stockStatus !== 'out-of-stock'),
  );
}

const comparators: Record<ProductSort, (a: ProductView, b: ProductView) => number> = {
  popular: (a, b) => b.popularity - a.popularity,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

export function sortProducts(products: readonly ProductView[], sort: ProductSort): ProductView[] {
  return [...products].sort(comparators[sort]);
}
