import { Link } from 'react-router';
import { catalogPath } from '@/app/paths';
import type { Category } from '../types';
import { categoryIcons } from './icons';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
  unitCount?: number;
}

export function CategoryCard({ category, unitCount }: CategoryCardProps) {
  const Icon = categoryIcons[category.icon];
  const isService = category.icon === 'service';

  return (
    <Link to={catalogPath({ category: category.slug })} className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        <Icon />
      </span>
      <span className={styles.name}>{category.name}</span>
      <span className={styles.meta}>
        {isService
          ? 'Book in-store or on-site'
          : unitCount === undefined
            ? 'Browse range'
            : `${unitCount} Units Available`}
      </span>
    </Link>
  );
}
