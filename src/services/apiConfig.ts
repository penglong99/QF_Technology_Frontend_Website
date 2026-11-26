/**
 * Central API configuration. Everything the POS integration needs to change lives here or in
 * `.env` — see POS_INTEGRATION.md.
 *
 * Only public values belong in `VITE_*` variables: they are compiled into the JavaScript that
 * every visitor downloads. POS credentials must stay on a server (see `getAuthHeaders`).
 */

export type ProductSourceName = 'mock' | 'pos';

function readProductSource(value: string | undefined): ProductSourceName {
  return value === 'pos' ? 'pos' : 'mock';
}

export const apiConfig = {
  /** Where product data comes from. `mock` until the POS API is connected and tested. */
  productSource: readProductSource(import.meta.env.VITE_PRODUCT_SOURCE),
  /**
   * Base URL of the POS product API, or of the website's own server-side proxy to it
   * (recommended, e.g. `/api/pos`). No trailing slash.
   */
  posBaseUrl: (import.meta.env.VITE_POS_API_BASE_URL ?? '/api/pos').replace(/\/+$/, ''),
  /**
   * Prefix for product image paths the POS sends as relative paths (absolute URLs are used as
   * they are). Defaults to `posBaseUrl`.
   */
  posImageBaseUrl: (
    import.meta.env.VITE_POS_IMAGE_BASE_URL ??
    import.meta.env.VITE_POS_API_BASE_URL ??
    '/api/pos'
  ).replace(/\/+$/, ''),
  /** Abort POS requests that take longer than this. */
  requestTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 10_000,
  /** How long the POS product list is reused before it is fetched again. */
  productCacheMs: 60_000,
  /** Simulated network latency for mock responses, so loading states are exercised. */
  mockLatencyMs: import.meta.env.MODE === 'test' ? 0 : 250,
} as const;

/**
 * POS endpoint paths, relative to `posBaseUrl`.
 *
 * PLACEHOLDERS — these are not the real POS routes. Replace them with the paths from the POS
 * team's API documentation.
 */
export const posEndpoints = {
  /** GET → every product that should appear on the website. */
  products: '/products',
  /** GET → one product. */
  productById: (id: string) => `/products/${encodeURIComponent(id)}`,
  /** GET → products in one category. */
  productsByCategory: (categoryId: string) =>
    `/categories/${encodeURIComponent(categoryId)}/products`,
  /** GET ?q=… → products matching a search query. */
  searchProducts: '/products/search',
  /** GET → product categories. */
  categories: '/categories',
  /** GET → product brands. */
  brands: '/brands',
} as const;

/**
 * Extra headers sent with every POS request.
 *
 * TO BE CONFIRMED by the POS team. Never put a secret API key or database credentials here:
 * anything in frontend code is public. If the POS API needs a secret, call it through a
 * server-side proxy that adds the credential, and point `VITE_POS_API_BASE_URL` at the proxy.
 */
export function getAuthHeaders(): Record<string, string> {
  return {};
}
