import {
  useDeferredValue,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router';
import { Clock, Search, X } from 'lucide-react';
import { productService } from '@/services/productService';
import { useAsync } from '@/hooks/useAsync';
import { classNames } from '@/lib/classNames';
import { paths, searchPath } from '@/app/paths';
import { POPULAR_SEARCHES, useRecentSearches } from '../store';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
  /** Shorter input with a short placeholder, for the site header. */
  compact?: boolean;
}

/**
 * Inventory search with live suggestions (WAI-ARIA combobox). Enter searches,
 * arrow keys move through product suggestions, Escape closes the panel.
 */
export function SearchBar({ initialQuery = '', className, compact = false }: SearchBarProps) {
  const navigate = useNavigate();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const deferredQuery = useDeferredValue(query.trim());
  const { recent, remember, forget } = useRecentSearches();

  const suggestions = useAsync(() => productService.suggest(deferredQuery), [deferredQuery]);
  const options = suggestions.data ?? [];

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    remember(trimmed);
    setQuery(trimmed);
    setOpen(false);
    navigate(searchPath(trimmed));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const active = options[activeIndex];
    if (open && active) {
      setOpen(false);
      navigate(paths.product(active.slug));
      return;
    }
    runSearch(query);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    setOpen(true);
    if (options.length === 0) return;
    const step = event.key === 'ArrowDown' ? 1 : -1;
    setActiveIndex((index) => (index + step + options.length) % options.length);
  };

  const activeOption = options[activeIndex];
  const showPanel = open && (options.length > 0 || deferredQuery === '');

  return (
    <div
      ref={containerRef}
      className={classNames(styles.searchBar, compact && styles.compact, className)}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <form role="search" onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor={`${listboxId}-input`} className="visually-hidden">
          Search product
        </label>
        <Search className={styles.icon} aria-hidden="true" />
        <input
          id={`${listboxId}-input`}
          type="search"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-activedescendant={activeOption ? `${listboxId}-${activeOption.id}` : undefined}
          placeholder={
            compact
              ? 'Search product…'
              : 'Search product (e.g., "RTX 4080", "MacBook Pro", "32GB RAM")'
          }
          className={styles.input}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              setActiveIndex(-1);
            }}
          >
            <X aria-hidden="true" />
          </button>
        )}
      </form>

      <div className={styles.panel} hidden={!showPanel}>
        {options.length > 0 && (
          <div className={styles.group}>
            <p className={styles.groupTitle} id={`${listboxId}-label`}>
              Suggestions
            </p>
            <ul id={listboxId} role="listbox" aria-labelledby={`${listboxId}-label`}>
              {options.map((product, index) => (
                <li
                  key={product.id}
                  id={`${listboxId}-${product.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={classNames(
                    styles.option,
                    index === activeIndex && styles.activeOption,
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setOpen(false);
                    navigate(paths.product(product.slug));
                  }}
                >
                  <Search aria-hidden="true" />
                  <span>{product.name}</span>
                  <span className={styles.optionMeta}>{product.category.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {deferredQuery === '' && (
          <>
            <div className={styles.group}>
              <p className={styles.groupTitle}>Popular Searches</p>
              <ul className={styles.chips}>
                {POPULAR_SEARCHES.map((term) => (
                  <li key={term}>
                    <button type="button" className={styles.chip} onClick={() => runSearch(term)}>
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {recent.length > 0 && (
              <div className={styles.group}>
                <p className={styles.groupTitle}>Recent Searches</p>
                <ul>
                  {recent.map((term) => (
                    <li key={term} className={styles.recent}>
                      <button
                        type="button"
                        className={styles.recentButton}
                        onClick={() => runSearch(term)}
                      >
                        <Clock aria-hidden="true" />
                        {term}
                      </button>
                      <button
                        type="button"
                        className={styles.remove}
                        aria-label={`Remove "${term}" from recent searches`}
                        onClick={() => forget(term)}
                      >
                        <X aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      {/* Hidden live region so screen readers hear how many suggestions appeared. */}
      <p className="visually-hidden" aria-live="polite">
        {open && deferredQuery && suggestions.status === 'success'
          ? `${options.length} suggestions available`
          : ''}
      </p>
    </div>
  );
}
