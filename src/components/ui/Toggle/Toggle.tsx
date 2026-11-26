import { useId } from 'react';
import { classNames } from '@/lib/classNames';
import styles from './Toggle.module.css';

export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/** An on/off switch (Figma "Form/Toggle"). Uses role="switch" for screen readers. */
export function Toggle({ label, checked, onChange, disabled, className }: ToggleProps) {
  const labelId = useId();

  return (
    <div className={classNames(styles.toggle, className)}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={disabled}
        className={styles.track}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  );
}
