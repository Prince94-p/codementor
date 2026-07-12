// src/utils/helpers.js
// Shared utility functions used across the CodeMentor application

import { DIFFICULTY, XP_BY_DIFFICULTY } from './constants';

/**
 * Formats a duration in milliseconds to a human-readable string (e.g., "2m 30s").
 *
 * @param {number} ms - Duration in milliseconds.
 * @returns {string} Formatted duration string.
 *
 * @example
 * formatDuration(150000); // "2m 30s"
 */
export function formatDuration(ms) {
  if (!ms || ms < 0) return '0s';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Returns the XP (experience points) reward for solving a problem of a given difficulty.
 *
 * @param {string} difficulty - Problem difficulty ('Easy' | 'Medium' | 'Hard').
 * @returns {number} XP points earned.
 */
export function getXPForDifficulty(difficulty) {
  return XP_BY_DIFFICULTY[difficulty] ?? XP_BY_DIFFICULTY[DIFFICULTY.EASY];
}

/**
 * Calculates the user's current level based on total XP using a square-root curve.
 *
 * @param {number} xp - Total accumulated XP.
 * @returns {number} Current level (minimum 1).
 */
export function calculateLevel(xp) {
  if (!xp || xp <= 0) return 1;
  return Math.max(1, Math.floor(Math.sqrt(xp / 10)) + 1);
}

/**
 * Calculates XP progress towards the next level.
 *
 * @param {number} xp - Total accumulated XP.
 * @returns {{ level: number, currentXP: number, nextLevelXP: number, progress: number }}
 *   Object containing level info and progress as a percentage (0-100).
 */
export function getLevelProgress(xp) {
  const level = calculateLevel(xp);
  const currentLevelXP = Math.pow(level - 1, 2) * 10;
  const nextLevelXP = Math.pow(level, 2) * 10;
  const currentXP = xp - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  const progress = needed > 0 ? Math.min(100, Math.round((currentXP / needed) * 100)) : 100;

  return { level, currentXP, nextLevelXP: needed, progress };
}

/**
 * Truncates a string to a maximum length and appends an ellipsis if truncated.
 *
 * @param {string} str - The input string.
 * @param {number} [maxLength=80] - Maximum allowed character length.
 * @returns {string} The (possibly truncated) string.
 */
export function truncate(str, maxLength = 80) {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The input string.
 * @returns {string} Capitalized string.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a Date object or timestamp into a short readable date string.
 *
 * @param {Date|number|string} date - The date to format.
 * @returns {string} Formatted date (e.g., "Jul 8, 2026").
 */
export function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Returns a color token string corresponding to a problem difficulty label.
 *
 * @param {string} difficulty - 'Easy' | 'Medium' | 'Hard'.
 * @returns {string} CSS color value.
 */
export function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case DIFFICULTY.EASY:
      return '#22c55e';
    case DIFFICULTY.MEDIUM:
      return '#f59e0b';
    case DIFFICULTY.HARD:
      return '#ef4444';
    default:
      return '#94a3b8';
  }
}

/**
 * Generates a random ID string suitable for temporary entity IDs.
 *
 * @param {number} [length=8] - Desired character length of the ID.
 * @returns {string} A random alphanumeric ID.
 */
export function generateId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Deep-clones a JSON-serializable object.
 *
 * @template T
 * @param {T} obj - The object to clone.
 * @returns {T} A deep clone of the object.
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Groups an array of objects by the value of a given key.
 *
 * @template T
 * @param {T[]} arr - The array to group.
 * @param {keyof T} key - The property key to group by.
 * @returns {Object.<string, T[]>} Object with grouped arrays.
 *
 * @example
 * groupBy(problems, 'topic'); // { Arrays: [...], Strings: [...] }
 */
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = String(item[key] ?? 'Other');
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

/**
 * Debounces a function call by a specified delay.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
