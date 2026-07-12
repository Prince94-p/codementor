// CodeMentor AI - Mock Data & Educational Knowledge Base

export const languages = [
  { id: 'javascript', name: 'JavaScript', ext: 'js' },
  { id: 'python', name: 'Python', ext: 'py' },
  { id: 'cpp', name: 'C++', ext: 'cpp' },
  { id: 'java', name: 'Java', ext: 'java' }
];

export const problems = [
  {
    id: 'two_sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.'
  },
  {
    id: 'reverse_string',
    title: 'Reverse String',
    difficulty: 'Easy',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.'
  },
  {
    id: 'valid_parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.'
  }
];

export const starterCode = {
  javascript: {
    two_sum: `function twoSum(nums, target) {
  // Write your code here
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}`,
    reverse_string: `function reverseString(s) {
  // Write your code here
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    let temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
}`,
    valid_parentheses: `function isValid(s) {
  // Write your code here
  let stack = [];
  for (let i = 0; i < s.length; i++) {
    let char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      let top = stack.pop();
      if (char === ')' && top !== '(') return false;
      if (char === '}' && top !== '{') return false;
      if (char === ']' && top !== '[') return false;
    }
  }
  return stack.length === 0;
}`
  },
  python: {
    two_sum: `def two_sum(nums, target):
    # Write your code here
    for i in range(len(nums)):
        for j in range(len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    reverse_string: `def reverse_string(s):
    # Write your code here
    # Remember: modify s in-place
    left = 0
    right = len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`,
    valid_parentheses: `def is_valid(s):
    # Write your code here
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0`
  },
  cpp: {
    two_sum: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        for (int j = 0; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}`,
    reverse_string: `#include <vector>
using namespace std;

void reverseString(vector<char>& s) {
    int left = 0;
    int right = s.size() - 1;
    while (left < right) {
        char temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        left++;
        right--;
    }
}`,
    valid_parentheses: `#include <string>
#include <stack>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return st.empty();
}`
  },
  java: {
    two_sum: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = 0; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}`,
    reverse_string: `class Solution {
    public void reverseString(char[] s) {
        int left = 0;
        int right = s.length - 1;
        while (left < right) {
            char temp = s[left];
            s[left] = s[s.length - 1 - left]; // Bug risk!
            s[right] = temp;
            left++;
            right--;
        }
    }
}`,
    valid_parentheses: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }
}`
  }
};

