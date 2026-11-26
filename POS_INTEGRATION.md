# POS Integration Guide — QF Technology Website

This guide is for the developers connecting the QF Technology website to the store's POS
(Point of Sale) system. It explains how the website gets product data today, which files to
change, and what still has to be confirmed.

> **Status:** the integration layer is prepared and tested against a **fake** POS server only.
> The website still runs on local sample data (`VITE_PRODUCT_SOURCE=mock`). The POS integration
> is **not complete** until it has been connected to and tested against the real POS API.

---

## 1. Current website architecture

- **Stack:** React 19, TypeScript (strict), Vite 8, React Router 7, CSS Modules. No backend of
  its own. The build output (`dist/`) is a static site.
- **Scope:** a read-only storefront. Visitors browse, search, filter and compare products, then
  visit the store. There is no cart, checkout, login, inventory or sales management on the
  website, and none should be added. The POS is the single source of truth for products.
- **Data flow:** pages never fetch data themselves. Every product request goes through one
  service layer:

```
 Pages & components  (src/pages, src/features, src/components)
         │  call
         ▼
 productService / brandService / categoryService     src/services/productService.ts
         │  (filtering, sorting, paging,              src/services/catalogService.ts
         │   featured, related, suggestions)
         ▼
 productSource  ── chosen by VITE_PRODUCT_SOURCE ──   src/services/productSource.ts
     │                                   │
     ▼ mock                              ▼ pos
 mockProductSource                    posProductSource      (caches the product list)
 src/services/mock/                     │
 (temporary sample data)                ├─ posProductApi    HTTP calls, one per endpoint
                                        ├─ posMapper        POS JSON  →  website types
                                        ├─ posTypes         POS response shapes (placeholders)
                                        └─ httpClient       fetch, timeout, error handling
```

- Pages use the `useAsync` hook (`src/hooks/useAsync.ts`), which already gives every page
  **loading**, **error (with Retry)** and **empty** states. These were checked with the POS
  source, including with the POS server switched off.

## 2. Where the API configuration is

| What                                   | Where                                            |
| -------------------------------------- | ------------------------------------------------ |
| Data source switch, base URL, timeouts | `src/services/apiConfig.ts` → `apiConfig`        |
| POS endpoint paths (placeholders)      | `src/services/apiConfig.ts` → `posEndpoints`     |
| Request headers / authentication       | `src/services/apiConfig.ts` → `getAuthHeaders()` |
| Environment variables                  | `.env` (copy `.env.example`)                     |
| Development proxy to the POS           | `vite.config.ts` (`POS_API_PROXY_TARGET`)        |

Environment variables:

| Variable                  | Purpose                                                             | Default    |
| ------------------------- | ------------------------------------------------------------------- | ---------- |
| `VITE_PRODUCT_SOURCE`     | `mock` (sample data) or `pos` (POS API)                             | `mock`     |
| `VITE_POS_API_BASE_URL`   | URL the browser calls for product data (ideally the proxy)          | `/api/pos` |
| `VITE_POS_IMAGE_BASE_URL` | Prefix for image paths the POS returns as relative paths            | base URL   |
| `VITE_API_TIMEOUT_MS`     | Request timeout                                                     | `10000`    |
| `POS_API_PROXY_TARGET`    | Dev server only: real POS address that `/api/pos/*` is forwarded to | unset      |

`VITE_*` values are built into the public JavaScript. **Never put secrets in them.**

## 3. Where product API requests are implemented

