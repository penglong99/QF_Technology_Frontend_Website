import { X } from 'lucide-react';
import type { Brand, Category } from '@/features/products/types';
import type { ProductFilters } from '../types';
import type { useCatalogParams } from '../useCatalogParams';
import styles from './ActiveFilters.module.css';

interface ActiveFiltersProps {
  filters: ProductFilters;
  brands: readonly Brand[];
  categories: readonly Category[];
  onToggle: ReturnType<typeof useCatalogParams>['toggleListValue'];
  onInStockChange: (value: boolean) => void;
}

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilters({
  filters,
  brands,
  categories,
  onToggle,
  onInStockChange,
}: ActiveFiltersProps) {
  const nameOf = (list: readonly { id: string; name: string }[], id: string) =>
    list.find((item) => item.id === id)?.name ?? id;

  const chips: Chip[] = [
    ...filters.brandIds.map((id) => ({
      key: `brand-${id}`,
      label: nameOf(brands, id),
      onRemove: () => onToggle('brandIds', id),
    })),
    ...filters.categoryIds.map((id) => ({
      key: `category-${id}`,
      label: nameOf(categories, id),
      onRemove: () => onToggle('categoryIds', id),
    })),
    ...filters.processorFamilies.map((cpu) => ({
      key: `cpu-${cpu}`,
      label: cpu,
      onRemove: () => onToggle('processorFamilies', cpu),
    })),
    ...filters.memoryGb.map((memory) => ({
      key: `ram-${memory}`,
      label: `${memory}GB`,
      onRemove: () => onToggle('memoryGb', String(memory)),
    })),
    ...(filters.inStockOnly
      ? [{ key: 'instock', label: 'In stock only', onRemove: () => onInStockChange(false) }]
      : []),
  ];

  if (chips.length === 0) return null;

  return (
    <div className={styles.activeFilters}>
      <span className={styles.label}>Filters:</span>
      <ul className={styles.chips}>
        {chips.map((chip) => (
          <li key={chip.key}>
            <button type="button" className={styles.chip} onClick={chip.onRemove}>
              {chip.label}
              <X aria-hidden="true" />
              <span className="visually-hidden">Remove filter</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
