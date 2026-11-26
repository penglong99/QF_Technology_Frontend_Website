import { useCallback, useEffect, useState, type DependencyList } from 'react';

export type AsyncState<T> =
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'success'; data: T; error: undefined }
  | { status: 'error'; data: undefined; error: Error };

type SettledState<T> = Exclude<AsyncState<T>, { status: 'loading' }>;

const LOADING = { status: 'loading', data: undefined, error: undefined } as const;

function sameDeps(a: DependencyList, b: DependencyList): boolean {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
}

/**
 * Runs an async loader and tracks loading / success / error, ignoring stale responses.
 * A deliberately small stand-in until real server data justifies TanStack Query.
 *
 * "Loading" is derived rather than stored: a result only counts when it was produced for the
 * current dependencies, so changing a dependency shows the loading state immediately.
 */
export function useAsync<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
): AsyncState<T> & { reload: () => void } {
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState<{ key: DependencyList; state: SettledState<T> } | null>(
    null,
  );
  const key = [...deps, reloadToken];

  useEffect(() => {
    let cancelled = false;
    loader().then(
      (data) => {
        if (!cancelled) setResult({ key, state: { status: 'success', data, error: undefined } });
      },
      (error: unknown) => {
        if (cancelled) return;
        const normalized = error instanceof Error ? error : new Error(String(error));
        setResult({ key, state: { status: 'error', data: undefined, error: normalized } });
      },
    );
    return () => {
      cancelled = true;
    };
    // `key` holds the caller's deps; `loader` is a new function on every render by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, key);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);
  const state = result && sameDeps(result.key, key) ? result.state : LOADING;

  return { ...state, reload };
}
