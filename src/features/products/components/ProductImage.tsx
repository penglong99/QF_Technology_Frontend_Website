import type { ProductImage as ProductImageData, CategoryIcon } from '../types';
import { categoryIcons } from './icons';
import { classNames } from '@/lib/classNames';
import styles from './ProductImage.module.css';

interface ProductImageProps {
  image: ProductImageData | undefined;
  /** Used for the placeholder when a product has no photo yet. */
  categoryIcon: CategoryIcon;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/** Product photo with a neutral, labelled placeholder for items that have no image yet. */
export function ProductImage({
  image,
  categoryIcon,
  alt,
  className,
  loading = 'lazy',
}: ProductImageProps) {
  if (!image) {
    const Icon = categoryIcons[categoryIcon];
    return (
      <div
        className={classNames(styles.frame, styles.placeholder, className)}
        role="img"
        aria-label={`${alt} (photo coming soon)`}
      >
        <Icon aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={classNames(styles.frame, className)}>
      <img src={image.src} alt={image.alt || alt} loading={loading} className={styles.image} />
    </div>
  );
}
