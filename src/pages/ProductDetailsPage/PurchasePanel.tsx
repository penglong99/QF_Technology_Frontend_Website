import { Badge, Price } from '@/components/ui';
import { SpecList } from '@/features/products/components/SpecList';
import type { ProductView, StockStatus } from '@/features/products/types';
import { classNames } from '@/lib/classNames';
import styles from './ProductDetailsPage.module.css';

const availabilityText: Record<StockStatus, string> = {
  'in-stock': 'In Stock | Visit Store to Purchase',
  'low-stock': 'Low Stock | Only a few units left',
  'out-of-stock': 'Out of Stock | Ask us about the next delivery',
};

export function PurchasePanel({ product }: { product: ProductView }) {
  return (
    <div className={styles.panel}>
      <Badge tone="neutral" className={styles.tag}>
        {product.category.name} · {product.brand.name}
      </Badge>
      <h1 className={styles.name}>{product.name}</h1>
      <p className={classNames(styles.availability, styles[product.stockStatus])}>
        <span className={styles.availabilityDot} aria-hidden="true" />
        {availabilityText[product.stockStatus]}
      </p>
      <Price amount={product.price} compareAt={product.compareAtPrice} size="lg" />

      <hr className={styles.divider} />
      <SpecList specs={product.keySpecs} variant="detailed" />

      <p className={styles.reference}>Reference Unit ID: {product.referenceId}</p>
    </div>
  );
}
