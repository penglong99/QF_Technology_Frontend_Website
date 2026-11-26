import { Minus, Plus } from 'lucide-react';
import { classNames } from '@/lib/classNames';
import styles from './QuantityStepper.module.css';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Describes what is being counted, e.g. the product name. */
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  size = 'md',
  className,
}: QuantityStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <div
      className={classNames(styles.stepper, styles[size], className)}
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button
        type="button"
        className={styles.step}
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        <Minus aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        className={styles.input}
        aria-label="Quantity"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const parsed = Number.parseInt(event.target.value, 10);
          if (!Number.isNaN(parsed)) onChange(clamp(parsed));
        }}
      />
      <button
        type="button"
        className={styles.step}
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        <Plus aria-hidden="true" />
      </button>
    </div>
  );
}
