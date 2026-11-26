import { Link } from 'react-router';
import { ButtonLink, Price } from '@/components/ui';
import { ProductImage } from '@/features/products/components/ProductImage';
import { SpecList } from '@/features/products/components/SpecList';
import { StockBadge } from '@/features/products/components/StockBadge';
import type { ProductView } from '@/features/products/types';
import { paths } from '@/app/paths';
import { classNames } from '@/lib/classNames';
import styles from './FeaturedInventory.module.css';

interface FeaturedProductCardProps {
  product: ProductView;
  /** Load the image eagerly for cards visible on first paint. */
  priority?: boolean;
}

export function FeaturedProductCard({ product, priority = false }: FeaturedProductCardProps) {
  const detailsPath = paths.product(product.slug);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Link to={detailsPath} tabIndex={-1} aria-hidden="true" className={styles.imageLink}>
          <ProductImage
            image={product.images[0]}
            categoryIcon={product.category.icon}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className={styles.image}
          />
        </Link>
        <span className={styles.category}>{product.label}</span>
        <StockBadge
          status={product.stockStatus}
          className={classNames(
            styles.stock,
            // StockBadge only draws a dot for "In Stock"; the design has one on every status.
            product.stockStatus !== 'in-stock' && styles.stockDot,
          )}
        />
      </div>

      <div className={styles.body}>
        <div>
          <p className={styles.brand}>{product.brand.name}</p>
          <h3 className={styles.name}>
            <Link to={detailsPath} className={styles.nameLink}>
              {product.name}
            </Link>
          </h3>
        </div>

        <SpecList specs={product.keySpecs} limit={4} className={styles.specs} />

        <div className={styles.footer}>
          <Price
            amount={product.price}
            compareAt={product.compareAtPrice}
            className={styles.price}
          />
          <ButtonLink to={detailsPath} variant="secondary" fullWidth className={styles.details}>
            View Details
            <span className="visually-hidden">: {product.name}</span>
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
