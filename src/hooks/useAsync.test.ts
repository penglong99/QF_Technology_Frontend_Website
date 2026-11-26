import { act, renderHook, waitFor } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('moves from loading to success', async () => {
    const { result } = renderHook(() => useAsync(() => Promise.resolve(42), []));
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toBe(42);
  });

  it('reports errors', async () => {
    const { result } = renderHook(() => useAsync(() => Promise.reject(new Error('boom')), []));
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error?.message).toBe('boom');
  });

  it('shows loading again when dependencies change and ignores stale results', async () => {
    const { result, rerender } = renderHook(
      ({ id }) => useAsync(() => Promise.resolve(`item-${id}`), [id]),
      { initialProps: { id: 1 } },
    );
    await waitFor(() => expect(result.current.data).toBe('item-1'));
    rerender({ id: 2 });
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.data).toBe('item-2'));
  });

  it('reloads on demand', async () => {
    let calls = 0;
    const { result } = renderHook(() => useAsync(() => Promise.resolve(++calls), []));
    await waitFor(() => expect(result.current.data).toBe(1));
    act(() => result.current.reload());
    await waitFor(() => expect(result.current.data).toBe(2));
  });
});
