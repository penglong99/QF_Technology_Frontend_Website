import type { StockStatus } from '../types';

export const LOW_STOCK_THRESHOLD = 3;

/** Single source of truth for turning a unit count into a stock status. */
export function stockStatusFor(quantity: number): StockStatus {
  if (quantity <= 0) return 'out-of-stock';
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low-stock';
  return 'in-stock';
}
