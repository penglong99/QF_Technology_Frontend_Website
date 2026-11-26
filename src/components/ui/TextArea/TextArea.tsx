import { useId, type TextareaHTMLAttributes } from 'react';
import { Field } from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import styles from './TextArea.module.css';
import { classNames } from '@/lib/classNames';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
}

export function TextArea({
  label,
  hint,
  error,
  id,
  className,
  required,
  rows = 4,
  ...rest
}: TextAreaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Field
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {({ describedBy }) => (
        <textarea
          id={inputId}
          rows={rows}
          className={classNames(fieldStyles.control, styles.textarea)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          {...rest}
        />
      )}
    </Field>
  );
}
