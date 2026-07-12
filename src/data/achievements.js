// src/data/achievements.js
// Achievement definitions and unlock logic for the CodeMentor gamification system

import { DIFFICULTY } from '../utils/constants';

/**
 * @typedef {Object} Achievement
 * @property {string} id - Unique achievement identifier.
 * @property {string} title - Display name of the achievement.
 * @property {string} description - Description of how to unlock it.
 * @property {string} icon - Emoji icon representing the achievement.
 * @property {string} category - Category group ('progress'|'skill'|'speed'|'streak'|'social').
 * @property {number} xpReward - XP awarded when unlocked.
 * @property {Function} check - Predicate that returns true when the achievement is earned.
 */

/**
 * Complete list of achievements available in CodeMentor.
 * Each entry defines display metadata and a `check(stats)` predicate that
 * evaluates the current user stats object and returns true when earned.
 *
 * @type {Achievement[]}
 */
export const ACHIEVEMENTS = [
  // ── Progress ──────────────────────────────────────────────
  {
    id: 'first_solve',
    title: 'First Blood',
    description: 'Solve your first coding problem.',
    icon: '🎯',
    category: 'progress',
    xpReward: 20,
    check: (stats) => stats.totalSolved >= 1,
  },
  {
    id: 'five_solved',
    title: 'Getting Started',
    description: 'Solve 5 coding problems.',
    icon: '🌱',
    category: 'progress',
    xpReward: 50,
    check: (stats) => stats.totalSolved >= 5,
  },
  {
    id: 'ten_solved',
    title: 'Problem Crusher',
    description: 'Solve 10 coding problems.',
    icon: '💪',
    category: 'progress',
    xpReward: 100,
    check: (stats) => stats.totalSolved >= 10,
  },
  {
    id: 'twenty_five_solved',
    title: 'Grinder',
    description: 'Solve 25 coding problems.',
    icon: '🔥',
    category: 'progress',
    xpReward: 250,
    check: (stats) => stats.totalSolved >= 25,
  },
  {
    id: 'fifty_solved',
    title: 'Century Club',
    description: 'Solve 50 coding problems.',
    icon: '🏆',
    category: 'progress',
    xpReward: 500,
    check: (stats) => stats.totalSolved >= 50,
  },

  // ── Skill ─────────────────────────────────────────────────
  {
    id: 'first_hard',
    title: 'Hard Mode Activated',
    description: 'Solve your first Hard difficulty problem.',
    icon: '💎',
    category: 'skill',
    xpReward: 75,
    check: (stats) => stats.hardSolved >= 1,
  },
  {
    id: 'five_hard',
    title: 'Elite Coder',
    description: 'Solve 5 Hard problems.',
    icon: '🚀',
    category: 'skill',
    xpReward: 200,
    check: (stats) => stats.hardSolved >= 5,
  },
  {
    id: 'all_easy',
    title: 'Warmup Done',
    description: 'Complete all Easy problems.',
    icon: '✅',
    category: 'skill',
    xpReward: 60,
    check: (stats) => stats.easySolved >= stats.totalEasy && stats.totalEasy > 0,
  },
  {
    id: 'polyglot',
    title: 'Polyglot',
    description: 'Submit solutions in 3 different languages.',
    icon: '🌐',
    category: 'skill',
    xpReward: 150,
    check: (stats) => (stats.languagesUsed?.size ?? 0) >= 3,
  },
  {
    id: 'no_hints',
    title: 'Solo Flyer',
    description: 'Solve a problem without using any hints.',
    icon: '🦅',
    category: 'skill',
    xpReward: 40,
    check: (stats) => stats.solvedWithoutHints >= 1,
  },

  // ── Speed ─────────────────────────────────────────────────
  {
    id: 'speed_easy',
    title: 'Quick Draw',
    description: 'Solve an Easy problem in under 5 minutes.',
    icon: '⚡',
    category: 'speed',
    xpReward: 30,
    check: (stats) => stats.fastestSolveMs > 0 && stats.fastestSolveMs <= 5 * 60 * 1000,
  },
  {
    id: 'speed_medium',
    title: 'Race Mode',
    description: 'Solve a Medium problem in under 10 minutes.',
    icon: '🏎️',
    category: 'speed',
    xpReward: 60,
    check: (stats) =>
      stats.fastestMediumSolveMs > 0 && stats.fastestMediumSolveMs <= 10 * 60 * 1000,
  },

  // ── Streak ────────────────────────────────────────────────
  {
    id: 'streak_3',
    title: 'On a Roll',
    description: 'Maintain a 3-day coding streak.',
    icon: '🌟',
    category: 'streak',
    xpReward: 30,
    check: (stats) => stats.streak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day coding streak.',
    icon: '📅',
    category: 'streak',
    xpReward: 70,
    check: (stats) => stats.streak >= 7,
  },
  {
    id: 'streak_30',
    title: 'Dedicated Dev',
    description: 'Maintain a 30-day coding streak.',
    icon: '🔱',
    category: 'streak',
    xpReward: 300,
    check: (stats) => stats.streak >= 30,
  },

  // ── Social ────────────────────────────────────────────────
  {
    id: 'first_ai_problem',
    title: 'AI Explorer',
    description: 'Generate and solve an AI-crafted problem.',
    icon: '🤖',
    category: 'social',
    xpReward: 45,
    check: (stats) => stats.aiProblemsSolved >= 1,
  },
  {
    id: 'saved_five',
    title: 'Collector',
    description: 'Save 5 problems for later review.',
    icon: '📚',
    category: 'social',
    xpReward: 25,
    check: (stats) => stats.savedCount >= 5,
  },
];

/**
 * Evaluates which achievements have been newly unlocked by comparing
 * a list of already-earned IDs against the current stats.
 *
 * @param {Object} stats - Current user stats object.
 * @param {string[]} [earnedIds=[]] - Achievement IDs the user has already earned.
 * @returns {Achievement[]} Newly unlocked achievements (not in earnedIds).
 */
export function checkNewAchievements(stats, earnedIds = []) {
  return ACHIEVEMENTS.filter(
    (a) => !earnedIds.includes(a.id) && a.check(stats)
  );
}

/**
 * Returns the full Achievement object for a given ID.
 *
 * @param {string} id - Achievement ID.
 * @returns {Achievement|undefined} Matching achievement or undefined.
 */
export function getAchievementById(id) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * Groups achievements by their category.
 *
 * @returns {Object.<string, Achievement[]>} Achievements grouped by category.
 */
export function getAchievementsByCategory() {
  return ACHIEVEMENTS.reduce((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});
}
