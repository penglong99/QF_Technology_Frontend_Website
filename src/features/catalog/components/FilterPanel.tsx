import { useState } from 'react';
import { Checkbox } from '@/components/ui';
import type { Brand, Category } from '@/features/products/types';
import { MEMORY_OPTIONS, PROCESSOR_OPTIONS, type ProductFilters } from '../types';
import type { useCatalogParams } from '../useCatalogParams';
import { FilterGroup } from './FilterGroup';
import styles from './FilterPanel.module.css';

const VISIBLE_BRANDS = 6;

interface FilterPanelProps {
  filters: ProductFilters;
  brands: readonly Brand[];
  categories: readonly Category[];
  onToggle: ReturnType<typeof useCatalogParams>['toggleListValue'];
  onClear: () => void;
}

export function FilterPanel({ filters, brands, categories, onToggle, onClear }: FilterPanelProps) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const activeBrands = brands.filter((brand) => brand.status === 'active');
  const visibleBrands = showAllBrands ? activeBrands : activeBrands.slice(0, VISIBLE_BRANDS);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        <button type="button" className={styles.clear} onClick={onClear}>
          Clear All
        </button>
      </div>

      <FilterGroup title="Brand">
        {visibleBrands.map((brand) => (
          <Checkbox
            key={brand.id}
            label={brand.name}
            checked={filters.brandIds.includes(brand.id)}
            onChange={() => onToggle('brandIds', brand.id)}
          />
        ))}
        {activeBrands.length > VISIBLE_BRANDS && (
          <button
            type="button"
            className={styles.more}
            onClick={() => setShowAllBrands((value) => !value)}
          >
            {showAllBrands ? 'Show fewer brands' : `Show all ${activeBrands.length} brands`}
          </button>
        )}
      </FilterGroup>

      <FilterGroup title="Category">
        {categories.map((category) => (
          <Checkbox
            key={category.id}
            label={category.name}
            checked={filters.categoryIds.includes(category.id)}
            onChange={() => onToggle('categoryIds', category.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Processor">
        {PROCESSOR_OPTIONS.map((processor) => (
          <Checkbox
            key={processor}
            label={processor}
            checked={filters.processorFamilies.includes(processor)}
            onChange={() => onToggle('processorFamilies', processor)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Memory">
        {MEMORY_OPTIONS.map((memory) => (
          <Checkbox
            key={memory}
            label={`${memory}GB`}
            checked={filters.memoryGb.includes(memory)}
            onChange={() => onToggle('memoryGb', String(memory))}
          />
        ))}
      </FilterGroup>
    </div>
  );
}