| File                                   | Responsibility                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/services/httpClient.ts`           | `getJson()`: fetch with timeout and auth headers; throws `NotFoundError` on 404, `ApiError` otherwise |
| `src/services/pos/posProductApi.ts`    | One function per POS endpoint, returning raw POS data                                                 |
| `src/services/pos/posTypes.ts`         | TypeScript shapes of the POS responses (**placeholders**)                                             |
| `src/services/pos/posMapper.ts`        | Converts POS data into website types. The only file that knows POS field names                        |
| `src/services/pos/posProductSource.ts` | Implements the `ProductSource` interface on top of the API and mapper; caches the list for 60 s       |
| `src/services/errors.ts`               | `NotFoundError`, `ApiError`, which pages use to choose the right message                              |

The product operations that are prepared:

| Operation                 | `posProductApi`             | Used by the website through                          |
| ------------------------- | --------------------------- | ---------------------------------------------------- |
| Get all products          | `fetchProducts()`           | `posProductSource.getProducts()`                     |
| Get product details by ID | `fetchProductById(id)`      | `posProductSource.getProductById(id)`                |
| Get products by category  | `fetchProductsByCategory()` | prepared; the site currently filters the cached list |
| Search products           | `searchProducts(q)`         | prepared; the site currently filters the cached list |
| Product images and prices | part of every product       | mapped in `posMapper.mapProduct()`                   |

**Why category and search filter the cached list:** a single store's catalogue is small, so the
website loads the full list once and filters it in the browser. This keeps search results
identical to the catalog filters and means the website needs only two endpoints to go live. If
the catalogue grows to thousands of products, switch `getProductsByCategory` / `searchProducts`
in `posProductSource.ts` to the prepared server endpoints. No page needs to change.

## 4. Expected product data structure

### What the website uses internally (do not change without updating the UI)

Defined in `src/features/products/types.ts`. Simplified:

```ts
interface ProductView {
  id: string; // POS product id, as a string
  slug: string; // used in the URL /products/:slug — equal to id for POS products
  referenceId: string; // shown on the product page, e.g. "#QF-BK14"
  name: string;
  description: string[]; // paragraphs
  price: number;
  compareAtPrice?: number; // original price when on sale
  images: { src: string; alt: string }[];
  categoryId: string; // website category slug, e.g. "laptops"
  category: { id; slug; name; description; icon };
  brandId: string; // brand slug, e.g. "asus"
  brand: { id; name; status };
  label: string; // small tag on cards, e.g. "Gaming"
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockQuantity: number;
  keySpecs: { kind; label; value }[]; // processor, memory, storage, graphics…
  specifications: { label; value }[]; // full spec table
  processorFamily?: string;
  memoryGb?: number;
  storageGb?: number; // catalog filters
  isFeatured: boolean;
  popularity: number; // "Most Popular" sort
  createdAt: string; // "Newest" sort (ISO date)
}
```

### What the website assumes the POS sends (placeholder, to be confirmed)

Defined in `src/services/pos/posTypes.ts`. This is an example only. It is **not** the real POS
format:

```json
{
  "id": 1042,
  "sku": "QF-BK14",
  "name": "QFBook Pro 14",
  "description": "Paragraph one.\n\nParagraph two.",
  "price": "1499.00",
  "original_price": 1649,
  "image_url": "products/qfbook.webp",
  "images": ["products/qfbook.webp", "products/qfbook-side.webp"],
  "category_id": 3,
  "category_name": "Laptops",
  "brand_name": "QF Technology",
  "label": "Ultrabook",
  "stock_quantity": 14,
  "stock_status": "available",
  "show_on_website": true,
  "is_featured": false,
  "specifications": [{ "name": "Processor", "value": "AMD Ryzen 7 8845HS" }],
  "popularity": 98,
  "created_at": "2026-09-28"
}
```

Lists may be a bare array or wrapped as `{ "data": [...] }`; single items may be wrapped as
`{ "data": {...} }`. Both are handled.

### How the mapping works (`posMapper.ts`)

| Website field                              | Derived from POS                                                                                                                                                            |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`, `slug`                               | `id` (as a string)                                                                                                                                                          |
| `referenceId`                              | `#` + `sku`, or `#` + `id`                                                                                                                                                  |
| `price`, `compareAtPrice`                  | `price`, and `original_price` when it is higher (numbers or numeric strings)                                                                                                |
| `images`                                   | `images`, else `image_url`; relative paths prefixed with `VITE_POS_IMAGE_BASE_URL`                                                                                          |
| `category`                                 | `category_name` matched to the website's categories (`src/features/products/categories.ts`) via `CATEGORY_ALIASES`; unknown names become a new category with a generic icon |
| `brand`                                    | `brand_name` (slug becomes the id)                                                                                                                                          |
| `stockQuantity`, `stockStatus`             | `stock_quantity` (≤ 3 is "low stock"), else the `stock_status` text                                                                                                         |
| `specifications`, `keySpecs`               | `specifications` list or object; key specs are picked by label (Processor/CPU, RAM/Memory, SSD/Storage, GPU/Graphics, Display, Battery)                                     |
| `processorFamily`, `memoryGb`, `storageGb` | Parsed from those specs, for computer categories only                                                                                                                       |
| `description`                              | `description` split on blank lines                                                                                                                                          |
| hidden products                            | `show_on_website: false` → excluded everywhere, product page shows "not found"                                                                                              |

Categories are **website-owned presentation**: names, descriptions and icons live in
`src/features/products/categories.ts`, and pages link to their slugs (`/catalog?category=laptops`).
The POS decides which category each product is in.

## 5. API endpoints the website needs

Paths are placeholders in `posEndpoints` (`src/services/apiConfig.ts`). All are read-only `GET`.

| Purpose                      | Placeholder                     | Required to go live?        |
| ---------------------------- | ------------------------------- | --------------------------- |
| All products for the website | `GET /products`                 | **Yes**                     |
| One product (details page)   | `GET /products/{id}`            | **Yes**                     |
| Products by category         | `GET /categories/{id}/products` | Optional (large catalogues) |
| Search                       | `GET /products/search?q=…`      | Optional (large catalogues) |

The website needs **only read access**. It never creates, updates or deletes POS data.

## 6. Authentication (to be confirmed by the POS team)

The website cannot keep a secret: anything in the frontend bundle is visible to every visitor.

- **If the product API is public** (read-only, no key), the browser can call it directly. Set
  `VITE_POS_API_BASE_URL` to it, and allow the website's domain in the POS API's CORS settings.
