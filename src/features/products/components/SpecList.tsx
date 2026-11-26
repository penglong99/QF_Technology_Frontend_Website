import type { KeySpec } from '../types';
import { specIcons } from './icons';
import { classNames } from '@/lib/classNames';
import styles from './SpecList.module.css';

interface SpecListProps {
  specs: readonly KeySpec[];
  /** "compact" = icon + value (cards). "detailed" = icon tile + label + value (details page). */
  variant?: 'compact' | 'detailed';
  limit?: number;
  className?: string;
}

export function SpecList({ specs, variant = 'compact', limit, className }: SpecListProps) {
  const visible = limit === undefined ? specs : specs.slice(0, limit);

  return (
    <ul className={classNames(styles.list, styles[variant], className)}>
      {visible.map((spec) => {
        const Icon = specIcons[spec.kind];
        return (
          <li key={`${spec.label}-${spec.value}`} className={styles.item}>
            <span className={styles.icon} aria-hidden="true">
              <Icon />
            </span>
            {variant === 'detailed' ? (
              <span className={styles.text}>
                <span className={styles.label}>{spec.label}</span>
                <span className={styles.value}>{spec.value}</span>
              </span>
            ) : (
              <span className={styles.value}>
                <span className="visually-hidden">{spec.label}: </span>
                {spec.value}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
