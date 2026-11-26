import type { ReactNode } from 'react';
import { classNames } from '@/lib/classNames';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  align?: 'start' | 'center';
  /** Heading level; sections inside a page are h2 by default. */
  as?: 'h1' | 'h2';
  size?: 'md' | 'lg';
  id?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  description,
  eyebrow,
  align = 'start',
  as: Heading = 'h2',
  size = 'md',
  id,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={classNames(styles.heading, styles[align], className)}>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <Heading id={id} className={classNames(styles.title, styles[size])}>
          {title}
        </Heading>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
