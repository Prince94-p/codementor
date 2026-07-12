// src/hooks/useTimer.js
// Custom hook for a start/pause/reset countdown and stopwatch timer

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDuration } from '../utils/helpers';

/**
 * @typedef {Object} TimerState
 * @property {number} elapsed - Elapsed milliseconds since timer started.
 * @property {string} formatted - Human-readable elapsed time string (e.g. "2m 30s").
 * @property {boolean} isRunning - Whether the timer is currently active.
 * @property {Function} start - Start or resume the timer.
 * @property {Function} pause - Pause the timer.
 * @property {Function} reset - Reset elapsed time to zero and stop.
 * @property {Function} toggle - Toggle between running and paused states.
 */

/**
 * Custom React hook providing a precise stopwatch/timer built on
 * `performance.now()` to avoid drift from `setInterval` alone.
 *
 * The timer accumulates elapsed milliseconds and provides formatted output.
 * Automatically cleans up the interval on unmount.
 *
 * @param {boolean} [autoStart=false] - If true, the timer starts immediately on mount.
 * @returns {TimerState} Timer state and control functions.
 *
 * @example
 * const { formatted, isRunning, start, pause, reset } = useTimer(true);
 * // formatted => "0s", "1m 30s", etc.
 */
export function useTimer(autoStart = false) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const startTimeRef = useRef(null);
  const accumulatedRef = useRef(0);
  const intervalRef = useRef(null);

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  /**
   * Starts or resumes the timer from the current elapsed time.
   */
  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = performance.now();
    setIsRunning(true);
  }, [isRunning]);

  /**
   * Pauses the timer, preserving the accumulated elapsed time.
   */
  const pause = useCallback(() => {
    if (!isRunning) return;
    accumulatedRef.current += performance.now() - (startTimeRef.current ?? performance.now());
    clearTick();
    setIsRunning(false);
  }, [isRunning]);

  /**
   * Resets the timer to zero and stops it.
   */
  const reset = useCallback(() => {
    clearTick();
    accumulatedRef.current = 0;
    startTimeRef.current = null;
    setElapsed(0);
    setIsRunning(false);
  }, []);

  /**
   * Toggles between running and paused states.
   */
  const toggle = useCallback(() => {
    if (isRunning) pause();
    else start();
  }, [isRunning, pause, start]);

  // Tick interval: updates elapsed every 500ms while running
  useEffect(() => {
    if (!isRunning) return;
    startTimeRef.current = startTimeRef.current ?? performance.now();
    intervalRef.current = setInterval(() => {
      const now = performance.now();
      const total = accumulatedRef.current + (now - (startTimeRef.current ?? now));
      setElapsed(Math.floor(total));
    }, 500);
    return () => clearTick();
  }, [isRunning]);

  return {
    elapsed,
    formatted: formatDuration(elapsed),
    isRunning,
    start,
    pause,
    reset,
    toggle,
  };
}
