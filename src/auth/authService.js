// src/auth/authService.js
// Client-side auth using localStorage — no backend required

const USERS_KEY = 'codementor_users';
const SESSION_KEY = 'codementor_session';

// Simple obfuscation (not real crypto — for demo purposes only)
function encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function decode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return '';
  }
}

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signUp(name, email, password) {
  if (!name || !email || !password) {
    return { success: false, error: 'All fields are required.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const users = getUsers();
  const key = email.toLowerCase().trim();

  if (users[key]) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const user = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: key,
    passwordHash: encode(password),
    createdAt: new Date().toISOString(),
    avatar: name.trim().charAt(0).toUpperCase(),
  };

  users[key] = user;
  saveUsers(users);

  // Auto-login after sign-up
  const session = { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

export function login(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const users = getUsers();
  const key = email.toLowerCase().trim();
  const stored = users[key];

  if (!stored) {
    return { success: false, error: 'No account found with that email.' };
  }

  if (decode(stored.passwordHash) !== password) {
    return { success: false, error: 'Incorrect password.' };
  }

  const session = { id: stored.id, name: stored.name, email: stored.email, avatar: stored.avatar };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
