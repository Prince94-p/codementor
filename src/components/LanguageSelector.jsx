import React from 'react';
import { languages } from '../data/mockData';
import { getProfile, toggleLanguage } from '../data/userProfile';
import { useAuth } from '../auth/AuthContext';

/**
 * LanguageSelector Component
 * Allows students to enable or disable compiler environments for different languages.
 * Automatically saves the language preferences to the active user's local profile.
 * 
 * @returns {React.JSX.Element} The LanguageSelector control panel.
 */
export default function LanguageSelector() {
  const { user } = useAuth();
  const profile = getProfile(user?.email);
  const selected = new Set(profile.selectedLanguages);

  /**
   * Toggles the enabled/disabled state of a compiler environment.
   * 
   * @param {string} langId - The unique language identifier (e.g. 'javascript', 'python').
   * @returns {void}
   */
  const handleToggle = (langId) => {
    const enable = !selected.has(langId);
    toggleLanguage(user?.email, langId, enable);
    // Force a clean reload to sync compiler state throughout the workspace
    window.location.reload();
  };

  return (
    <div style={{ padding: '12px', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', marginBottom: '16px' }}>
      <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Supported Languages</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {languages.map(lang => (
          <label key={lang.id} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={selected.has(lang.id)}
              onChange={() => handleToggle(lang.id)}
              style={{ marginRight: '6px' }}
            />
            {lang.name}
          </label>
        ))}
      </div>
    </div>
  );
}
