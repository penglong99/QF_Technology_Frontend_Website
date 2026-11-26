import type { ReactNode } from 'react';
import { classNames } from '@/lib/classNames';
import styles from './Badge.module.css';

export type BadgeTone = 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'solid';

export interface BadgeProps {
  tone?: BadgeTone;
  /** Shows a small leading dot, as on the Figma stock-status pills. */
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', dot = false, className, children }: BadgeProps) {
  return (
    <span className={classNames(styles.badge, styles[tone], className)}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
