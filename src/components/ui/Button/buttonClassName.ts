import type { ReactNode } from 'react';
import { classNames } from '@/lib/classNames';
import styles from './Button.module.css';

export type ButtonVariant =
  'primary' | 'secondary' | 'ghost' | 'destructive' | 'inverse' | 'outlineInverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/** Button styling for elements that cannot use <Button>, such as external links. */
export function buttonClassName(
  { variant = 'primary', size = 'md', fullWidth = false }: ButtonStyleProps,
  extra?: string,
): string {
  return classNames(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    extra,
  );
}
