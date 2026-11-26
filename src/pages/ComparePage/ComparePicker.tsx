import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { classNames } from '@/lib/classNames';
import type { ProductView } from '@/features/products/types';
import { productService } from '@/services/productService';
import { useAsync } from '@/hooks/useAsync';
import styles from './ComparePicker.module.css';

const DEBOUNCE_MS = 250;

interface ComparePickerProps {
  label: string;
  /** Slugs already in the table, left out of the results. */
  exclude: readonly string[];
  onSelect: (product: ProductView) => void;
}

/** Search box that finds a computer to put in a compare column (WAI-ARIA combobox). */
export function ComparePicker({ label, exclude, onSelect }: ComparePickerProps) {
  const id = useId();
  const listboxId = `${id}-results`;
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const trimmed = query.trim();
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed]);

  const results = useAsync(
    () =>
      debouncedQuery
        ? productService.searchComparable(debouncedQuery)
        : Promise.resolve<ProductView[]>([]),
    [debouncedQuery],
  );
  const options = (results.data ?? []).filter((product) => !exclude.includes(product.slug));
  const searching = trimmed !== debouncedQuery || results.status === 'loading';
  const showPanel = open && trimmed !== '';
  const active = options[Math.min(activeIndex, options.length - 1)];

  const choose = (product: ProductView) => {
    onSelect(product);
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      if (options.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => (index + step + options.length) % options.length);
    } else if (event.key === 'Enter' && showPanel && active) {
      event.preventDefault();
      choose(active);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className={styles.picker}>
      <label htmlFor={`${id}-input`} className="visually-hidden">
        {label}
      </label>
      <Search className={styles.icon} aria-hidden="true" />
      <input
        id={`${id}-input`}
        type="search"
        role="combobox"
        autoComplete="off"
        placeholder="Search a computer…"
        aria-autocomplete="list"
        aria-expanded={showPanel}
        aria-controls={listboxId}
        aria-activedescendant={showPanel && active ? `${id}-${active.slug}` : undefined}
        className={styles.input}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />

      <div className={styles.panel} hidden={!showPanel}>
        {!showPanel ? null : searching && options.length === 0 ? (
          <p className={styles.status}>Searching…</p>
        ) : results.status === 'error' ? (
          <p className={styles.status}>Search is unavailable right now.</p>
        ) : options.length === 0 ? (
          <p className={styles.status}>No computers match “{trimmed}”.</p>
        ) : null}
        <ul id={listboxId} role="listbox" aria-label={`${label} results`} className={styles.list}>
          {options.map((product) => (
            <li
              key={product.slug}
              id={`${id}-${product.slug}`}
              role="option"
              aria-selected={product === active}
              className={classNames(styles.option, product === active && styles.active)}
              // Keep focus in the input so the click lands before the panel closes
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(options.indexOf(product))}
              onClick={() => choose(product)}
            >
              {product.images[0] ? (
                <img src={product.images[0].src} alt="" className={styles.thumb} />
              ) : (
                <span className={styles.thumb} aria-hidden="true" />
              )}
              <span className={styles.optionText}>
                <span className={styles.optionName}>{product.name}</span>
                <span className={styles.optionMeta}>
                  {product.brand.name} · {formatPrice(product.price)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
