import { CircleCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { buyingChecklist } from '../checklist';
import styles from './Checklist.module.css';

export function Checklist({ title, footer }: { title: string; footer?: ReactNode }) {
  return (
    <section className={styles.card} aria-labelledby="checklist-heading">
      <h2 id="checklist-heading" className={styles.title}>
        {title}
      </h2>
      <ul className={styles.list}>
        {buyingChecklist.map((item) => (
          <li key={item}>
            <CircleCheck aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      {footer}
    </section>
  );
}