export const agentMockData = {
  two_sum: {
    analyzer: {
      topic: 'Arrays, Hash Map / Hash Table',
      difficulty: 'Easy',
      concepts: ['Nested Loops vs Hash Map Lookups', 'Index Tracking', 'Time vs Space Tradeoffs'],
      mistakes: [
        'Using the same index twice (e.g., matching a number with itself when nums[i] * 2 = target).',
        'Not handling cases where the target can be formed by duplicate numbers (like nums = [3, 3] and target = 6).',
        'O(N^2) brute force loops that time out on large datasets.'
      ]
    },
    hints: {
      1: '💡 **Hint 1**: Your current approach uses two loops to check every possible pair. While this works, can you find a way to check if the "complement" (i.e., `target - nums[i]`) exists without running a second loop?',
      2: '💡 **Hint 2**: Think about data structures that allow very fast lookups. If you store numbers you have already visited along with their index, how fast can you check if the complement exists? (Lookup in $O(1)$ time).',
      3: '💡 **Hint 3**: Use a **Hash Map** (or JS Object / Python Dictionary). Iterate through the array once: for each number, calculate `complement = target - num`. If `complement` is in the map, you found your answer! Otherwise, add the current number and its index to the map.'
    },
    reviewer: [
      {
        severity: 'Major',
        issue: 'Self-Matching Bug Risk',
        why: 'In nested loops, if both loops scan from index `0`, you might match an element with itself if `nums[i] + nums[i] === target` (e.g. nums=[3,2,4], target=6 might return [0,0] because nums[0] + nums[0] = 6).',
        fix: 'Ensure the inner loop starts at `i + 1` instead of `0`. This guarantees you check distinct elements and avoids redundant pair checks.',
        line: 'for (let j = 0; j < nums.length; j++)'
      },
      {
        severity: 'Minor',
        issue: 'Brute Force Time Performance',
        why: 'Nested loops check every element against every other element, resulting in $O(N^2)$ time complexity. This is extremely slow for arrays with thousands of elements.',
        fix: 'Use a hash map to remember visited numbers. This reduces the search time to $O(N)$ with a small space cost.',
        line: 'for (let i = 0; i < nums.length; i++) {\n    for (let j = 0; j < nums.length; j++) {'
      }
    ],
    complexity: {
      current: {
        time: 'O(N^2)',
        space: 'O(1)',
        reason: 'We use two nested loops, each iterating through the array of size N. The space complexity is constant because we do not allocate any additional data structures.'
      },
      optimal: {
        time: 'O(N)',
        space: 'O(N)',
        reason: 'By using a hash map to store visited elements, we can scan the array exactly once. Each hash map search takes $O(1)$ average time. Space complexity increases to $O(N)$ because the map stores up to N elements.'
      }
    },
    teacher: {
      beginner: `### Learning the Two Sum Analogy 👥
Imagine you are at a dance party where everyone has a number tag on their shirt. Your goal is to find two people whose numbers add up to **10** (our target).

**Your Current Approach (Brute Force):**
You take the first person (say, tag **3**), and you walk up to every single person in the room to ask if their number is **7** ($10 - 3$). Then, you do this for the second person, then the third. If there are 100 people, you make up to 10,000 checks!

**The Map Approach (Hash Map):**
Instead of walking around, you set up a **Guest Book** at the entrance. As each person arrives, you check the Guest Book to see if their needed partner is already written there. If they are, you found a match! If not, you write their name and number in the book and let them join the party. Each person is checked in under a second!`,
      intermediate: `### Understanding Hash Lookups
In computing, nested loops yield quadratic time $O(N^2)$ because you perform $N \\times N$ comparisons.
By introducing a **Hash Map**, we utilize a key-value store. Searching for a key in a hash map has an average complexity of $O(1)$ because it computes a hash address. 

Tradeoff: **Space-Time Complexity Tradeoff**. We trade $O(N)$ memory space to decrease execution time from $O(N^2)$ to $O(N)$.`,
      advanced: `### Collisions and Hash Function Complexity
Although Hash Map operations are theoretically $O(1)$, in practice they depend on the hash function efficiency and collision resolution strategy (e.g., chaining or open addressing). In worst-case scenarios where all keys map to the same bucket, lookup degrades to $O(N)$. For absolute guarantees, sorting and utilizing a two-pointer approach yields $O(N \\log N)$ time and $O(1)$ space.`
    },
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', type: 'Basic' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', type: 'Edge (Avoid self-match)' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]', type: 'Boundary (Duplicates)' },
      { input: 'nums = [1, 2, ..., 10000], target = 19999', output: '[9998, 9999]', type: 'Stress (Large dataset)' }
    ],
    solution: {
      approach: 'We iterate through the array once. For each element `nums[i]`, we calculate its complement `target - nums[i]`. If this complement is already in our hash map, it means we have found a pair of numbers that add up to the target, and we return their indices. Otherwise, we store the current number `nums[i]` and its index `i` in the hash map.',
      code: {
        javascript: `function twoSum(nums, target) {
  const map = new Map(); // Store: number -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        python: `def two_sum(nums, target):
    visited = {}  # Store: number -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in visited:
            return [visited[complement], i]
        visited[num] = i
    return []`,
        cpp: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map; // Store: number -> index
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
        java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>(); // Store: number -> index
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`
      },
      explanation: '1. We initialize a Hash Map/Dictionary to record items.\n2. We scan the list element-by-element.\n3. The condition check `target - num` allows finding the solution in a single pass.\n4. If found, we pull the indexes. Otherwise, we write the item to the hash structure.',
      complexity: 'Time Complexity: $O(N)$ - Single pass through the array.\nSpace Complexity: $O(N)$ - To store array entries in the worst case.'
    },
    plagiarism: {
      score: 'Likely Original',
      reason: 'The code matches standard beginner nested-loop attempts. Copy-pasted solutions almost always use the optimized Hash Map or show advanced list comprehensions. The variable names match template variables.'
    },
    interview: {
      readability: 'Good. The nested loops are easy to follow, but lack documentation explaining the quadratic behavior.',
      maintainability: 'Poor. If the array size grows, this method will lead to performance bottlenecks that are hard to scale.',
      naming: 'Standard variable naming (`i`, `j`, `nums`), which is fine for algorithmic problems but could be more descriptive in production code (e.g., `numIndex`, `searchIndex`).',
      ready: '70% Ready. While correct for small inputs, an interviewer will immediately expect you to optimize this to O(N) using a Hash Map. Always mention the Hash Map tradeoff first!'
    }
  },
  reverse_string: {
    analyzer: {
      topic: 'Two Pointers, Arrays',
      difficulty: 'Easy',
      concepts: ['Two-Pointer Swaps', 'In-place Modification', 'Half-Array Loop bounds'],
      mistakes: [
        'Creating a copy of the array instead of doing it in-place (which violates O(1) space constraints).',
        'Looping all the way to the end and swapping everything twice, resulting in the original array.'
      ]
    },
    hints: {
      1: '💡 **Hint 1**: If you swap the first character with the last character, they are in the correct place. What character should you swap next?',
      2: '💡 **Hint 2**: Use two markers: one starting at index `0` and one starting at the final index. Swap their values, and move them closer to each other.',
      3: '💡 **Hint 3**: A `while` loop running while `left < right` is perfect. Swap `s[left]` with `s[right]`, then increment `left` and decrement `right`.'
    },
    reviewer: [],
    complexity: {
      current: { time: 'O(N)', space: 'O(1)', reason: 'We iterate N/2 times to swap elements in place, which is O(N) operations. No extra memory is allocated.' },
      optimal: { time: 'O(N)', space: 'O(1)', reason: 'The current two-pointer approach is already optimal in terms of time and space complexity.' }
    },
    teacher: {
      beginner: `### Visualizing the Swap 🔄
Imagine a row of cards: [A, B, C, D, E].
To reverse them without using another table:
1. Swap the leftmost card (A) and rightmost card (E) -> [E, B, C, D, A]
2. Move your hands inward. Swap (B) and (D) -> [E, D, C, B, A]
3. Your hands meet at (C). You are done!`,
      intermediate: `### In-place swaps and reference typing
In JavaScript, arrays are passed by reference. Modifying \`s[left]\` directly affects the caller's array. The space complexity is $O(1)$ auxiliary because we only use one \`temp\` variable for swaps, regardless of the size of the array.`,
      advanced: `### Cache locality in array reversals
Since arrays are contiguous in memory, swapping elements from the outside-in provides good spatial locality for cache lines. In languages with pointers (like C++), swapping elements translates to dereferencing memory addresses, which is highly efficient.`
    },
    testCases: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', type: 'Basic' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', type: 'Edge (Even length)' },
      { input: 's = ["a"]', output: '["a"]', type: 'Boundary (Single item)' }
    ],
    solution: {
      approach: 'Use two pointers starting at the beginning and the end. Swap values, and move pointers toward each other until they meet.',
      code: {
        javascript: `function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
}`,
        python: `def reverse_string(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`
      },
      explanation: 'Pointers advance inwards, swapping pairs until the mid point is reached.',
      complexity: 'Time: O(N), Space: O(1)'
    },
    plagiarism: { score: 'Likely Original', reason: 'The implementation uses basic variables and clear structures typical of students.' },
    interview: { readiness: 'Great. The two-pointer in-place solution is exactly what interviewers look for.' }
  },
  valid_parentheses: {
    analyzer: {
      topic: 'Stack, Strings',
      difficulty: 'Medium',
      concepts: ['Stack (LIFO)', 'Map Matching', 'Closing validations'],
      mistakes: [
        'Using a counter instead of a stack (does not work if order is incorrect: e.g. "([)]").',
        'Forgetting to check if the stack is empty at the end, leading to unmatched open brackets being marked valid (e.g. "(").'
      ]
    },
    hints: {
      1: '💡 **Hint 1**: Last opened brackets must be closed first. What data structure follows "Last In, First Out" (LIFO)?',
      2: '💡 **Hint 2**: Push opening brackets onto a stack. When you see a closing bracket, check if it matches the bracket on top of the stack.',
      3: '💡 **Hint 3**: Loop through characters. If open bracket -> push. If closing bracket -> check stack. If empty or top doesn\'t match -> return false. Finally, return true if stack is empty.'
    },
    reviewer: [],
    complexity: {
      current: { time: 'O(N)', space: 'O(N)', reason: 'We loop through the string of size N once. In the worst case (e.g. all open brackets like "((((("), we push all characters onto the stack, requiring O(N) space.' },
      optimal: { time: 'O(N)', space: 'O(N)', reason: 'This is the optimal time and space complexity since we must inspect each character at least once.' }
    },
    teacher: {
      beginner: `### The Stack Analogy 🥞
Think of a stack of plates. You can only place plates on the top (push), and you can only take plates off the top (pop).
When you see an opening bracket, like '(', you add it to the top of your stack.
When you see a closing bracket, like ')', it must match the plate on the very top of your stack! If the stack is empty, or the top plate is different (like '{'), the brackets are out of order!`,
      intermediate: `### Stack LIFO operations
A Stack is a Last-In-First-Out data structure. In JS, we use an array with \`push()\` and \`pop()\` which run in $O(1)$ time. Counter methods fail for "([)]" because they track quantities, not hierarchical ordering.`,
      advanced: `### Compiler parser stacks
Stack matching is how compiler parsers validate code structures. In language implementations, this is the basis of Context-Free Grammars (CFG) parsing using Pushdown Automata.`
    },
    testCases: [
      { input: 's = "()"', output: 'true', type: 'Basic' },
      { input: 's = "()[]{}"', output: 'true', type: 'Multiple types' },
      { input: 's = "(]"', output: 'false', type: 'Mismatch' },
      { input: 's = "([)]"', output: 'false', type: 'Order test' },
      { input: 's = "["', output: 'false', type: 'Edge (Unclosed)' }
    ],
    solution: {
      approach: 'Create a stack and a dictionary mapping closing brackets to opening brackets. Loop through the string. Push opening brackets. For closing brackets, pop the top of stack and verify match.',
      code: {
        javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      const top = stack.pop();
      if (top !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`
      },
      explanation: 'Using stack logic allows strict LIFO ordering validations.',
      complexity: 'Time: O(N), Space: O(N)'
    },
    plagiarism: { score: 'Likely Original', reason: 'Student code uses basic array push/pop stack simulation.' },
    interview: { readiness: 'Solid structure. Standard stack logic matches expectations.' }
  }
};

// Simple rule-based dynamic code analyzer for custom user code
export function analyzeCustomCode(code, language) {
  const issues = [];
  
  // Syntax & simple bugs check (Regex based)
  if (language === 'javascript') {
    if (code.includes('for (let j = 0; j < nums.length; j++)') && code.includes('for (let i = 0; i < nums.length; i++)')) {
      issues.push({
        severity: 'Major',
        issue: 'Self-Matching Loop Index Risk',
        why: 'The inner loop variable `j` is starting at `0`, meaning that when `i === j`, you will check the same array element against itself. This will cause bugs for targets equal to double an element.',
        fix: 'Change the inner loop declaration to start at `i + 1`, e.g., `let j = i + 1;` to only compare distinct pairs.',
        line: 'for (let j = 0; j < nums.length; j++)'
      });
    }
    
    // Check for missing variables
    const matches = code.match(/(\w+)\s*=\s*/g);
    if (code.includes('console.log') && !code.includes('function') && code.length < 50) {
      // Small script
    }
  }
  
  if (language === 'python') {
    if (code.includes('range(len(') && code.match(/range\(len\(.*\)\)/g)?.length >= 2) {
      issues.push({
        severity: 'Minor',
        issue: 'Sub-optimal Brute Force Pattern',
        why: 'Using nested `range(len(...))` loops suggests an O(N^2) complexity, which is slow for larger inputs.',
        fix: 'Consider using a hash map (dictionary) or sorting with a two-pointer approach for better efficiency.',
        line: 'range(len(',
      });
    }
  }

  // General check for nested loops (Rough Complexity analysis)
  let loopCount = 0;
  const lines = code.split('\n');
  lines.forEach(line => {
    if (line.match(/(for|while|forEach|map)\b/)) {
      loopCount++;
    }
  });

  const estimatedTime = loopCount >= 2 ? 'O(N^2)' : loopCount === 1 ? 'O(N)' : 'O(1)';
  const estimatedSpace = code.includes('map') || code.includes('new Map') || code.includes('dict') || code.includes('stack') || code.includes('[]') ? 'O(N)' : 'O(1)';

  return {
    analyzer: {
      topic: 'Custom Program Code',
      difficulty: 'Dynamic Detection',
      concepts: ['Dynamic concept scanning', 'Input structures'],
      mistakes: ['Ensure index limits are kept within bounds.']
    },
    hints: {
      1: '💡 **Hint 1**: Look closely at how many times your loop is repeating. Are there overlapping comparisons?',
      2: '💡 **Hint 2**: Check what helper variables or data structures you might use to remember elements you have already seen.',
      3: '💡 **Hint 3**: Try walking through your code with a small input (like size 3) on paper to verify that the pointer or index variables have the expected values.'
    },
    reviewer: issues.length > 0 ? issues : [
      {
        severity: 'Minor',
        issue: 'Code Style & Formatting',
        why: 'No severe logic bugs detected, but make sure variables have descriptive names and comments outline the algorithms.',
        fix: 'Add short inline comments explaining major blocks of code.',
        line: code.slice(0, 40) + '...'
      }
    ],
    complexity: {
      current: {
        time: estimatedTime,
        space: estimatedSpace,
        reason: `Estimated from loop nesting depth (${loopCount} loop indicators detected) and object/array initializations.`
      },
      optimal: {
        time: 'O(N)',
        space: 'O(N)',
        reason: 'Typically achievable for many array or string problems by utilizing linear hash table techniques.'
      }
    },
    teacher: {
      beginner: 'This code uses basic flow structures like loops and assignments. To grow, focus on tracing how variable values change at each step.',
      intermediate: 'Utilize reference libraries and standard containers. Focus on algorithmic bounds and time/space complexity analysis.',
      advanced: 'Optimize for low-level memory usage, multi-threading, concurrency locks, and cache-friendly designs.'
    },
    testCases: [
      { input: 'Custom Input 1', output: 'Runs successfully', type: 'Basic' },
      { input: 'Custom Input 2', output: 'Runs successfully', type: 'Edge' }
    ],
    solution: {
      approach: 'Keep your logic clean, structure parameters clearly, and return outputs explicitly.',
      code: {
        javascript: '// Optimal structure depends on exact problem requirements.'
      },
      explanation: 'Optimal structures are best formulated when the exact input bounds are defined.',
      complexity: 'Time and space depend on implementation.'
    },
    plagiarism: {
      score: 'Likely Original',
      reason: 'The code structure, indentation style, and variable naming are consistent with natural manual creation.'
    },
    interview: {
      readability: 'Good. Solid spacing and indentation.',
      maintainability: 'Moderate. Code would benefit from descriptive function documentation.',
      naming: 'Standard variable conventions are followed.',
      ready: 'Continue practicing! Keep practicing writing tests and explaining time tradeoffs.'
    }
  };
}
