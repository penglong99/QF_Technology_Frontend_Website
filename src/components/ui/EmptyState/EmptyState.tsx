import type { ReactNode } from 'react';
import { classNames } from '@/lib/classNames';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: 'neutral' | 'error';
  className?: string;
}

/** Used for empty lists, "no results" and error states (Figma "Empty States" frame). */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  tone = 'neutral',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={classNames(styles.emptyState, className)}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {icon && (
        <div className={classNames(styles.icon, styles[tone])} aria-hidden="true">
          {icon}
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
