import { LayoutGrid, List } from 'lucide-react';
import { classNames } from '@/lib/classNames';
import type { CatalogView } from '../useCatalogParams';
import styles from './ViewToggle.module.css';

export function ViewToggle({
  value,
  onChange,
}: {
  value: CatalogView;
  onChange: (view: CatalogView) => void;
}) {
  const options = [
    { view: 'grid' as const, label: 'Grid view', Icon: LayoutGrid },
    { view: 'list' as const, label: 'List view', Icon: List },
  ];

  return (
    <div className={styles.toggle} role="group" aria-label="Layout">
      {options.map(({ view, label, Icon }) => (
        <button
          key={view}
          type="button"
          aria-label={label}
          aria-pressed={value === view}
          className={classNames(styles.option, value === view && styles.selected)}
          onClick={() => onChange(view)}
        >
          <Icon aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
