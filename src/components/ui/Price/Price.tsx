import { formatPrice } from '@/lib/formatPrice';
import { classNames } from '@/lib/classNames';
import styles from './Price.module.css';

export interface PriceProps {
  amount: number;
  /** Original price, shown struck through when higher than `amount`. */
  compareAt?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Price({ amount, compareAt, size = 'md', className }: PriceProps) {
  const hasDiscount = compareAt !== undefined && compareAt > amount;

  return (
    <span className={classNames(styles.price, styles[size], className)}>
      <span className={styles.amount}>{formatPrice(amount)}</span>
      {hasDiscount && (
        <s className={styles.compareAt}>
          <span className="visually-hidden">Was </span>
          {formatPrice(compareAt)}
        </s>
      )}
    </span>
  );
}
