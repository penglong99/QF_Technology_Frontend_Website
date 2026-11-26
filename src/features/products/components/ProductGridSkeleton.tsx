import { Skeleton } from '@/components/ui';
import gridStyles from './ProductGrid.module.css';
import styles from './ProductGridSkeleton.module.css';
import { classNames } from '@/lib/classNames';

export function ProductGridSkeleton({
  count = 8,
  columns = 4,
}: {
  count?: number;
  columns?: 3 | 4;
}) {
  return (
    <div role="status" aria-label="Loading products">
      <ul
        className={classNames(gridStyles.grid, gridStyles[`columns${columns}`])}
        aria-hidden="true"
      >
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className={styles.card}>
            <Skeleton className={styles.image} />
            <Skeleton className={styles.lineShort} />
            <Skeleton className={styles.line} />
            <Skeleton className={styles.line} />
            <Skeleton className={styles.button} />
          </li>
        ))}
      </ul>
    </div>
  );
}
