import { posEndpoints } from '../apiConfig';
import { getJson } from '../httpClient';
import type { PosId, PosItemResponse, PosListResponse, PosProduct } from './posTypes';
import { unwrapItem, unwrapList } from './posMapper';

/**
 * Raw POS product requests: one function per endpoint, returning POS-shaped data. Endpoint
 * paths come from `posEndpoints` in `apiConfig.ts`. Add query parameters (paging, language,
 * branch id…) here once the POS documentation says which are needed.
 */
export const posProductApi = {
  /** Get all products. */
  async fetchProducts(): Promise<readonly PosProduct[]> {
    return unwrapList(await getJson<PosListResponse<PosProduct>>(posEndpoints.products));
  },

  /** Get product details by ID, including its images and price. */
  async fetchProductById(id: PosId): Promise<PosProduct> {
    return unwrapItem(
      await getJson<PosItemResponse<PosProduct>>(posEndpoints.productById(String(id)), {
        entity: 'Product',
      }),
    );
  },

  /** Get products by category (POS category id). */
  async fetchProductsByCategory(categoryId: PosId): Promise<readonly PosProduct[]> {
    return unwrapList(
      await getJson<PosListResponse<PosProduct>>(
        posEndpoints.productsByCategory(String(categoryId)),
      ),
    );
  },

  /** Search products. */
  async searchProducts(query: string): Promise<readonly PosProduct[]> {
    return unwrapList(
      await getJson<PosListResponse<PosProduct>>(posEndpoints.searchProducts, {
        params: { q: query },
      }),
    );
  },
};
