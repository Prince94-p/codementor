// src/utils/codeAnalyzer.js
// Static code analysis utilities for detecting patterns, complexity, and issues

/**
 * @typedef {Object} AnalysisResult
 * @property {string} complexity - Big-O time complexity estimate (e.g. 'O(n²)').
 * @property {string} spaceComplexity - Big-O space complexity estimate.
 * @property {string[]} warnings - List of detected code smell warnings.
 * @property {string[]} suggestions - Improvement suggestions.
 * @property {number} linesOfCode - Non-empty, non-comment line count.
 * @property {number} cyclomaticComplexity - Estimated cyclomatic complexity score.
 * @property {boolean} hasNestedLoops - Whether nested loops were detected.
 * @property {boolean} hasRecursion - Whether recursive calls were detected.
 */

/**
 * Counts lines of code excluding blank lines and single-line comments.
 *
 * @param {string} code - Source code string.
 * @returns {number} Effective lines of code.
 */
export function countLinesOfCode(code) {
  return code
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('#');
    }).length;
}

/**
 * Estimates cyclomatic complexity by counting decision branch keywords.
 * This is a heuristic approximation, not a true static analysis.
 *
 * @param {string} code - Source code string.
 * @returns {number} Estimated cyclomatic complexity (minimum 1).
 */
export function estimateCyclomaticComplexity(code) {
  const branchPatterns = [
    /\bif\b/g,
    /\belse\s+if\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\b\?\s*:/g,   // ternary
    /&&|\|\|/g,    // logical branches
  ];

  let count = 1; // base complexity
  branchPatterns.forEach((pattern) => {
    const matches = code.match(pattern);
    if (matches) count += matches.length;
  });

  return count;
}

/**
 * Detects whether the code contains nested loops (O(n²) or worse pattern).
 *
 * @param {string} code - Source code string.
 * @returns {boolean} True if nested loops are found.
 */
export function detectNestedLoops(code) {
  // Look for a for/while inside another for/while block (simplified heuristic)
  const loopInLoopPattern = /for\s*\([^)]*\)[^{]*\{[^}]*(for|while)\s*\(/s;
  const whileInLoopPattern = /while\s*\([^)]*\)[^{]*\{[^}]*(for|while)\s*\(/s;
  return loopInLoopPattern.test(code) || whileInLoopPattern.test(code);
}

/**
 * Detects whether the function calls itself (recursion).
 *
 * @param {string} code - Source code string.
 * @param {string} [functionName] - Optional function name to check against.
 * @returns {boolean} True if recursion is detected.
 */
export function detectRecursion(code, functionName) {
  if (functionName) {
    // Check if the named function appears in its own body
    const bodyPattern = new RegExp(`function\\s+${functionName}[^{]*\\{([\\s\\S]*?)\\}`, 'm');
    const match = code.match(bodyPattern);
    if (match && match[1].includes(functionName + '(')) return true;
  }
  // Generic: any function call that matches a function definition name in the file
  const funcNames = [...code.matchAll(/function\s+(\w+)/g)].map((m) => m[1]);
  return funcNames.some((name) => {
    const callsItself = new RegExp(`\\b${name}\\s*\\(`);
    const bodyAfterDecl = code.split(`function ${name}`).slice(1).join('');
    return callsItself.test(bodyAfterDecl);
  });
}

/**
 * Estimates Big-O time complexity based on detected loop nesting and patterns.
 *
 * @param {string} code - Source code string.
 * @returns {{ time: string, space: string }} Estimated time and space complexity.
 */
export function estimateComplexity(code) {
  const hasNestedLoops = detectNestedLoops(code);
  const hasRecursion = detectRecursion(code);
  const hasSort = /\.sort\s*\(/.test(code);
  const hasHashMap = /new\s+Map\s*\(|new\s+Set\s*\(|\{\s*\}/.test(code);
  const loopCount = (code.match(/\b(for|while)\b/g) || []).length;

  let time = 'O(1)';
  let space = 'O(1)';

  if (loopCount === 0 && !hasRecursion) {
    time = 'O(1)';
  } else if (hasNestedLoops) {
    time = 'O(n²)';
    space = hasHashMap ? 'O(n)' : 'O(1)';
  } else if (hasSort) {
    time = 'O(n log n)';
    space = 'O(log n)';
  } else if (loopCount >= 1 || hasRecursion) {
    time = 'O(n)';
    space = hasHashMap ? 'O(n)' : hasRecursion ? 'O(n)' : 'O(1)';
  }

  return { time, space };
}

/**
 * Detects common code smells and anti-patterns in JavaScript code.
 *
 * @param {string} code - Source code string.
 * @returns {{ warnings: string[], suggestions: string[] }} Lists of warnings and suggestions.
 */
export function detectCodeSmells(code) {
  const warnings = [];
  const suggestions = [];

  // Nested loops
  if (detectNestedLoops(code)) {
    warnings.push('⚠️  Nested loops detected — likely O(n²) time complexity.');
    suggestions.push('💡 Consider using a hash map to reduce time complexity to O(n).');
  }

  // var usage
  if (/\bvar\b/.test(code)) {
    warnings.push('⚠️  `var` keyword detected — prefer `const` or `let` for block scoping.');
    suggestions.push('💡 Replace `var` with `const` (for values that don\'t change) or `let`.');
  }

  // == instead of ===
  if (/[^=!<>]==[^=]/.test(code)) {
    warnings.push('⚠️  Loose equality `==` detected — use strict `===` instead.');
  }

  // console.log left in
  if (/console\.(log|warn|error)/.test(code)) {
    suggestions.push('💡 Remove `console.log` statements before production submission.');
  }

  // Long functions (>30 lines)
  const funcBodies = code.match(/function[^{]*\{[\s\S]*?\}/g) || [];
  funcBodies.forEach((body) => {
    const lineCount = body.split('\n').length;
    if (lineCount > 30) {
      warnings.push(`⚠️  Long function detected (${lineCount} lines). Consider refactoring.`);
    }
  });

  // Missing return statement in non-void function
  if (/function/.test(code) && !/\breturn\b/.test(code)) {
    warnings.push('⚠️  Function detected with no `return` statement.');
  }

  // Empty catch block
  if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(code)) {
    warnings.push('⚠️  Empty `catch` block — errors are being silently swallowed.');
    suggestions.push('💡 Log or handle errors in catch blocks rather than ignoring them.');
  }

  return { warnings, suggestions };
}

/**
 * Runs the full static analysis pipeline on a code string.
 *
 * @param {string} code - Source code to analyze.
 * @param {string} [language='javascript'] - Programming language identifier.
 * @returns {AnalysisResult} Combined static analysis result.
 */
export function analyzeCode(code, language = 'javascript') {
  if (!code || !code.trim()) {
    return {
      complexity: 'N/A',
      spaceComplexity: 'N/A',
      warnings: [],
      suggestions: ['💡 Start coding to see analysis results.'],
      linesOfCode: 0,
      cyclomaticComplexity: 1,
      hasNestedLoops: false,
      hasRecursion: false,
    };
  }

  const { time, space } = estimateComplexity(code);
  const { warnings, suggestions } = language === 'javascript'
    ? detectCodeSmells(code)
    : { warnings: [], suggestions: [`💡 Static analysis for ${language} is coming soon.`] };

  return {
    complexity: time,
    spaceComplexity: space,
    warnings,
    suggestions,
    linesOfCode: countLinesOfCode(code),
    cyclomaticComplexity: estimateCyclomaticComplexity(code),
    hasNestedLoops: detectNestedLoops(code),
    hasRecursion: detectRecursion(code),
  };
}
