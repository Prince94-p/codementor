// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import * as authService from './authService';

/**
 * React context for managing user authentication state.
 */
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the application and provides
 * authentication state (login, signup, logout) to all children.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to be wrapped.
 * @returns {React.JSX.Element} The authentication provider wrapper.
 */
export function AuthProvider({ children }) {
  // Initialize user state from locally stored session if available
  const [user, setUser] = useState(() => authService.getCurrentUser());

  /**
   * Logs in a user with the provided credentials.
   * 
   * @type {Function}
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {{success: boolean, user?: Object, error?: string}} Operation success status and user/error info.
   */
  const login = useCallback((email, password) => {
    const result = authService.login(email, password);
    if (result.success) setUser(result.user);
    return result;
  }, []);

  /**
   * Registers a new user with the provided details.
   * 
   * @type {Function}
   * @param {string} name - The user's display name.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {{success: boolean, user?: Object, error?: string}} Operation success status and user/error info.
   */
  const signUp = useCallback((name, email, password) => {
    const result = authService.signUp(name, email, password);
    if (result.success) setUser(result.user);
    return result;
  }, []);

  /**
   * Logs out the current user and clears the active session.
   * 
   * @type {Function}
   * @returns {void}
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom React hook to access the authentication context.
 * Must be used within an AuthProvider hierarchy.
 * 
 * @returns {{user: Object|null, login: Function, signUp: Function, logout: Function}} Authentication context object.
 * @throws {Error} If called outside of an AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
