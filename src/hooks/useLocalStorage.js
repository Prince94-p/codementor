// src/hooks/useLocalStorage.js
// Reusable hook for syncing React state with localStorage

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React hook that persists state in localStorage.
 * Automatically serializes/deserializes JSON and syncs across tabs.
 *
 * @template T
 * @param {string} key - The localStorage key to store the value under.
 * @param {T} initialValue - The default value if no entry exists in localStorage.
 * @returns {[T, Function, Function]} A tuple of [storedValue, setValue, removeValue].
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'dark');
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to read key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Updates the stored value both in state and localStorage.
   *
   * @param {T | Function} value - New value or an updater function.
   */
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`[useLocalStorage] Failed to write key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Removes the entry from localStorage and resets to the initial value.
   */
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to remove key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync state with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch {
          // ignore parse errors from external writes
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
