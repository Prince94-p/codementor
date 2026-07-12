// src/data/userProfile.js
// Per-user profile persisted in localStorage, keyed by email

/**
 * Creates the default profile state for a user.
 * 
 * @returns {Object} The default profile structure.
 */
const defaultProfile = () => ({
  selectedLanguages: ['javascript'],
  savedProblems: [],
  solvedProblems: [
    { id: 'reverse_string', title: 'Reverse String', difficulty: 'Easy', topic: 'Strings', solvedAt: Date.now() - 4 * 24 * 3600 * 1000, xpEarned: 10 },
    { id: 'two_sum', title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', solvedAt: Date.now() - 2 * 24 * 3600 * 1000, xpEarned: 10 }
  ],
  totalXP: 140,
  streak: 3,
  compilerConfig: {
    javascript: { type: 'js', enabled: true },
    python: { type: 'pyodide', enabled: false },
    cpp: { type: 'wasm', enabled: false },
    java: { type: 'java', enabled: false },
  },
});

/**
 * Generates a unique local storage key for a user profile based on email.
 * 
 * @param {string} email - The user's email address.
 * @returns {string} The formatted local storage key.
 */
function profileKey(email) {
  return `codementor_profile_${(email || 'guest').toLowerCase().trim()}`;
}

/**
 * Loads a user profile from localStorage. Returns default profile on failure.
 * 
 * @param {string} email - The user's email address.
 * @returns {Object} The loaded or default user profile object.
 */
function loadProfile(email) {
  try {
    const raw = localStorage.getItem(profileKey(email));
    if (raw) return { ...defaultProfile(), ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load user profile:', e);
  }
  return defaultProfile();
}

/**
 * Saves a user profile object to localStorage.
 * 
 * @param {string} email - The user's email address.
 * @param {Object} profile - The user profile object to save.
 * @returns {void}
 */
function saveProfile(email, profile) {
  try {
    localStorage.setItem(profileKey(email), JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save user profile:', e);
  }
}

/**
 * Retrieves the profile of a user.
 * 
 * @param {string} email - The user's email address.
 * @returns {Object} The user's profile object.
 */
export function getProfile(email) {
  return loadProfile(email);
}

/**
 * Updates a user profile object by applying an updater function.
 * 
 * @param {string} email - The user's email address.
 * @param {Function} updater - A function that takes current profile and returns the updated one.
 * @returns {Object} The newly updated user profile object.
 */
export function updateProfile(email, updater) {
  const profile = loadProfile(email);
  const updated = updater(profile);
  saveProfile(email, updated);
  return updated;
}

/**
 * Adds a problem to the user's saved problems list.
 * 
 * @param {string} email - The user's email address.
 * @param {Object} problem - The problem object to save.
 * @returns {void}
 */
export function addSavedProblem(email, problem) {
  updateProfile(email, p => {
    // avoid duplicates by id
    const filtered = p.savedProblems.filter(x => x.id !== problem.id);
    return { ...p, savedProblems: [problem, ...filtered] };
  });
}

/**
 * Removes a problem from the user's saved problems list by ID.
 * 
 * @param {string} email - The user's email address.
 * @param {string|number} problemId - The ID of the problem to remove.
 * @returns {void}
 */
export function removeSavedProblem(email, problemId) {
  updateProfile(email, p => ({
    ...p,
    savedProblems: p.savedProblems.filter(x => x.id !== problemId),
  }));
}

/**
 * Retrieves the list of saved problems for a user.
 * 
 * @param {string} email - The user's email address.
 * @returns {Array<Object>} List of saved problems.
 */
export function getSavedProblems(email) {
  return loadProfile(email).savedProblems;
}

/**
 * Toggles support for a programming language in the user's settings.
 * 
 * @param {string} email - The user's email.
 * @param {string} langId - The language ID.
 * @param {boolean} enable - Whether to enable or disable the language.
 * @returns {void}
 */
export function toggleLanguage(email, langId, enable) {
  updateProfile(email, p => {
    const cfg = { ...p.compilerConfig, [langId]: { ...(p.compilerConfig[langId] || {}), enabled: enable } };
    const langs = new Set(p.selectedLanguages);
    if (enable) langs.add(langId); else langs.delete(langId);
    return { ...p, compilerConfig: cfg, selectedLanguages: Array.from(langs) };
  });
}

/**
 * Retrieves the compiler configuration for a specific language.
 * 
 * @param {string} email - The user's email.
 * @param {string} langId - The language ID.
 * @returns {Object} Compiler configuration object.
 */
export function getCompilerConfig(email, langId) {
  return loadProfile(email).compilerConfig[langId];
}

/**
 * Retrieves the list of solved problems for a user.
 * 
 * @param {string} email - The user's email address.
 * @returns {Array<Object>} List of solved problems.
 */
export function getSolvedProblems(email) {
  return loadProfile(email).solvedProblems || [];
}

/**
 * Adds a problem to the user's solved list, and awards them XP if it's their first time solving it.
 * 
 * @param {string} email - The user's email address.
 * @param {Object} problem - The problem object to record.
 * @returns {{ newlySolved: boolean, xpEarned: number }}
 */
export function addSolvedProblem(email, problem) {
  let newlySolved = false;
  let xpEarned = 0;

  updateProfile(email, p => {
    const solved = p.solvedProblems || [];
    const alreadySolved = solved.find(x => x.id === problem.id);
    
    if (!alreadySolved) {
      newlySolved = true;
      xpEarned = problem.difficulty === 'Hard' ? 40 : problem.difficulty === 'Medium' ? 25 : 15;
      const newSolvedEntry = {
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        topic: problem.topic || 'General',
        solvedAt: Date.now(),
        xpEarned,
      };
      return {
        ...p,
        solvedProblems: [...solved, newSolvedEntry],
        totalXP: (p.totalXP || 0) + xpEarned,
        streak: (p.streak || 0) + (Math.random() > 0.75 ? 1 : 0), // Subtle mock streak progression
      };
    }
    return p;
  });

  return { newlySolved, xpEarned };
}

/**
 * Updates a user's total XP directly.
 * 
 * @param {string} email - The user's email address.
 * @param {number} xp - Amount of XP to award.
 */
export function updateXP(email, xp) {
  updateProfile(email, p => ({
    ...p,
    totalXP: (p.totalXP || 0) + xp,
  }));
}

/**
 * Increments the user's login/coding streak.
 * 
 * @param {string} email - The user's email address.
 */
export function incrementStreak(email) {
  updateProfile(email, p => ({
    ...p,
    streak: (p.streak || 0) + 1,
  }));
}

