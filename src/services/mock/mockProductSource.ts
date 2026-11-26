import { matchesSearch } from '@/features/catalog/lib/filterProducts';
import { siteCategories } from '@/features/products/categories';
import type { Product, ProductView } from '@/features/products/types';
import { apiConfig } from '../apiConfig';
import { NotFoundError } from '../errors';
import type { ProductSource } from '../productSource';
import { mockBrands } from './data/brands';
import type { MockProduct } from './data/productFactory';
import { mockProducts } from './data/products';

/**
 * TEMPORARY product source backed by the local mock catalogue in `./data/`. Used while the POS
 * API is not connected (`VITE_PRODUCT_SOURCE=mock`) and by the test suite. Delete this folder
 * once the POS source is live and nothing imports it.
 */

/** Resolves with a copy of the value after a simulated network delay. */
function respond<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(value)), apiConfig.mockLatencyMs);
  });
}

function toView(mock: MockProduct): ProductView {
  // `publishStatus` is mock-only; pages receive plain products.
  const product: Product & Partial<Pick<MockProduct, 'publishStatus'>> = { ...mock };
  delete product.publishStatus;
  const brand = mockBrands.find((item) => item.id === product.brandId);
  const category = siteCategories.find((item) => item.id === product.categoryId);
  if (!brand) throw new NotFoundError('Brand', product.brandId);
  if (!category) throw new NotFoundError('Category', product.categoryId);
  return { ...product, brand, category };
}

function visibleProducts(): ProductView[] {
  return mockProducts.filter((product) => product.publishStatus === 'published').map(toView);
}

export const mockProductSource: ProductSource = {
  getProducts: () => respond(visibleProducts()),

  async getProductById(id) {
    const product = visibleProducts().find((item) => item.id === id);
    if (!product) throw new NotFoundError('Product', id);
    return respond(product);
  },

  getProductsByCategory: (categoryId) =>
    respond(visibleProducts().filter((product) => product.categoryId === categoryId)),

  searchProducts: (query) =>
    respond(visibleProducts().filter((product) => matchesSearch(product, query))),

  getCategories: () => respond(siteCategories),

  getBrands: () => respond(mockBrands),
};
