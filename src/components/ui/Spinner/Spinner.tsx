import { LoaderCircle } from 'lucide-react';
import styles from './Spinner.module.css';

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className={styles.wrapper} role="status">
      <LoaderCircle className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
