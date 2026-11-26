import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/**
 * localStorage access can throw (private mode, blocked storage). Fall back to memory so
 * the app still works — the data just won't survive a reload.
 */
const memory = new Map<string, string>();

const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return memory.get(name) ?? null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      memory.set(name, value);
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      memory.delete(name);
    }
  },
};

export const persistentStorage = createJSONStorage(() => safeLocalStorage);
