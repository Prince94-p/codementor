// src/hooks/useDebounce.js
// Debounce hook: delays updating a value until after a specified idle period

import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of no changes. Useful for search inputs and live code analysis triggers
 * to avoid excessive re-renders or API calls.
 *
 * @template T
 * @param {T} value - The value to debounce.
 * @param {number} [delay=300] - Debounce delay in milliseconds.
 * @returns {T} The debounced value.
 *
 * @example
 * const debouncedCode = useDebounce(code, 500);
 * // debouncedCode updates 500ms after the user stops typing
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes before delay expires
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Returns a debounced callback function that delays invocation until after
 * `delay` ms of no calls. Cleans up automatically on unmount.
 *
 * @param {Function} callback - The function to debounce.
 * @param {number} [delay=300] - Debounce delay in milliseconds.
 * @param {Array} [deps=[]] - Dependencies that reset the debounce timer.
 * @returns {Function} The debounced callback.
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((q) => search(q), 400);
 */
export function useDebouncedCallback(callback, delay = 300, deps = []) {
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return (...args) => {
    if (timer) clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        callback(...args);
        setTimer(null);
      }, delay)
    );
  };
}
