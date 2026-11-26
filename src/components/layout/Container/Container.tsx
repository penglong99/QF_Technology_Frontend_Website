import type { ElementType, ReactNode } from 'react';
import { classNames } from '@/lib/classNames';
import styles from './Container.module.css';

interface ContainerProps {
  as?: ElementType;
  /** "narrow" is used for long-form text such as the buying guide. */
  width?: 'default' | 'narrow';
  className?: string;
  children: ReactNode;
}

/** Centers content on the 12-column grid with the Figma page margins. */
export function Container({
  as: Element = 'div',
  width = 'default',
  className,
  children,
}: ContainerProps) {
  return (
    <Element className={classNames(styles.container, styles[width], className)}>{children}</Element>
  );
}
