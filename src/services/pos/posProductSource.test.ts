import { ApiError, NotFoundError } from '../errors';
import { clearPosProductCache, posProductSource } from './posProductSource';
import type { PosProduct } from './posTypes';

const products: PosProduct[] = [
  { id: 1, name: 'ROG Strix G16', price: 1599, category_name: 'Laptops', brand_name: 'Asus' },
  { id: 2, name: 'EcoTank L3250', price: 199, category_name: 'Printers', brand_name: 'Epson' },
  { id: 3, name: 'Hidden item', price: 1, show_on_website: false },
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  clearPosProductCache();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('posProductSource', () => {
  it('fetches, maps and caches the product list', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: products }));

    const first = await posProductSource.getProducts();
    await posProductSource.getProductsByCategory('printers');

    expect(first.map((product) => product.name)).toEqual(['ROG Strix G16', 'EcoTank L3250']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/\/products$/);
  });

  it('searches and lists brands from the cached products', async () => {
    fetchMock.mockResolvedValue(jsonResponse(products));

    expect((await posProductSource.searchProducts('strix')).map((p) => p.id)).toEqual(['1']);
    expect((await posProductSource.getBrands()).map((brand) => brand.id)).toEqual([
      'asus',
      'epson',
    ]);
  });

  it('gets one product by id and treats hidden or missing products as not found', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(products[0]));
    expect((await posProductSource.getProductById('1')).name).toBe('ROG Strix G16');

    fetchMock.mockResolvedValueOnce(jsonResponse(products[2]));
    await expect(posProductSource.getProductById('3')).rejects.toBeInstanceOf(NotFoundError);

    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'Not found' }, 404));
    await expect(posProductSource.getProductById('99')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('reports server and network failures as ApiError and retries next time', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, 500));
    await expect(posProductSource.getProducts()).rejects.toBeInstanceOf(ApiError);

    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(posProductSource.getProducts()).rejects.toBeInstanceOf(ApiError);

    fetchMock.mockResolvedValueOnce(jsonResponse(products));
    await expect(posProductSource.getProducts()).resolves.toHaveLength(2);
  });
});
