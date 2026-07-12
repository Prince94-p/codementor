// src/hooks/useKeyboardShortcut.js
// Hook for registering global keyboard shortcuts with modifier key support

import { useEffect, useCallback } from 'react';

/**
 * @typedef {Object} ShortcutOptions
 * @property {boolean} [ctrl=false] - Require Ctrl key (Cmd on Mac).
 * @property {boolean} [shift=false] - Require Shift key.
 * @property {boolean} [alt=false] - Require Alt key.
 * @property {boolean} [preventDefault=true] - Call event.preventDefault().
 * @property {boolean} [disabled=false] - Temporarily disable the shortcut.
 */

/**
 * Registers a global keyboard shortcut listener on the `window` object.
 * Cleans up automatically when the component unmounts or dependencies change.
 *
 * @param {string} key - The target key (e.g. 'Enter', 'k', 'F5'). Case-insensitive.
 * @param {Function} callback - Function invoked when the shortcut is triggered.
 * @param {ShortcutOptions} [options={}] - Optional modifier and behavior configuration.
 *
 * @example
 * // Ctrl+Enter to run code
 * useKeyboardShortcut('Enter', handleRun, { ctrl: true });
 *
 * // Ctrl+Shift+P to open problem list
 * useKeyboardShortcut('p', openProblems, { ctrl: true, shift: true });
 */
export function useKeyboardShortcut(key, callback, options = {}) {
  const {
    ctrl = false,
    shift = false,
    alt = false,
    preventDefault = true,
    disabled = false,
  } = options;

  const handleKeyDown = useCallback(
    (event) => {
      if (disabled) return;

      const isMac = navigator.platform?.toUpperCase().includes('MAC');
      const ctrlPressed = isMac ? event.metaKey : event.ctrlKey;

      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatches = ctrl ? ctrlPressed : !ctrlPressed || !ctrl;
      const shiftMatches = shift ? event.shiftKey : !event.shiftKey || !shift;
      const altMatches = alt ? event.altKey : !event.altKey || !alt;

      // Exact modifier match
      const modifiersMatch =
        (ctrl ? ctrlPressed : !ctrl || !ctrlPressed) &&
        (shift ? event.shiftKey : true) &&
        (alt ? event.altKey : true);

      if (keyMatches && modifiersMatch) {
        if (preventDefault) event.preventDefault();
        callback(event);
      }
    },
    [key, callback, ctrl, shift, alt, preventDefault, disabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Registers multiple keyboard shortcuts at once from a map of
 * `key => { callback, options }` entries.
 *
 * @param {Object.<string, { callback: Function, options?: ShortcutOptions }>} shortcuts
 *   Map of shortcut key strings to their handlers and options.
 *
 * @example
 * useKeyboardShortcuts({
 *   Enter: { callback: handleRun, options: { ctrl: true } },
 *   's':  { callback: handleSave, options: { ctrl: true } },
 * });
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const isMac = navigator.platform?.toUpperCase().includes('MAC');

    const handleKeyDown = (event) => {
      Object.entries(shortcuts).forEach(([key, { callback, options = {} }]) => {
        const {
          ctrl = false,
          shift = false,
          alt = false,
          preventDefault = true,
          disabled = false,
        } = options;

        if (disabled) return;

        const ctrlPressed = isMac ? event.metaKey : event.ctrlKey;
        const keyMatches = event.key.toLowerCase() === key.toLowerCase();
        const modifiersMatch =
          (ctrl ? ctrlPressed : !ctrl || !ctrlPressed) &&
          (shift ? event.shiftKey : true) &&
          (alt ? event.altKey : true);

        if (keyMatches && modifiersMatch) {
          if (preventDefault) event.preventDefault();
          callback(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(Object.keys(shortcuts))]);
}
