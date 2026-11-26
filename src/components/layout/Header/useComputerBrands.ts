import { productService } from '@/services/productService';
import { useAsync } from '@/hooks/useAsync';
import type { Brand } from '@/features/products/types';

export interface ComputerBrand {
  brand: Brand;
  count: number;
}

/** Brands that have at least one computer for sale, A–Z, with how many each has. */
export function useComputerBrands(): ComputerBrand[] {
  const computers = useAsync(() => productService.listComparable(), []);
  if (computers.status !== 'success') return [];

  const byBrand = new Map<string, ComputerBrand>();
  for (const product of computers.data) {
    const entry = byBrand.get(product.brand.id);
    if (entry) entry.count += 1;
    else byBrand.set(product.brand.id, { brand: product.brand, count: 1 });
  }
  return [...byBrand.values()].sort((a, b) => a.brand.name.localeCompare(b.brand.name));
}
