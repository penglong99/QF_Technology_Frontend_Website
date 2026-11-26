import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistentStorage } from '@/lib/safeStorage';

const MAX_RECENT = 5;

interface RecentSearchState {
  recent: string[];
  remember: (query: string) => void;
  forget: (query: string) => void;
}

export const useRecentSearches = create<RecentSearchState>()(
  persist(
    (set) => ({
      recent: [],
      remember: (query) =>
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;
          const others = state.recent.filter(
            (item) => item.toLowerCase() !== trimmed.toLowerCase(),
          );
          return { recent: [trimmed, ...others].slice(0, MAX_RECENT) };
        }),
      forget: (query) =>
        set((state) => ({ recent: state.recent.filter((item) => item !== query) })),
    }),
    { name: 'qf-recent-searches', storage: persistentStorage, version: 1 },
  ),
);

export const POPULAR_SEARCHES = [
  'Gaming Laptops',
  'Workstations',
  '32GB',
  'RTX',
  'Apple',
  'Printer',
  'CCTV',
] as const;
