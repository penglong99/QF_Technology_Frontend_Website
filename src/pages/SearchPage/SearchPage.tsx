import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, TriangleAlert } from 'lucide-react';
import { Button, ButtonLink, EmptyState, Pagination, SelectField } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { SectionHeading } from '@/components/layout/SectionHeading/SectionHeading';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ProductGridSkeleton } from '@/features/products/components/ProductGridSkeleton';
import { CategoryCard } from '@/features/products/components/CategoryCard';
import { SORT_OPTIONS, type ProductSort } from '@/features/catalog/types';
import { categoryService } from '@/services/catalogService';
import { productService } from '@/services/productService';
import { useAsync } from '@/hooks/useAsync';
import { usePageTitle } from '@/hooks/usePageTitle';
import { paths } from '@/app/paths';
import styles from './SearchPage.module.css';

const POPULAR_CATEGORY_IDS = ['laptops', 'workstations', 'gaming-pcs', 'accessories'];

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  usePageTitle(query ? `Search: ${query}` : 'Search');

  return (
    <Container className={styles.page}>
      {query ? <SearchResults key={query} query={query} /> : <PopularCategories prompt />}
    </Container>
  );
}

function SearchResults({ query }: { query: string }) {
  const navigate = useNavigate();
  const [sort, setSort] = useState<ProductSort>('popular');
  const [page, setPage] = useState(1);
  const results = useAsync(
    () => productService.list({ search: query, sort, page, pageSize: 12 }),
    [query, sort, page],
  );

  if (results.status === 'loading') return <ProductGridSkeleton count={6} columns={3} />;

  if (results.status === 'error') {
    return (
      <EmptyState
        tone="error"
        icon={<TriangleAlert />}
        title="Something went wrong"
        description="We encountered an unexpected error while searching. Please try again."
        actions={<Button onClick={results.reload}>Retry</Button>}
      />
    );
  }

  if (results.data.total === 0) {
    return (
      <>
        <EmptyState
          icon={<Search />}
          title="No products found"
          description={`We couldn't find any products matching "${query}". Try checking your spelling or using more general terms.`}
          actions={
            <>
              <Button onClick={() => navigate(paths.search)}>Clear Search</Button>
              <ButtonLink to={paths.catalog} variant="secondary">
                Browse Catalog
              </ButtonLink>
            </>
          }
        />
        <PopularCategories />
      </>
    );
  }

  const { total, items, totalPages } = results.data;

  return (
    <div className={styles.results}>
      <div className={styles.resultsHeader}>
        <SectionHeading
          as="h1"
          title={`${total} ${total === 1 ? 'result' : 'results'} for "${query}"`}
          description="Showing the best matching products currently in store."
        />
        <SelectField
          label="Sort by:"
          appearance="inline"
          options={SORT_OPTIONS}
          value={sort}
          onChange={(value) => {
            setSort(value);
            setPage(1);
          }}
        />
      </div>
      <ProductGrid products={items} columns={3} variant="compact" />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

function PopularCategories({ prompt = false }: { prompt?: boolean }) {
  const data = useAsync(
    () => Promise.all([categoryService.list(), productService.countByCategory()]),
    [],
  );
  if (data.status !== 'success') return null;
  const [categories, counts] = data.data;
  const popular = categories.filter((category) => POPULAR_CATEGORY_IDS.includes(category.id));

  return (
    <section className={styles.popular} aria-labelledby="popular-heading">
      <SectionHeading
        id="popular-heading"
        as={prompt ? 'h1' : 'h2'}
        title={prompt ? 'What are you looking for?' : 'Popular Categories'}
        description="Try starting your search with one of our top-stocked areas."
      />
      <ul className={styles.categoryGrid}>
        {popular.map((category) => (
          <li key={category.id}>
            <CategoryCard category={category} unitCount={counts[category.id] ?? 0} />
          </li>
        ))}
      </ul>
    </section>
  );
}
