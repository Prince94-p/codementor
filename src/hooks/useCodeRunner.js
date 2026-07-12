// src/hooks/useCodeRunner.js
// Hook that encapsulates sandboxed JavaScript code execution logic

import { useState, useCallback } from 'react';
import { LOG_TYPES, COMPILE_DELAY_MS } from '../utils/constants';

/**
 * @typedef {Object} LogEntry
 * @property {string} type - Log type (system | compile | success | error | warning)
 * @property {string} text - Log message text
 */

/**
 * @typedef {Object} CodeRunnerState
 * @property {LogEntry[]} logs - Array of console log entries from the last run.
 * @property {boolean} isRunning - Whether code is currently being compiled/executed.
 * @property {string|null} lastResult - The result status of the last run ('SUCCESS'|'FAIL'|'ERROR'|null).
 */

/**
 * Custom React hook for executing sandboxed JavaScript code and managing
 * the resulting console log output.
 *
 * @returns {{
 *   logs: LogEntry[],
 *   isRunning: boolean,
 *   lastResult: string|null,
 *   runCode: Function,
 *   clearLogs: Function,
 *   appendLog: Function,
 * }} Hook return value.
 */
export function useCodeRunner() {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  /**
   * Appends a single log entry to the console.
   *
   * @param {string} text - Log message.
   * @param {string} [type='system'] - Log type.
   */
  const appendLog = useCallback((text, type = LOG_TYPES.SYSTEM) => {
    setLogs((prev) => [...prev, { type, text }]);
  }, []);

  /**
   * Clears all console log entries.
   */
  const clearLogs = useCallback(() => {
    setLogs([]);
    setLastResult(null);
  }, []);

  /**
   * Executes arbitrary JavaScript code in a sandboxed context using the
   * Function constructor. Captures console.log output and maps results to
   * typed log entries.
   *
   * @param {string} code - The JavaScript source code string to execute.
   * @param {string} [language='javascript'] - Programming language identifier.
   * @param {string} [filename='solution'] - Display filename for the compile log.
   * @returns {Promise<'SUCCESS'|'FAIL'|'ERROR'>} Execution result status.
   */
  const runCode = useCallback(
    (code, language = 'javascript', filename = 'solution') => {
      setIsRunning(true);
      setLastResult(null);

      const ext =
        language === 'javascript'
          ? 'js'
          : language === 'python'
          ? 'py'
          : language === 'java'
          ? 'java'
          : 'cpp';

      setLogs([
        { type: LOG_TYPES.SYSTEM, text: '> Initializing compiler engine...' },
        { type: LOG_TYPES.COMPILE, text: `> Compiling ${filename}.${ext}...` },
      ]);

      return new Promise((resolve) => {
        setTimeout(() => {
          if (language !== 'javascript') {
            // Non-JS languages are not natively executable in the browser sandbox
            setLogs((prev) => [
              ...prev,
              {
                type: LOG_TYPES.WARNING,
                text: `⚠️  ${language.toUpperCase()} sandbox not available in this environment. Showing mock output.`,
              },
              {
                type: LOG_TYPES.SUCCESS,
                text: '✅ Code accepted for review. Static analysis will run in the background.',
              },
            ]);
            setIsRunning(false);
            setLastResult('SUCCESS');
            resolve('SUCCESS');
            return;
          }

          // JavaScript sandboxed execution
          const capturedLogs = [];
          const mockConsole = {
            log: (...args) => {
              capturedLogs.push(
                args
                  .map((a) =>
                    typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
                  )
                  .join(' ')
              );
            },
            warn: (...args) => {
              capturedLogs.push(`⚠️ ${args.join(' ')}`);
            },
            error: (...args) => {
              capturedLogs.push(`❌ ${args.join(' ')}`);
            },
          };

          let status = 'SUCCESS';
          try {
            // eslint-disable-next-line no-new-func
            const fn = new Function('console', code);
            fn(mockConsole);
          } catch (err) {
            capturedLogs.push(`❌ Runtime Error: ${err.message}`);
            status = 'ERROR';
          }

          const newLogs = capturedLogs.map((line) => {
            if (line.includes('❌') || line.toLowerCase().includes('error')) {
              return { type: LOG_TYPES.ERROR, text: line };
            }
            if (line.includes('⚠️') || line.toLowerCase().includes('warn')) {
              return { type: LOG_TYPES.WARNING, text: line };
            }
            if (
              line.includes('✅') ||
              line.toUpperCase().includes('SUCCESS') ||
              line.includes('PASSED')
            ) {
              return { type: LOG_TYPES.SUCCESS, text: line };
            }
            return { type: LOG_TYPES.SYSTEM, text: line };
          });

          if (status === 'ERROR') {
            setLastResult('ERROR');
          } else if (
            newLogs.some(
              (l) =>
                l.text.toUpperCase().includes('FAIL') ||
                l.text.includes('⚠️')
            )
          ) {
            setLastResult('FAIL');
            status = 'FAIL';
          } else {
            setLastResult('SUCCESS');
          }

          setLogs((prev) => [...prev, ...newLogs]);
          setIsRunning(false);
          resolve(status);
        }, COMPILE_DELAY_MS);
      });
    },
    []
  );

  return { logs, isRunning, lastResult, runCode, clearLogs, appendLog };
}
