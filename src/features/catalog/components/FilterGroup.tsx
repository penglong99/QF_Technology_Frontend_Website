import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { classNames } from '@/lib/classNames';
import styles from './FilterPanel.module.css';

interface FilterGroupProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** Collapsible filter section (disclosure pattern). */
export function FilterGroup({ title, defaultOpen = false, children }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <fieldset className={styles.group}>
      <legend className="visually-hidden">{title}</legend>
      <button
        type="button"
        className={styles.groupToggle}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((value) => !value)}
      >
        {title}
        <ChevronDown
          className={classNames(styles.chevron, open && styles.chevronOpen)}
          aria-hidden="true"
        />
      </button>
      <div id={contentId} hidden={!open} className={styles.groupContent}>
        {children}
      </div>
    </fieldset>
  );
}
