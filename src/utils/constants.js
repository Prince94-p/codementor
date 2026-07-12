// src/utils/constants.js
// App-wide constants and configuration values

/**
 * Supported programming language identifiers used across the app.
 * @type {string[]}
 */
export const SUPPORTED_LANGUAGES = ['javascript', 'python', 'cpp', 'java'];

/**
 * Problem difficulty levels.
 * @enum {string}
 */
export const DIFFICULTY = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

/**
 * Problem topic categories.
 * @type {string[]}
 */
export const TOPICS = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Sorting',
  'Searching',
  'Hash Maps',
  'Two Pointers',
  'Sliding Window',
  'Recursion',
  'Backtracking',
  'Greedy',
  'Math',
];

/**
 * Agent tab identifiers used in the AgentPanel.
 * @enum {string}
 */
export const AGENT_TABS = {
  ANALYZER: 'analyzer',
  HINTS: 'hints',
  REVIEWER: 'reviewer',
  COMPLEXITY: 'complexity',
  TEACHER: 'teacher',
  TESTCASES: 'testcases',
  SOLUTION: 'solution',
  PLAGIARISM: 'plagiarism',
  COACH: 'coach',
};

/**
 * Console log type identifiers.
 * @enum {string}
 */
export const LOG_TYPES = {
  SYSTEM: 'system',
  COMPILE: 'compile',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
};

/**
 * Maximum number of hints that can be unlocked per problem.
 * @type {number}
 */
export const MAX_HINTS = 3;

/**
 * LocalStorage key prefix for all CodeMentor data.
 * @type {string}
 */
export const LS_PREFIX = 'codementor_';

/**
 * LocalStorage key for the authentication session.
 * @type {string}
 */
export const LS_SESSION_KEY = `${LS_PREFIX}session`;

/**
 * Application display name.
 * @type {string}
 */
export const APP_NAME = 'CodeMentor';

/**
 * Delay (ms) used for simulating compile/run operations.
 * @type {number}
 */
export const COMPILE_DELAY_MS = 900;

/**
 * Points awarded for completing a problem by difficulty.
 * @type {Object.<string, number>}
 */
export const XP_BY_DIFFICULTY = {
  [DIFFICULTY.EASY]: 10,
  [DIFFICULTY.MEDIUM]: 25,
  [DIFFICULTY.HARD]: 50,
};

/**
 * Theme options available in Settings.
 * @type {string[]}
 */
export const THEMES = ['dark', 'light', 'midnight'];

/**
 * Font size options for the code editor.
 * @type {number[]}
 */
export const EDITOR_FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];
