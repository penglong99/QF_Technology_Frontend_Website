import type { ProcessorFamily } from '@/features/products/types';

export type ProductSort = 'popular' | 'newest' | 'price-asc' | 'price-desc';

export interface ProductFilters {
  search: string;
  categoryIds: string[];
  brandIds: string[];
  processorFamilies: ProcessorFamily[];
  memoryGb: number[];
  inStockOnly: boolean;
}

export interface ProductQuery extends Partial<ProductFilters> {
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const SORT_OPTIONS: ReadonlyArray<{ value: ProductSort; label: string }> = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export const PROCESSOR_OPTIONS: readonly ProcessorFamily[] = [
  'Intel Core i9',
  'Intel Core i7',
  'Intel Core i5',
  'Intel Xeon',
  'AMD Ryzen 9',
  'AMD Ryzen 7',
  'Apple Silicon',
];

export const MEMORY_OPTIONS: readonly number[] = [16, 32, 64, 128];