- **If the API needs a key or token (recommended setup):** put a small **server-side proxy** on
  the website's host, e.g. `https://qftechnology.com/api/pos/*` → POS API. The proxy adds the
  credential, and can also cache and strip fields. Leave `VITE_POS_API_BASE_URL=/api/pos`.
  In development, `POS_API_PROXY_TARGET` in `.env` makes the Vite dev server act as this proxy.
  The dev proxy does not add credentials; add a `headers` option in `vite.config.ts` if needed.
- `getAuthHeaders()` in `apiConfig.ts` is the single place for request headers. Use it only for
  values that are safe to be public.

Never connect the website directly to the POS database, and never put database credentials or
API secrets in this repository or in `VITE_*` variables.

## 7. How to connect the POS API (step by step)

1. **Update the response types.** Edit `src/services/pos/posTypes.ts` to match the real POS
   JSON.
2. **Update the mapper.** Run `npm run typecheck`, then fix `src/services/pos/posMapper.ts` until
   it compiles. Adjust `CATEGORY_ALIASES` so every POS category maps to the right website
   category, and `STOCK_STATUS_ALIASES` for the POS stock values.
3. **Set the endpoint paths** in `posEndpoints`, and auth headers in `getAuthHeaders()` if
   needed (see section 6).
4. **Update the tests.** `src/services/pos/posMapper.test.ts` and `posProductSource.test.ts` use
   sample POS JSON. Replace it with real sample responses and run `npm test`.
5. **Try it locally.** Create `.env`:
   ```
   VITE_PRODUCT_SOURCE=pos
   VITE_POS_API_BASE_URL=/api/pos
   POS_API_PROXY_TARGET=https://<pos-api-host>/<api-prefix>
   ```
   Run `npm run dev`, then check the home page, catalog filters, search, compare, a product page,
   a hidden or missing product (should show "Product not found"), and the POS switched off
   (should show "Something went wrong" with Retry).
6. **Deploy.** Set up the production proxy (section 6), build with `VITE_PRODUCT_SOURCE=pos`,
   then test the live site.
7. **Clean up** once the POS source is live: delete `src/services/mock/` and its import in
   `src/services/productSource.ts`. Tests that render pages on the mock catalogue
   (`CatalogPage.test.tsx`, `ComparePage.test.tsx`, `Header.test.tsx`) should then mock
   `productService` with `vi.spyOn` and `src/test/factories.ts`, as
   `FeaturedInventory.test.tsx` already does.

## 8. Files the POS team should modify

| File                                   | Change                                            |
| -------------------------------------- | ------------------------------------------------- |
| `src/services/pos/posTypes.ts`         | Real POS response shapes                          |
| `src/services/pos/posMapper.ts`        | Field mapping, category and stock aliases         |
| `src/services/apiConfig.ts`            | `posEndpoints`, `getAuthHeaders()`, cache time    |
| `src/services/pos/posProductApi.ts`    | Query parameters (paging, branch…), if needed     |
| `src/services/pos/posProductSource.ts` | Only if switching to server-side category/search  |
| `src/services/pos/*.test.ts`           | Real sample responses                             |
| `.env` / hosting environment           | `VITE_PRODUCT_SOURCE`, `VITE_POS_API_BASE_URL`, … |
| Hosting server config                  | `/api/pos` proxy (new, outside this repo)         |

**No page or component should need changes.** If one seems to, the mapping probably belongs in
`posMapper.ts` instead.

## 9. Assumptions and open questions

Please confirm or correct each of these:

1. **Endpoints:** real URLs, HTTP methods and query parameters for "all products" and "product
   by id". Is there paging, and what is the page-size limit?
2. **Response format:** field names and types, list wrapping, and the date format.
3. **Product ID:** is it stable and unique? It appears in product URLs (`/products/1042`), so
   changing it breaks shared links.
4. **Visibility:** how does the POS mark products that should **not** appear online (inactive,
   internal items, services)? The website assumes `show_on_website`.
5. **Prices:** currency (the site displays USD), tax-inclusive or not, the sale/original price
   field, and whether prices can be hidden ("call for price").
6. **Stock:** is the exact quantity available, or only a status? Which status values exist?
   The home page shows "N Units Available" per category from quantities.
7. **Images:** absolute URLs or paths? Is there a CDN? Are there several images per product,
   in what order, and at what sizes?
8. **Categories and brands:** the full POS category list (to fill `CATEGORY_ALIASES`) and whether
   brands are a field on the product.
9. **Specifications:** are technical specs stored in the POS, and in what form? Without them,
   product cards show no key specs and the CPU/RAM catalog filters and compare table are empty
   for POS products.
10. **Featured and popularity:** does the POS have a "featured" flag or sales ranking? Without
    one, the home page shows the most popular products, or the first ones if there is no ranking.
11. **Authentication, CORS and rate limits:** see section 6.
12. **Freshness:** how quickly must price and stock changes appear? The website caches the
    product list for 60 seconds per visitor (`apiConfig.productCacheMs`).
13. **Environments:** a test or staging POS API, and sample data for development.
