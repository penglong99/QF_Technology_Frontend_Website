import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container/Container';
import { categoryIcons } from '@/features/products/components/icons';
import { categoryService } from '@/services/catalogService';
import { productService } from '@/services/productService';
import { useAsync } from '@/hooks/useAsync';
import { catalogPath } from '@/app/paths';
import styles from './HomePage.module.css';

/** Showcased categories in display order; ones without a photo show their icon instead. */
const SHOWCASED_CATEGORIES: { id: string; description: string; image?: string }[] = [
  {
    id: 'laptops',
    description: 'Gaming, business, and everyday laptops for every need.',
    image: '/images/site/category-laptops.webp',
  },
  {
    id: 'desktops',
    description: 'Gaming towers, workstations and compact desktop PCs.',
    image: '/images/site/category-desktops.webp',
  },
  {
    id: 'accessories',
    description: 'Keyboards, mice, monitors, backpacks and more.',
    image: '/images/site/category-accessories.webp',
  },
  {
    id: 'printers',
    description: 'Inkjet, laser and all-in-one printers for home and office.',
    image: '/images/site/category-printers.webp',
  },
  {
    id: 'cctv',
    description: 'CCTV, NVR/DVR, cameras and smart security solutions.',
    image: '/images/site/category-security.webp',
  },
  {
    id: 'services',
    description: 'Repairs, upgrades and setup, in-store or on-site.',
    image: '/images/site/category-services.webp',
  },
];

export function CategoryShowcase() {
  const data = useAsync(
    () => Promise.all([categoryService.list(), productService.countByCategory()]),
    [],
  );

  if (data.status !== 'success') return null;
  const [categories, counts] = data.data;
  const showcased = SHOWCASED_CATEGORIES.flatMap((item) => {
    const category = categories.find((entry) => entry.id === item.id);
    return category ? [{ ...item, category }] : [];
  });

  return (
    <section className={styles.categories} aria-label="Shop by category">
      <Container>
        <ul className={styles.categoryGrid}>
          {showcased.map(({ category, description, image }) => {
            const Icon = categoryIcons[category.icon];
            const isService = category.icon === 'service';
            return (
              <li key={category.id}>
                <Link to={catalogPath({ category: category.slug })} className={styles.categoryCard}>
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      className={styles.categoryImage}
                      width={176}
                      height={158}
                      loading="lazy"
                    />
                  ) : (
                    <span className={styles.categoryIcon} aria-hidden="true">
                      <Icon />
                    </span>
                  )}
                  <span className={styles.categoryText}>
                    <span className={styles.categoryTitle}>{category.name}</span>
                    <span className={styles.categoryDescription}>{description}</span>
                    <span className={styles.categoryMeta}>
                      {isService
                        ? 'Book in-store or on-site'
                        : `${counts[category.id] ?? 0} Units Available`}
                    </span>
                  </span>
                  <span className={styles.categoryArrow} aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
