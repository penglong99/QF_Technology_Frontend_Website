import { useState } from 'react';
import type { CategoryIcon, ProductImage as ProductImageData } from '../types';
import { ProductImage } from './ProductImage';
import { classNames } from '@/lib/classNames';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: readonly ProductImageData[];
  productName: string;
  categoryIcon: CategoryIcon;
}

export function ProductGallery({ images, productName, categoryIcon }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className={styles.gallery}>
      <ProductImage
        image={activeImage}
        categoryIcon={categoryIcon}
        alt={productName}
        loading="eager"
        className={styles.main}
      />
      {images.length > 1 && (
        <ul className={styles.thumbnails} aria-label="Product photos">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                className={classNames(
                  styles.thumbnail,
                  index === activeIndex && styles.activeThumbnail,
                )}
                aria-label={`Show photo ${index + 1} of ${images.length}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                <img src={image.src} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
