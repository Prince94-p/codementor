// src/components/AIProblemGenerator.jsx
import React, { useState } from 'react';
import { Sparkles, X, RefreshCw, BookmarkPlus, ChevronDown } from 'lucide-react';
import { addSavedProblem } from '../data/userProfile';
import { useAuth } from '../auth/AuthContext';

const TOPICS = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Sorting', 'Recursion', 'Hash Maps', 'Graphs', 'Math'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const PROBLEM_TEMPLATES = {
  Arrays: {
    Easy: {
      title: 'Find the Maximum Element',
      description: 'Given an array of integers, find and return the maximum value in the array.',
      examples: ['Input: [3, 1, 7, 2, 5] → Output: 7', 'Input: [-4, -1, -9] → Output: -1'],
      constraints: ['1 ≤ nums.length ≤ 1000', '-10000 ≤ nums[i] ≤ 10000'],
      hints: ['Hint 1: Start with the first element as max.', 'Hint 2: Loop through each element and compare.', 'Hint 3: Use a variable to track the current max and update it.'],
      starterCode: { javascript: 'function findMax(nums) {\n  // Your code here\n}', python: 'def find_max(nums):\n    # Your code here\n    pass' },
      testCases: ['findMax([3,1,7,2,5]) === 7', 'findMax([-4,-1,-9]) === -1'],
    },
    Medium: {
      title: 'Rotate Array by K Steps',
      description: 'Given an array, rotate it to the right by k steps, where k is non-negative.',
      examples: ['Input: [1,2,3,4,5,6,7], k=3 → Output: [5,6,7,1,2,3,4]'],
      constraints: ['1 ≤ nums.length ≤ 10^5', '0 ≤ k ≤ 10^5'],
      hints: ['Hint 1: k % nums.length gives the effective rotation.', 'Hint 2: Reversing subarrays works in O(n) time.', 'Hint 3: Reverse all, then reverse first k, then reverse rest.'],
      starterCode: { javascript: 'function rotate(nums, k) {\n  // Your code here\n}', python: 'def rotate(nums, k):\n    # Your code here\n    pass' },
      testCases: ['rotate([1,2,3,4,5,6,7], 3) → [5,6,7,1,2,3,4]'],
    },
    Hard: {
      title: 'Trapping Rain Water',
      description: 'Given an elevation map, compute how much water it can trap after raining.',
      examples: ['Input: [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6'],
      constraints: ['n ≤ 20000', '0 ≤ height[i] ≤ 100000'],
      hints: ['Hint 1: For each bar, water = min(maxLeft, maxRight) - height.', 'Hint 2: Precompute left and right max arrays.', 'Hint 3: Two-pointer approach achieves O(1) space.'],
      starterCode: { javascript: 'function trap(height) {\n  // Your code here\n}', python: 'def trap(height):\n    # Your code here\n    pass' },
      testCases: ['trap([0,1,0,2,1,0,1,3,2,1,2,1]) === 6'],
    },
  },
  Strings: {
    Easy: {
      title: 'Check Palindrome',
      description: 'Given a string, return true if it reads the same forwards and backwards.',
      examples: ['Input: "racecar" → Output: true', 'Input: "hello" → Output: false'],
      constraints: ['1 ≤ s.length ≤ 1000', 's contains only lowercase letters'],
      hints: ['Hint 1: Compare the string to its reverse.', 'Hint 2: Two-pointer approach: check from both ends.', 'Hint 3: Loop while left < right, comparing characters.'],
      starterCode: { javascript: 'function isPalindrome(s) {\n  // Your code here\n}', python: 'def is_palindrome(s):\n    # Your code here\n    pass' },
      testCases: ['isPalindrome("racecar") === true', 'isPalindrome("hello") === false'],
    },
    Medium: {
      title: 'Longest Substring Without Repeating Characters',
      description: 'Find the length of the longest substring without repeating characters.',
      examples: ['Input: "abcabcbb" → Output: 3 ("abc")', 'Input: "bbbbb" → Output: 1'],
      constraints: ['0 ≤ s.length ≤ 5 * 10^4'],
      hints: ['Hint 1: Use a sliding window approach.', 'Hint 2: Track characters in a Set or Map.', 'Hint 3: Expand right pointer, shrink left on duplicates.'],
      starterCode: { javascript: 'function lengthOfLongestSubstring(s) {\n  // Your code here\n}', python: 'def length_of_longest_substring(s):\n    # Your code here\n    pass' },
      testCases: ['lengthOfLongestSubstring("abcabcbb") === 3'],
    },
    Hard: {
      title: 'Minimum Window Substring',
      description: 'Find the minimum window in string s that contains all characters of string t.',
      examples: ['Input: s="ADOBECODEBANC", t="ABC" → Output: "BANC"'],
      constraints: ['1 ≤ s.length, t.length ≤ 10^5'],
      hints: ['Hint 1: Sliding window with two pointers.', 'Hint 2: Use frequency maps for both strings.', 'Hint 3: Track how many required chars are satisfied.'],
      starterCode: { javascript: 'function minWindow(s, t) {\n  // Your code here\n}', python: 'def min_window(s, t):\n    # Your code here\n    pass' },
      testCases: ['minWindow("ADOBECODEBANC","ABC") === "BANC"'],
    },
  },
  'Dynamic Programming': {
    Easy: {
      title: 'Climbing Stairs',
      description: 'You can climb 1 or 2 steps at a time. In how many distinct ways can you reach step n?',
      examples: ['Input: n=3 → Output: 3', 'Input: n=4 → Output: 5'],
      constraints: ['1 ≤ n ≤ 45'],
      hints: ['Hint 1: Think about Fibonacci.', 'Hint 2: ways(n) = ways(n-1) + ways(n-2).', 'Hint 3: Base cases: ways(1)=1, ways(2)=2.'],
      starterCode: { javascript: 'function climbStairs(n) {\n  // Your code here\n}', python: 'def climb_stairs(n):\n    # Your code here\n    pass' },
      testCases: ['climbStairs(3) === 3', 'climbStairs(4) === 5'],
    },
    Medium: {
      title: 'Coin Change',
      description: 'Given coin denominations and a target amount, return the fewest coins needed.',
      examples: ['Input: coins=[1,5,11], amount=15 → Output: 3'],
      constraints: ['1 ≤ coins.length ≤ 12', '0 ≤ amount ≤ 10^4'],
      hints: ['Hint 1: Build solution bottom-up.', 'Hint 2: dp[i] = min coins to make amount i.', 'Hint 3: dp[i] = min(dp[i], dp[i-coin]+1) for each coin.'],
      starterCode: { javascript: 'function coinChange(coins, amount) {\n  // Your code here\n}', python: 'def coin_change(coins, amount):\n    # Your code here\n    pass' },
      testCases: ['coinChange([1,5,11], 15) === 3'],
    },
    Hard: {
      title: 'Longest Increasing Subsequence',
      description: 'Return the length of the longest strictly increasing subsequence.',
      examples: ['Input: [10,9,2,5,3,7,101,18] → Output: 4'],
      constraints: ['1 ≤ nums.length ≤ 2500'],
      hints: ['Hint 1: Classic O(n²) DP is a starting point.', 'Hint 2: dp[i] = max LIS ending at index i.', 'Hint 3: Binary search with patience sorting gives O(n log n).'],
      starterCode: { javascript: 'function lengthOfLIS(nums) {\n  // Your code here\n}', python: 'def length_of_lis(nums):\n    # Your code here\n    pass' },
      testCases: ['lengthOfLIS([10,9,2,5,3,7,101,18]) === 4'],
    },
  },
  Recursion: {
    Easy: {
      title: 'Factorial',
      description: 'Compute n! recursively (the product of all positive integers up to n).',
      examples: ['Input: 5 → Output: 120', 'Input: 0 → Output: 1'],
      constraints: ['0 ≤ n ≤ 12'],
      hints: ['Hint 1: Base case: factorial(0) = 1.', 'Hint 2: Recursive case: n * factorial(n-1).', 'Hint 3: Watch out for stack overflow on large n.'],
      starterCode: { javascript: 'function factorial(n) {\n  // Your code here\n}', python: 'def factorial(n):\n    # Your code here\n    pass' },
      testCases: ['factorial(5) === 120', 'factorial(0) === 1'],
    },
    Medium: {
      title: 'Generate Parentheses',
      description: 'Generate all combinations of well-formed parentheses for n pairs.',
      examples: ['Input: n=2 → Output: ["(())", "()()"]'],
      constraints: ['1 ≤ n ≤ 8'],
      hints: ['Hint 1: Use backtracking.', 'Hint 2: Track open and close counts.', 'Hint 3: Add "(" if open < n, add ")" if close < open.'],
      starterCode: { javascript: 'function generateParenthesis(n) {\n  // Your code here\n}', python: 'def generate_parenthesis(n):\n    # Your code here\n    pass' },
      testCases: ['generateParenthesis(2).length === 2'],
    },
    Hard: {
      title: 'N-Queens',
      description: 'Place n queens on an n×n board so no two queens attack each other.',
      examples: ['Input: n=4 → Output: 2 (solutions)'],
      constraints: ['1 ≤ n ≤ 9'],
      hints: ['Hint 1: Place one queen per row using backtracking.', 'Hint 2: Track columns and diagonals under attack.', 'Hint 3: Use sets for O(1) conflict checking.'],
      starterCode: { javascript: 'function solveNQueens(n) {\n  // Your code here\n}', python: 'def solve_n_queens(n):\n    # Your code here\n    pass' },
      testCases: ['solveNQueens(4).length === 2'],
    },
  },
};

