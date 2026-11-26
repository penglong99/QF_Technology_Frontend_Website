import { matchesSearch } from '@/features/catalog/lib/filterProducts';
import { siteCategories } from '@/features/products/categories';
import type { Brand, Category, ProductView } from '@/features/products/types';
import { apiConfig } from '../apiConfig';
import { NotFoundError } from '../errors';
import type { ProductSource } from '../productSource';
import { isVisibleOnWebsite, mapProduct, mapProducts } from './posMapper';
import { posProductApi } from './posProductApi';

/**
 * Product source backed by the POS API (`VITE_PRODUCT_SOURCE=pos`).
 *
 * The full product list is fetched once and reused for `apiConfig.productCacheMs`, because the
 * header, home page and catalog all need it. Category and search results are filtered from that
 * list, so they match the catalog's filters exactly and need only the `/products` endpoint.
 * `posProductApi.fetchProductsByCategory` / `searchProducts` are ready if the catalogue grows
 * large enough to need server-side filtering.
 */

let cache: { products: Promise<ProductView[]>; expiresAt: number } | undefined;

function getProducts(): Promise<ProductView[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.products;
  const products = posProductApi.fetchProducts().then(mapProducts);
  cache = { products, expiresAt: Date.now() + apiConfig.productCacheMs };
  // Don't keep a failed request: the next call should try again.
  products.catch(() => {
    if (cache?.products === products) cache = undefined;
  });
  return products;
}

/** Clears the cached product list (used by tests). */
export function clearPosProductCache(): void {
  cache = undefined;
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

export const posProductSource: ProductSource = {
  getProducts,

  async getProductById(id) {
    const product = await posProductApi.fetchProductById(id);
    if (!isVisibleOnWebsite(product)) throw new NotFoundError('Product', id);
    return mapProduct(product);
  },

  async getProductsByCategory(categoryId) {
    return (await getProducts()).filter((product) => product.categoryId === categoryId);
  },

  async searchProducts(query) {
    return (await getProducts()).filter((product) => matchesSearch(product, query));
  },

  /** Website categories in display order, then any extra categories the POS uses. */
  async getCategories(): Promise<Category[]> {
    const used = (await getProducts()).map((product) => product.category);
    return uniqueById([...siteCategories, ...used]);
  },

  /** Brands that have at least one product on the website. */
  async getBrands(): Promise<Brand[]> {
    return uniqueById((await getProducts()).map((product) => product.brand));
  },
};
