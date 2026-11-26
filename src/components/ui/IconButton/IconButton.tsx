import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '@/lib/classNames';
import styles from './IconButton.module.css';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only buttons need an accessible name. */
  label: string;
  icon: ReactNode;
  shape?: 'square' | 'circle';
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

export function IconButton({
  label,
  icon,
  shape = 'square',
  variant = 'default',
  size = 'md',
  type = 'button',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={classNames(
        styles.iconButton,
        styles[shape],
        styles[variant],
        styles[size],
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}