// Fallback generic template
function getGenericTemplate(topic, difficulty) {
  return {
    title: `${difficulty} ${topic} Challenge`,
    description: `Solve this ${difficulty.toLowerCase()} ${topic.toLowerCase()} problem. Analyze the input and produce the correct output efficiently.`,
    examples: ['Input: [example] → Output: [result]'],
    constraints: ['Read the problem carefully', 'Optimize for time and space'],
    hints: [
      `Hint 1: Break the problem into smaller steps.`,
      `Hint 2: Think about what data structure fits ${topic} problems best.`,
      `Hint 3: Consider edge cases like empty inputs and single elements.`,
    ],
    starterCode: {
      javascript: `// ${difficulty} ${topic} Problem\nfunction solve(input) {\n  // Your code here\n}`,
      python: `# ${difficulty} ${topic} Problem\ndef solve(input):\n    # Your code here\n    pass`,
    },
    testCases: ['Test your function with provided examples'],
  };
}

function generateProblem(topic, difficulty, language) {
  const topicTemplates = PROBLEM_TEMPLATES[topic];
  const template = topicTemplates?.[difficulty] || getGenericTemplate(topic, difficulty);
  return {
    id: `ai_${topic.toLowerCase().replace(/\s/g, '_')}_${difficulty.toLowerCase()}_${Date.now()}`,
    title: template.title,
    description: template.description,
    topic,
    difficulty,
    examples: template.examples,
    constraints: template.constraints,
    hints: template.hints,
    starterCode: template.starterCode[language] || template.starterCode.javascript,
    testCases: template.testCases,
    isAIGenerated: true,
    generatedAt: new Date().toISOString(),
  };
}

