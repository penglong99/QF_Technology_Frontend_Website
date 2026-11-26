import type { Brand, Category, ProductView } from '@/features/products/types';
import { apiConfig } from './apiConfig';
import { mockProductSource } from './mock/mockProductSource';
import { posProductSource } from './pos/posProductSource';

/**
 * The raw product operations the website needs from a data source. There are two
 * implementations: `mockProductSource` (temporary local data) and `posProductSource` (the POS
 * API). `productService` builds every storefront query on top of whichever one is active.
 *
 * Every method returns website types (`ProductView`, `Category`, `Brand`), only includes
 * products that should be shown on the website, and throws `NotFoundError` / `ApiError` from
 * `services/errors.ts` on failure.
 */
export interface ProductSource {
  /** All products shown on the website. */
  getProducts(): Promise<ProductView[]>;
  /** One product; throws `NotFoundError` if it does not exist or is hidden. */
  getProductById(id: string): Promise<ProductView>;
  /** Products in a website category (`Category.id`). */
  getProductsByCategory(categoryId: string): Promise<ProductView[]>;
  /** Products matching a free-text search. */
  searchProducts(query: string): Promise<ProductView[]>;
  getCategories(): Promise<Category[]>;
  getBrands(): Promise<Brand[]>;
}

/** Selected by `VITE_PRODUCT_SOURCE` (see `apiConfig.ts`). */
export const productSource: ProductSource =
  apiConfig.productSource === 'pos' ? posProductSource : mockProductSource;
