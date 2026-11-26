import type { Product, ProductView } from '@/features/products/types';
import type { PaginatedResult, ProductQuery } from '@/features/catalog/types';
import { filterProducts, sortProducts } from '@/features/catalog/lib/filterProducts';
import { productSource } from './productSource';

const DEFAULT_PAGE_SIZE = 9;

/** Computers: the products that have the specs the compare table shows. */
function comparable(products: ProductView[]): ProductView[] {
  return products
    .filter((product) => product.processorFamily !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Every product query the storefront makes. Pages call this, never a data source directly.
 *
 * Filtering, sorting and pagination run in the browser on the full product list, which suits a
 * single-store catalogue. If the POS catalogue grows to thousands of items, move `list` to
 * server-side filtering here without changing any page.
 */
export const productService = {
  /** Catalog and search results with filtering, sorting and pagination. */
  async list(query: ProductQuery = {}): Promise<PaginatedResult<ProductView>> {
    const { sort = 'popular', page = 1, pageSize = DEFAULT_PAGE_SIZE, ...filters } = query;
    const matching = sortProducts(filterProducts(await productSource.getProducts(), filters), sort);
    const totalPages = Math.max(1, Math.ceil(matching.length / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    return {
      items: matching.slice(start, start + pageSize),
      total: matching.length,
      page: safePage,
      pageSize,
      totalPages,
    };
  },

  /** Every computer, A–Z, for the compare page and the header's brand menu. */
  async listComparable(): Promise<ProductView[]> {
    return comparable(await productSource.getProducts());
  },

  /** Computers matching a search, for the compare picker. */
  async searchComparable(query: string, limit = 8): Promise<ProductView[]> {
    return comparable(await productSource.searchProducts(query)).slice(0, limit);
  },

  /** Products flagged as featured; falls back to the most popular if none are flagged. */
  async getFeatured(limit = 8): Promise<ProductView[]> {
    const products = await productSource.getProducts();
    const featured = products.filter((product) => product.isFeatured);
    return (featured.length > 0 ? featured : sortProducts(products, 'popular')).slice(0, limit);
  },

  /** One product for its details page; throws `NotFoundError` if missing or hidden. */
  getBySlug(slug: string): Promise<ProductView> {
    return productSource.getProductById(slug);
  },

  async getByIds(ids: readonly string[]): Promise<ProductView[]> {
    return (await productSource.getProducts()).filter((product) => ids.includes(product.id));
  },

  /** Other products from the same category, most popular first. */
  async getRelated(product: Product, limit = 4): Promise<ProductView[]> {
    const sameCategory = await productSource.getProductsByCategory(product.categoryId);
    return sortProducts(
      sameCategory.filter((item) => item.id !== product.id),
      'popular',
    ).slice(0, limit);
  },

  /** Quick suggestions for the search dropdown. */
  async suggest(search: string, limit = 5): Promise<ProductView[]> {
    if (!search.trim()) return [];
    return sortProducts(await productSource.searchProducts(search), 'popular').slice(0, limit);
  },

  /** Category id → units in stock across that category's products. */
  async countByCategory(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const product of await productSource.getProducts()) {
      counts[product.categoryId] = (counts[product.categoryId] ?? 0) + product.stockQuantity;
    }
    return counts;
  },
};
