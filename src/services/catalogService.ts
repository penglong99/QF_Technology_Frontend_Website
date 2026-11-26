import type { Brand, Category } from '@/features/products/types';
import { productSource } from './productSource';

export const brandService = {
  /** All brands, A–Z. */
  async list(): Promise<Brand[]> {
    return [...(await productSource.getBrands())].sort((a, b) => a.name.localeCompare(b.name));
  },
};

export const categoryService = {
  /** All categories, in the website's display order. */
  list(): Promise<Category[]> {
    return productSource.getCategories();
  },
};
