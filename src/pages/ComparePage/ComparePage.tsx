import { Link, useSearchParams } from 'react-router';
import { ArrowLeftRight, ArrowRight, TriangleAlert } from 'lucide-react';
import { Badge, Button, ButtonLink, EmptyState, Spinner } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { Checklist } from '@/features/guides/components/Checklist';
import { ProductImage } from '@/features/products/components/ProductImage';
import type { ProductView } from '@/features/products/types';
import { productService } from '@/services/productService';
import { useAsync } from '@/hooks/useAsync';
import { usePageTitle } from '@/hooks/usePageTitle';
import { paths } from '@/app/paths';
import { compareRows, compareValues, resolveSelection } from './compareData';
import { ComparePicker } from './ComparePicker';
import styles from './ComparePage.module.css';

const SELECTION_PARAM = 'p';

function CompareTable({ products }: { products: readonly ProductView[] }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get(SELECTION_PARAM)?.split(',') ?? [];
  const selected = resolveSelection(requested, products);

  const choose = (column: number, slug: string) => {
    const slugs = selected.map((product, index) => (index === column ? slug : product.slug));
    setParams(
      (current) => {
        current.set(SELECTION_PARAM, slugs.join(','));
        return current;
      },
      { replace: true },
    );
  };

  return (
    <div className={styles.tableScroller} tabIndex={0} role="region" aria-label="Comparison table">
      <table className={styles.table}>
        <caption className="visually-hidden">Comparison of the selected products</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.corner} aria-label="Compare Specifications">
              <span className={styles.cornerIcon} aria-hidden="true">
                <ArrowLeftRight />
              </span>
              <span className={styles.cornerTitle}>Compare Specifications</span>
              <span className={styles.cornerHint}>
                Search for any 3 computers to see them side by side.
              </span>
            </th>
            {selected.map((product, column) => (
              <th key={column} scope="col" className={styles.productHeader}>
                <ComparePicker
                  label={`Product ${column + 1}`}
                  exclude={selected.map((item) => item.slug)}
                  onSelect={(picked) => choose(column, picked.slug)}
                />
                <ProductImage
                  image={product.images[0]}
                  categoryIcon={product.category.icon}
                  alt={product.name}
                  className={styles.productImage}
                />
                <Link to={paths.product(product.slug)} className={styles.productName}>
                  {product.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compareRows.map((row) => (
            <tr key={row.key}>
              <th scope="row">{row.label}</th>
              {selected.map((product, column) => (
                <td key={column}>{compareValues(product)[row.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComparePage() {
  usePageTitle('Compare');
  const comparable = useAsync(() => productService.listComparable(), []);

  return (
    <Container className={styles.page}>
      <header className={styles.intro}>
        <Badge tone="neutral">Buying Guide</Badge>
        <h1 className={styles.title}>Not sure which one fits you?</h1>
        <p className={styles.lead}>
          Whether you&apos;re rendering 4K video or just need a reliable machine for the office,
          we&apos;ve benchmarked our current products to help you choose.
        </p>
      </header>

      {comparable.status === 'loading' && <Spinner label="Loading products" />}
      {comparable.status === 'error' && (
        <EmptyState
          tone="error"
          icon={<TriangleAlert />}
          title="Something went wrong"
          description="We could not load the products to compare. Please try again."
          actions={<Button onClick={comparable.reload}>Try again</Button>}
        />
      )}
      {comparable.status === 'success' && <CompareTable products={comparable.data} />}

      <div className={styles.guide}>
        <section className={styles.guideText} aria-labelledby="choosing-heading">
          <h2 id="choosing-heading" className={styles.guideTitle}>
            Choosing the right hardware
          </h2>
          <p>
            High performance is about more than just a fast CPU. When you visit us in-store, we
            encourage you to look at the thermal management and sustain under load. For creative
            work, we always recommend prioritizing RAM over slightly faster clock speeds.
          </p>
          <p>
            If you&apos;re unsure, our technicians run real-world benchmarks on every machine. We
            can show you how each unit handles the specific software you use every day, whether
            that&apos;s AutoCAD, Premiere Pro, or Docker.
          </p>
          <Link to={paths.buyingGuide} className={styles.guideLink}>
            Read the full hardware guide <ArrowRight aria-hidden="true" />
          </Link>
        </section>
        <Checklist
          title="Quick Checklist"
          footer={
            <ButtonLink to={paths.buyingGuide} variant="secondary" fullWidth>
              Open Full Guide
            </ButtonLink>
          }
        />
      </div>
    </Container>
  );
}
