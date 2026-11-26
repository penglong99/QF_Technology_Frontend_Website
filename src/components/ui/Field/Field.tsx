import type { ReactNode } from 'react';
import { classNames } from '@/lib/classNames';
import styles from './Field.module.css';

export interface FieldIds {
  inputId: string;
  describedBy: string | undefined;
}

interface FieldProps {
  id: string;
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (ids: FieldIds) => ReactNode;
}

/**
 * Shared label / hint / error layout for form controls. It wires up `aria-describedby`
 * so every control announces its hint and validation message.
 */
export function Field({
  id,
  label,
  hideLabel = false,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={classNames(styles.field, className)}>
      <label htmlFor={id} className={classNames(styles.label, hideLabel && 'visually-hidden')}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({ inputId: id, describedBy })}
      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
