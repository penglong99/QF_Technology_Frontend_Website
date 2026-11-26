import type { ReactNode } from 'react';
import { Container } from '../Container/Container';
import styles from './CtaBand.module.css';

interface CtaBandProps {
  title: string;
  actions: ReactNode;
}

/** Full-width navy call-to-action band (homepage). */
export function CtaBand({ title, actions }: CtaBandProps) {
  return (
    <section className={styles.band}>
      <Container className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.actions}>{actions}</div>
      </Container>
    </section>
  );
}
