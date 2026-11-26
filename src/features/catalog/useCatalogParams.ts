import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { ProcessorFamily } from '@/features/products/types';
import {
  MEMORY_OPTIONS,
  PROCESSOR_OPTIONS,
  SORT_OPTIONS,
  type ProductFilters,
  type ProductSort,
} from './types';

/**
 * Catalog state lives in the URL (?category=laptops&brand=asus,dell&sort=price-asc&page=2)
 * so results can be bookmarked and shared, and the back button works.
 */
export type CatalogView = 'grid' | 'list';

export interface CatalogParams {
  filters: ProductFilters;
  sort: ProductSort;
  page: number;
  view: CatalogView;
}

const LIST_KEYS = {
  categoryIds: 'category',
  brandIds: 'brand',
  processorFamilies: 'cpu',
  memoryGb: 'ram',
} as const;

function readList(params: URLSearchParams, key: string): string[] {
  return (params.get(key) ?? '').split(',').filter(Boolean);
}

function isSort(value: string | null): value is ProductSort {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function parseCatalogParams(params: URLSearchParams): CatalogParams {
  const page = Number.parseInt(params.get('page') ?? '1', 10);
  const sort = params.get('sort');
  return {
    filters: {
      search: params.get('q') ?? '',
      categoryIds: readList(params, LIST_KEYS.categoryIds),
      brandIds: readList(params, LIST_KEYS.brandIds),
      processorFamilies: readList(params, LIST_KEYS.processorFamilies).filter(
        (value): value is ProcessorFamily =>
          (PROCESSOR_OPTIONS as readonly string[]).includes(value),
      ),
      memoryGb: readList(params, LIST_KEYS.memoryGb)
        .map(Number)
        .filter((value) => MEMORY_OPTIONS.includes(value)),
      inStockOnly: params.get('instock') === '1',
    },
    sort: isSort(sort) ? sort : 'popular',
    page: Number.isFinite(page) && page > 0 ? page : 1,
    view: params.get('view') === 'list' ? 'list' : 'grid',
  };
}

type ListFilterKey = keyof typeof LIST_KEYS;

export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = useMemo(() => parseCatalogParams(searchParams), [searchParams]);

  /** Applies changes; any change other than paging returns to page 1. */
  const update = useCallback(
    (mutate: (params: URLSearchParams) => void, options: { keepPage?: boolean } = {}) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          mutate(next);
          if (!options.keepPage) next.delete('page');
          return next;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const toggleListValue = useCallback(
    (key: ListFilterKey, value: string) =>
      update((params) => {
        const paramName = LIST_KEYS[key];
        const values = readList(params, paramName);
        const next = values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value];
        if (next.length) params.set(paramName, next.join(','));
        else params.delete(paramName);
      }),
    [update],
  );

  return {
    ...state,
    toggleListValue,
    setInStockOnly: (value: boolean) =>
      update((params) => (value ? params.set('instock', '1') : params.delete('instock'))),
    setSort: (sort: ProductSort) =>
      update((params) => (sort === 'popular' ? params.delete('sort') : params.set('sort', sort))),
    setPage: (page: number) =>
      update((params) => (page <= 1 ? params.delete('page') : params.set('page', String(page))), {
        keepPage: true,
      }),
    setView: (view: CatalogView) =>
      update((params) => (view === 'grid' ? params.delete('view') : params.set('view', view)), {
        keepPage: true,
      }),
    clearFilters: () =>
      update((params) => {
        Object.values(LIST_KEYS).forEach((key) => params.delete(key));
        params.delete('instock');
        params.delete('q');
      }),
  };
}
