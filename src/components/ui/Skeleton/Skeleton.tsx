import { classNames } from '@/lib/classNames';
import styles from './Skeleton.module.css';

/** Grey placeholder block shown while content loads. Size it with a className. */
export function Skeleton({ className }: { className?: string }) {
  return <span className={classNames(styles.skeleton, className)} aria-hidden="true" />;
}
