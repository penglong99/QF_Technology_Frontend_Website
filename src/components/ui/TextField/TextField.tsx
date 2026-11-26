import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { classNames } from '@/lib/classNames';
import { Field } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import styles from './TextField.module.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  /** Rendered inside the input on the right, e.g. a show/hide password button. */
  trailingSlot?: ReactNode;
  id?: string;
}

export function TextField({
  label,
  hideLabel,
  hint,
  error,
  leadingIcon,
  trailingSlot,
  id,
  className,
  required,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Field
      id={inputId}
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {({ describedBy }) => (
        <div className={styles.wrapper}>
          {leadingIcon && (
            <span className={styles.leadingIcon} aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          <input
            id={inputId}
            className={classNames(
              fieldStyles.control,
              Boolean(leadingIcon) && styles.withLeadingIcon,
              Boolean(trailingSlot) && styles.withTrailingSlot,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            required={required}
            {...inputProps}
          />
          {trailingSlot && <span className={styles.trailingSlot}>{trailingSlot}</span>}
        </div>
      )}
    </Field>
  );
}
