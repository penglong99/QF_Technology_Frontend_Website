import { mapCategory, mapProduct, mapProducts, unwrapItem, unwrapList } from './posMapper';
import type { PosProduct } from './posTypes';

const posLaptop: PosProduct = {
  id: 1042,
  sku: 'QF-BK14',
  name: 'QFBook Pro 14',
  description: 'First paragraph.\n\nSecond paragraph.',
  price: '1499.00',
  original_price: 1649,
  images: ['products/qfbook-1.webp', 'https://cdn.example.com/qfbook-2.webp'],
  category_name: 'Laptop',
  brand_name: 'QF Technology',
  stock_quantity: 2,
  is_featured: true,
  specifications: [
    { name: 'Processor', value: 'AMD Ryzen 7 8845HS' },
    { name: 'RAM', value: '16GB DDR5' },
    { name: 'SSD', value: '1TB NVMe' },
    { name: 'Weight', value: '1.42 kg' },
  ],
  created_at: '2026-09-28',
};

describe('posMapper', () => {
  it('maps a POS product to the website product shape', () => {
    const product = mapProduct(posLaptop);

    expect(product).toMatchObject({
      id: '1042',
      slug: '1042',
      referenceId: '#QF-BK14',
      name: 'QFBook Pro 14',
      price: 1499,
      compareAtPrice: 1649,
      stockQuantity: 2,
      stockStatus: 'low-stock',
      categoryId: 'laptops',
      brandId: 'qf-technology',
      label: 'Laptops',
      isFeatured: true,
      description: ['First paragraph.', 'Second paragraph.'],
      processorFamily: 'AMD Ryzen 7',
      memoryGb: 16,
      storageGb: 1024,
    });
    expect(product.category.icon).toBe('laptop');
    expect(product.keySpecs.map((spec) => spec.kind)).toEqual(['processor', 'memory', 'storage']);
    expect(product.specifications).toHaveLength(4);
    expect(product.images[0]?.src).toMatch(/\/products\/qfbook-1\.webp$/);
    expect(product.images[1]?.src).toBe('https://cdn.example.com/qfbook-2.webp');
  });

  it('uses sensible defaults when optional POS fields are missing', () => {
    const product = mapProduct({ id: 'x1', name: 'USB Cable', price: 5 });

    expect(product).toMatchObject({
      referenceId: '#x1',
      compareAtPrice: undefined,
      stockStatus: 'in-stock',
      images: [],
      description: [],
      processorFamily: undefined,
      brand: { id: 'other', name: 'Other' },
    });
  });

  it('reads the stock status text when no quantity is sent', () => {
    expect(
      mapProduct({ id: 1, name: 'A', price: 1, stock_status: 'out_of_stock' }).stockStatus,
    ).toBe('out-of-stock');
  });

  it('matches POS category names to website categories and keeps unknown ones', () => {
    expect(mapCategory('CCTV & Security').id).toBe('cctv');
    expect(mapCategory('Notebooks').id).toBe('laptops');
    expect(mapCategory('Smart Home')).toMatchObject({ id: 'smart-home', name: 'Smart Home' });
  });

  it('drops products hidden from the website', () => {
    const hidden = { ...posLaptop, id: 2, show_on_website: false };
    expect(mapProducts([posLaptop, hidden]).map((product) => product.id)).toEqual(['1042']);
  });

  it('unwraps bare and { data } responses', () => {
    expect(unwrapList([1, 2])).toEqual([1, 2]);
    expect(unwrapList({ data: [3] })).toEqual([3]);
    expect(unwrapItem({ data: { id: 1 } })).toEqual({ id: 1 });
    expect(unwrapItem({ id: 2 })).toEqual({ id: 2 });
  });
});
