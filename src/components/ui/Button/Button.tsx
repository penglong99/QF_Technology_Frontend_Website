import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { buttonClassName, type ButtonStyleProps } from './buttonClassName';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonStyleProps, ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function Button({
  variant,
  size,
  fullWidth,
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth }, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <LoaderCircle className={styles.spinner} aria-hidden="true" /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
}

export interface ButtonLinkProps extends ButtonStyleProps, LinkProps {}

/** A router link styled as a button — for navigation actions such as "Explore Catalog". */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClassName({ variant, size, fullWidth }, className)} {...rest}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </Link>
  );
}
