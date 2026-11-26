import type { Brand, Category, ProductView } from '@/features/products/types';

const defaultBrand: Brand = { id: 'asus', name: 'Asus', status: 'active' };
const defaultCategory: Category = {
  id: 'laptops',
  slug: 'laptops',
  name: 'Laptops',
  description: '',
  icon: 'laptop',
};

/** Builds a complete ProductView for tests; override only what the test cares about. */
export function buildProductView(overrides: Partial<ProductView> = {}): ProductView {
  const id = overrides.id ?? 'test-product';
  const brandId = overrides.brandId ?? defaultBrand.id;
  const categoryId = overrides.categoryId ?? defaultCategory.id;
  return {
    id,
    slug: id,
    referenceId: '#QF-TEST-0001',
    name: 'Test Laptop',
    brandId,
    categoryId,
    label: 'Laptop',
    price: 1000,
    stockStatus: 'in-stock',
    stockQuantity: 5,
    images: [],
    keySpecs: [{ kind: 'memory', label: 'Memory', value: `${overrides.memoryGb ?? 16}GB DDR5` }],
    specifications: [],
    description: [],
    isFeatured: false,
    popularity: 1,
    createdAt: '2026-01-01',
    brand: {
      ...defaultBrand,
      id: brandId,
      name: brandId.charAt(0).toUpperCase() + brandId.slice(1),
    },
    category: { ...defaultCategory, id: categoryId, slug: categoryId, name: categoryId },
    ...overrides,
  };
}
