import { Link } from 'react-router';
import { BadgeCheck, Zap } from 'lucide-react';
import { ButtonLink, Price } from '@/components/ui';
import { classNames } from '@/lib/classNames';
import { paths } from '@/app/paths';
import type { ProductView } from '../types';
import { ProductImage } from './ProductImage';
import { SpecList } from './SpecList';
import { StockBadge } from './StockBadge';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
  product: ProductView;
  /**
   * "full"    — label, specs, price, actions (home + catalog).
   * "compact" — brand, name, highlights (related products, search results).
   */
  variant?: 'full' | 'compact';
  layout?: 'grid' | 'list';
  /** Load the image eagerly for cards visible on first paint. */
  priority?: boolean;
}

export function ProductCard({
  product,
  variant = 'full',
  layout = 'grid',
  priority = false,
}: ProductCardProps) {
  const detailsPath = paths.product(product.slug);

  return (
    <article className={classNames(styles.card, styles[layout], styles[variant])}>
      <Link to={detailsPath} tabIndex={-1} aria-hidden="true" className={styles.imageLink}>
        <ProductImage
          image={product.images[0]}
          categoryIcon={product.category.icon}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className={styles.image}
        />
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.label}>
            {variant === 'full' ? product.label : product.brand.name}
          </span>
          <StockBadge status={product.stockStatus} />
        </div>

        <div>
          <h3 className={styles.name}>
            <Link to={detailsPath} className={styles.nameLink}>
              {product.name}
            </Link>
          </h3>
          {variant === 'full' && <p className={styles.brand}>{product.brand.name}</p>}
        </div>

        {variant === 'full' ? (
          <SpecList specs={product.keySpecs} limit={4} className={styles.specs} />
        ) : (
          <ul className={styles.highlights}>
            <li>
              <Zap aria-hidden="true" /> High Performance
            </li>
            <li>
              <BadgeCheck aria-hidden="true" /> Verified Unit
            </li>
          </ul>
        )}

        <div className={styles.footer}>
          <Price amount={product.price} compareAt={product.compareAtPrice} size="sm" />
          <div className={styles.actions}>
            <ButtonLink to={detailsPath} variant="secondary" fullWidth>
              {variant === 'full' ? 'View Details' : 'View Unit'}
              <span className="visually-hidden">: {product.name}</span>
            </ButtonLink>{' '}
          </div>
        </div>
      </div>
    </article>
  );
}
