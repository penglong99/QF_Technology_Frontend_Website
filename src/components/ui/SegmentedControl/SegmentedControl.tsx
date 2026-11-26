import { classNames } from '@/lib/classNames';
import styles from './SegmentedControl.module.css';

export interface SegmentOption<TValue extends string> {
  value: TValue;
  label: string;
}

export interface SegmentedControlProps<TValue extends string> {
  label: string;
  options: ReadonlyArray<SegmentOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  size?: 'sm' | 'md';
  className?: string;
}

/** Mutually exclusive pill buttons (Figma "Toggle / Pill Buttons"). */
export function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedControlProps<TValue>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={classNames(styles.group, styles[size], className)}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={classNames(styles.option, isSelected && styles.selected)}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
