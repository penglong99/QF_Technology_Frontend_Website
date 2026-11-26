import { useState } from 'react';
import { SearchX, SlidersHorizontal, TriangleAlert } from 'lucide-react';
import { Breadcrumb, Button, EmptyState, Modal, Pagination, SelectField } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ProductGridSkeleton } from '@/features/products/components/ProductGridSkeleton';
import { FilterPanel } from '@/features/catalog/components/FilterPanel';
import { ActiveFilters } from '@/features/catalog/components/ActiveFilters';
import { ViewToggle } from '@/features/catalog/components/ViewToggle';
import { useCatalogParams } from '@/features/catalog/useCatalogParams';
import { SORT_OPTIONS } from '@/features/catalog/types';
import { brandService, categoryService } from '@/services/catalogService';
import { productService } from '@/services/productService';
import { useAsync } from '@/hooks/useAsync';
import { usePageTitle } from '@/hooks/usePageTitle';
import { paths } from '@/app/paths';
import styles from './CatalogPage.module.css';

export function CatalogPage() {
  const catalog = useCatalogParams();
  const { filters, sort, page, view } = catalog;
  const [filtersOpen, setFiltersOpen] = useState(false);

  const taxonomy = useAsync(() => Promise.all([brandService.list(), categoryService.list()]), []);
  const results = useAsync(
    () => productService.list({ ...filters, sort, page }),
    [JSON.stringify(filters), sort, page],
  );

  const [brands, categories] = taxonomy.data ?? [[], []];
  const singleCategory =
    filters.categoryIds.length === 1
      ? categories.find((category) => category.id === filters.categoryIds[0])
      : undefined;
  usePageTitle(singleCategory ? singleCategory.name : 'Catalog');

  const filterPanel = (
    <FilterPanel
      filters={filters}
      brands={brands}
      categories={categories}
      onToggle={catalog.toggleListValue}
      onClear={catalog.clearFilters}
    />
  );

  return (
    <Container className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Home', to: paths.home },
          { label: 'Catalog', to: singleCategory ? paths.catalog : undefined },
          ...(singleCategory ? [{ label: singleCategory.name }] : []),
        ]}
      />
      <h1 className="visually-hidden">{singleCategory ? singleCategory.name : 'Catalog'}</h1>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Product filters">
          {filterPanel}
        </aside>

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <p className={styles.count} aria-live="polite">
              {results.status === 'success' ? (
                <>
                  Showing <strong>{results.data.total}</strong>{' '}
                  {results.data.total === 1 ? 'product' : 'products'}
                </>
              ) : (
                'Loading products…'
              )}
            </p>
            <div className={styles.toolbarControls}>
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<SlidersHorizontal />}
                className={styles.filterButton}
                onClick={() => setFiltersOpen(true)}
              >
                Filters
              </Button>
              <SelectField
                label="Sort by:"
                appearance="inline"
                options={SORT_OPTIONS}
                value={sort}
                onChange={catalog.setSort}
              />
              <ViewToggle value={view} onChange={catalog.setView} />
            </div>
          </div>

          <ActiveFilters
            filters={filters}
            brands={brands}
            categories={categories}
            onToggle={catalog.toggleListValue}
            onInStockChange={catalog.setInStockOnly}
          />

          {results.status === 'loading' && <ProductGridSkeleton count={6} columns={3} />}
          {results.status === 'error' && (
            <EmptyState
              tone="error"
              icon={<TriangleAlert />}
              title="Something went wrong"
              description="We couldn't load the catalog. Please try again."
              actions={<Button onClick={results.reload}>Retry</Button>}
            />
          )}
          {results.status === 'success' && results.data.total === 0 && (
            <EmptyState
              icon={<SearchX />}
              title="No products match these filters"
              description="Try removing a filter or two to see more of our products."
              actions={<Button onClick={catalog.clearFilters}>Clear All Filters</Button>}
            />
          )}
          {results.status === 'success' && results.data.total > 0 && (
            <>
              <ProductGrid
                products={results.data.items}
                columns={3}
                layout={view}
                priorityCount={3}
              />
              <Pagination
                className={styles.pagination}
                currentPage={results.data.page}
                totalPages={results.data.totalPages}
                onPageChange={(next) => {
                  catalog.setPage(next);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </div>
      </div>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filter products"
        size="md"
        align="start"
        footer={
          <Button fullWidth onClick={() => setFiltersOpen(false)}>
            {results.status === 'success' ? `Show ${results.data.total} results` : 'Show results'}
          </Button>
        }
      >
        {filterPanel}
      </Modal>
    </Container>
  );
}