const DIFF_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

export default function AIProblemGenerator({ onLoadProblem, language, onClose, isInline, onNavigate }) {
  const { user } = useAuth();
  const [topic, setTopic] = useState('Arrays');
  const [difficulty, setDifficulty] = useState('Easy');
  const [generated, setGenerated] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setSaved(false);
    await new Promise(r => setTimeout(r, 900));
    const prob = generateProblem(topic, difficulty, language);
    setGenerated(prob);
    setGenerating(false);
  };

  const handleSave = () => {
    if (!generated || !user) return;
    addSavedProblem(user.email, {
      ...generated,
      savedAt: new Date().toISOString(),
    });
    setSaved(true);
  };

  const handleLoad = () => {
    if (!generated) return;
    onLoadProblem(generated);
    if (onNavigate) {
      onNavigate('playground');
    } else if (onClose) {
      onClose();
    }
  };

  const renderContent = () => (
    <div style={{
      width: isInline ? '100%' : '680px',
      maxHeight: isInline ? '100%' : '85vh',
      height: isInline ? '100%' : 'auto',
      background: 'rgba(15,23,42,0.95)',
      border: isInline ? 'none' : '1px solid rgba(255,255,255,0.1)',
      borderRadius: isInline ? '0' : '20px',
      overflow: 'hidden',
      boxShadow: isInline ? 'none' : '0 30px 80px rgba(0,0,0,0.6)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '8px', borderRadius: '10px', display: 'flex',
          }}>
            <Sparkles size={18} style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>AI Problem Generator</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Creates custom coding challenges instantly</div>
          </div>
        </div>
        {!isInline && onClose && (
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', color: 'var(--text-secondary)',
          }}>
            <X size={16} />
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {/* Config Row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>📚 Topic</label>
            <div style={{ position: 'relative' }}>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                    padding: '10px 32px 10px 12px', color: 'var(--text-primary)',
                    fontSize: '0.88rem', outline: 'none', appearance: 'none', cursor: 'pointer',
                  }}
                >
                  {TOPICS.map(t => <option key={t} value={t} style={{ background: '#1e293b' }}>{t}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>🎯 Difficulty</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {DIFFICULTIES.map(d => (
                  <button key={d} onClick={() => setDifficulty(d)} style={{
                    flex: 1, padding: '8px 4px', borderRadius: '8px', fontSize: '0.78rem',
                    fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                    background: difficulty === d ? `${DIFF_COLORS[d]}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${difficulty === d ? DIFF_COLORS[d] : 'rgba(255,255,255,0.1)'}`,
                    color: difficulty === d ? DIFF_COLORS[d] : 'var(--text-secondary)',
                  }}>{d}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={handleGenerate} disabled={generating} id="generate-problem-btn" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: generating ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                border: 'none', borderRadius: '10px', padding: '10px 20px',
                color: 'white', fontWeight: '600', fontSize: '0.88rem', cursor: generating ? 'not-allowed' : 'pointer',
                boxShadow: generating ? 'none' : '0 4px 15px rgba(99,102,241,0.35)',
              }}>
                <RefreshCw size={15} style={{ animation: generating ? 'spin 0.8s linear infinite' : 'none' }} />
                {generating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          {/* Generated Problem */}
          {generating && (
            <div style={{
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '14px', padding: '40px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🤖</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>AI is crafting your problem...</div>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '16px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: 'var(--primary)',
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {generated && !generating && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Title bar */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px', padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{
                    background: `${DIFF_COLORS[generated.difficulty]}22`,
                    color: DIFF_COLORS[generated.difficulty],
                    border: `1px solid ${DIFF_COLORS[generated.difficulty]}44`,
                    padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700',
                  }}>{generated.difficulty}</span>
                  <span style={{
                    background: 'rgba(99,102,241,0.15)', color: 'var(--primary)',
                    padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem',
                  }}>{generated.topic}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>✨ AI Generated</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 8px' }}>{generated.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>{generated.description}</p>
              </div>

              {/* Examples */}
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '14px 18px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Examples</div>
                {generated.examples.map((ex, i) => (
                  <code key={i} style={{ display: 'block', fontSize: '0.82rem', color: '#7dd3fc', fontFamily: 'monospace', marginBottom: '4px' }}>{ex}</code>
                ))}
              </div>

              {/* Hints Preview */}
              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '12px', padding: '14px 18px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>💡 3 Progressive Hints Included</div>
                {generated.hints.map((h, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{h}</div>
                ))}
              </div>

              {/* Starter Code preview */}
              <div style={{ background: '#0d1117', borderRadius: '12px', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starter Code</div>
                <pre style={{ margin: 0, fontSize: '0.82rem', color: '#a5f3fc', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{generated.starterCode}</pre>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSave} disabled={saved} id="save-problem-btn" style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: saved ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.12)',
                  border: `1px solid ${saved ? 'rgba(34,197,94,0.4)' : 'rgba(99,102,241,0.3)'}`,
                  borderRadius: '10px', padding: '11px', cursor: saved ? 'default' : 'pointer',
                  color: saved ? '#22c55e' : 'var(--primary)', fontWeight: '600', fontSize: '0.88rem',
                }}>
                  <BookmarkPlus size={15} />
                  {saved ? '✓ Saved to Profile' : 'Save to My Profile'}
                </button>
                <button onClick={handleLoad} id="load-problem-btn" style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  border: 'none', borderRadius: '10px', padding: '11px', cursor: 'pointer',
                  color: 'white', fontWeight: '600', fontSize: '0.88rem',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                }}>
                  🚀 Load in Editor
                </button>
              </div>
            </div>
          )}

          {!generated && !generating && (
            <div style={{
              background: 'rgba(99,102,241,0.05)', border: '2px dashed rgba(99,102,241,0.2)',
              borderRadius: '14px', padding: '48px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✨</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Select a topic and difficulty above,<br />then click <strong style={{ color: 'var(--primary)' }}>Generate</strong> to create a custom problem.
              </div>
            </div>
          )}
      </div>
    </div>
  );

  if (isInline) {
    return (
      <div style={{ height: '100%', overflow: 'hidden', padding: '24px' }}>
        {renderContent()}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {renderContent()}
    </div>
  );
}
