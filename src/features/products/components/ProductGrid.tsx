import type { ProductView } from '../types';
import { ProductCard, type ProductCardProps } from './ProductCard';
import { classNames } from '@/lib/classNames';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: readonly ProductView[];
  columns?: 3 | 4;
  layout?: 'grid' | 'list';
  variant?: ProductCardProps['variant'];
  /** How many leading cards load their image eagerly. */
  priorityCount?: number;
  className?: string;
}

export function ProductGrid({
  products,
  columns = 4,
  layout = 'grid',
  variant = 'full',
  priorityCount = 0,
  className,
}: ProductGridProps) {
  return (
    <ul
      className={classNames(
        styles.grid,
        layout === 'list' ? styles.list : styles[`columns${columns}`],
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id} className={styles.item}>
          <ProductCard
            product={product}
            layout={layout}
            variant={variant}
            priority={index < priorityCount}
          />
        </li>
      ))}
    </ul>
  );
}
