import { useId, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { classNames } from '@/lib/classNames';
import { Field } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import styles from './SelectField.module.css';

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export interface SelectFieldProps<TValue extends string = string> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'onChange' | 'value'
> {
  label: string;
  hideLabel?: boolean;
  options: ReadonlyArray<SelectOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  hint?: string;
  error?: string;
  /** "inline" is the compact borderless style used for "Sort by". */
  appearance?: 'field' | 'inline';
  id?: string;
}

export function SelectField<TValue extends string = string>({
  label,
  hideLabel,
  options,
  value,
  onChange,
  hint,
  error,
  appearance = 'field',
  id,
  className,
  required,
  ...rest
}: SelectFieldProps<TValue>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const isInline = appearance === 'inline';

  return (
    <Field
      id={selectId}
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      required={required}
      className={classNames(isInline && styles.inlineField, className)}
    >
      {({ describedBy }) => (
        <div className={styles.wrapper}>
          <select
            id={selectId}
            value={value}
            onChange={(event) => {
              const selected = options.find((option) => option.value === event.target.value);
              if (selected) onChange(selected.value);
            }}
            className={classNames(
              isInline ? styles.inlineSelect : fieldStyles.control,
              styles.select,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            required={required}
            {...rest}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </div>
      )}
    </Field>
  );
}
