import { useId, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { classNames } from '@/lib/classNames';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label: string;
  /** Keep the label for screen readers only (e.g. row-selection checkboxes in tables). */
  hideLabel?: boolean;
  /** Optional trailing text, e.g. a result count. */
  meta?: string;
  id?: string;
}

export function Checkbox({
  label,
  hideLabel = false,
  meta,
  id,
  className,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={classNames(styles.checkbox, className)}>
      <input id={inputId} type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true">
        <Check className={styles.tick} strokeWidth={3} />
      </span>
      <span className={hideLabel ? 'visually-hidden' : styles.label}>{label}</span>
      {meta && <span className={styles.meta}>{meta}</span>}
    </label>
  );
}
