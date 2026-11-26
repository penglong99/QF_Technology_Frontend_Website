import type { ReactNode } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, TriangleAlert } from 'lucide-react';
import { Button, ButtonLink, EmptyState } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { ProductGridSkeleton } from '@/features/products/components/ProductGridSkeleton';
import type { ProductView } from '@/features/products/types';
import { productService } from '@/services/productService';
import { useAsync } from '@/hooks/useAsync';
import { paths } from '@/app/paths';
import { classNames } from '@/lib/classNames';
import { FeaturedProductCard } from './FeaturedProductCard';
import { useCarousel } from './useCarousel';
import styles from './FeaturedInventory.module.css';

const PRIORITY_CARDS = 5;

export function FeaturedInventory() {
  const featured = useAsync(() => productService.getFeatured(8), []);

  return (
    <section className={styles.section} aria-labelledby="featured-heading">
      <Container>
        {featured.status === 'success' ? (
          <FeaturedCarousel products={featured.data} />
        ) : (
          <>
            <FeaturedHeader />
            {featured.status === 'loading' && <ProductGridSkeleton count={4} />}
            {featured.status === 'error' && (
              <EmptyState
                tone="error"
                icon={<TriangleAlert />}
                title="Couldn't load featured products"
                description="Please try again in a moment."
                actions={<Button onClick={featured.reload}>Retry</Button>}
              />
            )}
          </>
        )}
      </Container>
    </section>
  );
}

function FeaturedHeader({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.header}>
      <div>
        <h2 id="featured-heading" className={styles.title}>
          Featured <span className={styles.titleAccent}>Products</span>
        </h2>
        <p className={styles.description}>
          The most powerful units currently available in our shop.
        </p>
      </div>
      <div className={styles.controls}>
        <ButtonLink
          to={paths.catalog}
          variant="secondary"
          trailingIcon={<ArrowRight />}
          className={styles.viewAll}
        >
          View All Products
        </ButtonLink>
        {children}
      </div>
    </div>
  );
}

function FeaturedCarousel({ products }: { products: readonly ProductView[] }) {
  const {
    canScrollPrev,
    canScrollNext,
    thumbSize,
    thumbOffset,
    scrollByCard,
    trackRef,
    trackProps,
  } = useCarousel<HTMLUListElement>();
  const isScrollable = canScrollPrev || canScrollNext;

  return (
    <>
      <FeaturedHeader>
        {isScrollable && (
          <>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Previous products"
              disabled={!canScrollPrev}
              onClick={() => scrollByCard(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className={classNames(styles.arrow, styles.arrowNext)}
              aria-label="Next products"
              disabled={!canScrollNext}
              onClick={() => scrollByCard(1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}
      </FeaturedHeader>

      <ul
        ref={trackRef}
        className={classNames(styles.track, canScrollNext && styles.trackHasMore)}
        aria-label="Featured products"
        {...trackProps}
      >
        {products.map((product, index) => (
          <li key={product.id} className={styles.slide}>
            <FeaturedProductCard product={product} priority={index < PRIORITY_CARDS} />
          </li>
        ))}
      </ul>

      {isScrollable && (
        <div className={styles.progress} aria-hidden="true">
          <span
            className={styles.progressThumb}
            style={{ left: `${thumbOffset * 100}%`, width: `${thumbSize * 100}%` }}
          />
        </div>
      )}
    </>
  );
}
