// src/components/Settings.jsx
// User settings panel for theme, editor preferences, language config, and account management

import React, { useState } from 'react';
import {
  Settings as SettingsIcon, X, Moon, Sun, Monitor,
  Type, Code2, Volume2, VolumeX, Trash2, LogOut,
  ChevronRight, Check, Palette, Sliders, User, Bell
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { THEMES, EDITOR_FONT_SIZES, SUPPORTED_LANGUAGES } from '../utils/constants';

/**
 * @typedef {Object} SettingsProps
 * @property {boolean} isOpen - Controls modal visibility.
 * @property {Function} onClose - Callback to close the Settings panel.
 * @property {Object} user - The currently authenticated user object.
 * @property {Function} logout - Logout callback.
 */

/**
 * Settings panel modal. Allows the user to configure:
 * - Appearance: theme and color accent.
 * - Editor: font size, tab size, line numbers, minimap.
 * - Notifications: sound and toast preferences.
 * - Account: display name, logout, data reset.
 *
 * All settings are persisted to localStorage via the useLocalStorage hook.
 *
 * @param {SettingsProps} props - Component properties.
 * @returns {React.JSX.Element|null} The settings modal, or null when closed.
 */
export default function Settings({ isOpen, onClose, user, logout, isInline }) {
  const [activeSection, setActiveSection] = useState('appearance');

  // Persisted preferences
  const [theme, setTheme] = useLocalStorage('codementor_theme', 'dark');
  const [fontSize, setFontSize] = useLocalStorage('codementor_fontSize', 14);
  const [tabSize, setTabSize] = useLocalStorage('codementor_tabSize', 2);
  const [showLineNumbers, setShowLineNumbers] = useLocalStorage('codementor_lineNumbers', true);
  const [showMinimap, setShowMinimap] = useLocalStorage('codementor_minimap', false);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('codementor_sound', true);
  const [toastEnabled, setToastEnabled] = useLocalStorage('codementor_toasts', true);
  const [accentColor, setAccentColor] = useLocalStorage('codementor_accent', '#6366f1');

  // Transient UI state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'editor', label: 'Editor', icon: Code2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: User },
  ];

  const accentOptions = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#3b82f6', // blue
  ];

  const handleResetData = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('codementor_'))
      .forEach((k) => localStorage.removeItem(k));
    setShowResetConfirm(false);
    window.location.reload();
  };

  if (!isInline && !isOpen) return null;

  const renderContent = () => (
    <div
      style={{
        width: '100%',
        height: isInline ? '100%' : 'auto',
        maxHeight: isInline ? '100%' : '85vh',
        borderRadius: isInline ? '0' : '16px',
        background: isInline ? 'transparent' : '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
      }}
    >
      {/* Modal Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: isInline ? 'rgba(30, 41, 59, 0.2)' : 'transparent',
          flexShrink: 0,
        }}
      >
        <SettingsIcon size={18} style={{ color: 'var(--primary-light, #818cf8)', marginRight: '10px' }} />
        <span
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary, #f1f5f9)',
          }}
        >
          Settings
        </span>
        {!isInline && onClose && (
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #64748b)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Modal Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div
          style={{
            width: '170px',
            flexShrink: 0,
            borderRight: '1px solid rgba(255,255,255,0.07)',
            background: isInline ? 'rgba(15, 23, 42, 0.15)' : 'transparent',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeSection === id ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color:
                    activeSection === id
                      ? 'var(--primary-light, #818cf8)'
                      : 'var(--text-secondary, #94a3b8)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: activeSection === id ? 600 : 400,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  width: '100%',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
            {/* ── Appearance ── */}
            {activeSection === 'appearance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionTitle>Theme</SectionTitle>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'midnight', label: 'Midnight', icon: Monitor },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setTheme(id)}
                      style={{
                        flex: 1,
                        padding: '12px 8px',
                        borderRadius: '10px',
                        border: `1px solid ${theme === id ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                        background: theme === id ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                        color: theme === id ? '#818cf8' : 'var(--text-secondary, #94a3b8)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: theme === id ? 600 : 400,
                        transition: 'all 0.15s',
                      }}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>

                <SectionTitle>Accent Color</SectionTitle>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {accentOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      title={color}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: color,
                        border: accentColor === color ? '2px solid #fff' : '2px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: accentColor === color ? `0 0 0 3px ${color}55` : 'none',
                        transition: 'all 0.15s',
                      }}
                    >
                      {accentColor === color && <Check size={12} color="#fff" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Editor ── */}
            {activeSection === 'editor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SectionTitle>Font Size</SectionTitle>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {EDITOR_FONT_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${fontSize === size ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                        background: fontSize === size ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                        color: fontSize === size ? '#818cf8' : 'var(--text-secondary, #94a3b8)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: fontSize === size ? 600 : 400,
                        transition: 'all 0.15s',
                      }}
                    >
                      {size}px
                    </button>
                  ))}
                </div>

                <SectionTitle>Tab Size</SectionTitle>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[2, 4, 8].map((size) => (
                    <button
                      key={size}
                      onClick={() => setTabSize(size)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${tabSize === size ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                        background: tabSize === size ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                        color: tabSize === size ? '#818cf8' : 'var(--text-secondary, #94a3b8)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: tabSize === size ? 600 : 400,
                        transition: 'all 0.15s',
                      }}
                    >
                      {size} spaces
                    </button>
                  ))}
                </div>

                <ToggleRow
                  label="Show Line Numbers"
                  description="Display line numbers in the code editor."
                  checked={showLineNumbers}
                  onChange={setShowLineNumbers}
                />
                <ToggleRow
                  label="Show Minimap"
                  description="Show the code overview minimap on the right edge."
                  checked={showMinimap}
                  onChange={setShowMinimap}
                />
              </div>
            )}

            {/* ── Notifications ── */}
            {activeSection === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ToggleRow
                  label="Sound Effects"
                  description="Play audio feedback on code run and events."
                  checked={soundEnabled}
                  onChange={setSoundEnabled}
                  icon={soundEnabled ? Volume2 : VolumeX}
                />
                <ToggleRow
                  label="Toast Notifications"
                  description="Show floating notifications for successes and warnings."
                  checked={toastEnabled}
                  onChange={setToastEnabled}
                />
              </div>
            )}

            {/* ── Account ── */}
            {activeSection === 'account' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* User info card */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'S'}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--text-primary, #f1f5f9)',
                      }}
                    >
                      {user?.name ?? 'Student'}
                    </div>
                    <div
                      style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}
                    >
                      {user?.email ?? ''}
                    </div>
                  </div>
                </div>

                {/* Danger zone */}
                <SectionTitle>Danger Zone</SectionTitle>

                <ActionRow
                  icon={Trash2}
                  label="Reset All Data"
                  description="Permanently delete all saved problems, progress, and settings."
                  color="#ef4444"
                  onClick={() => setShowResetConfirm(true)}
                />

                <ActionRow
                  icon={LogOut}
                  label="Sign Out"
                  description="Log out of your current CodeMentor session."
                  color="#f59e0b"
                  onClick={logout}
                />

                {/* Reset confirm */}
                {showResetConfirm && (
                  <div
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        color: '#fca5a5',
                      }}
                    >
                      ⚠️ This will delete all your data and cannot be undone. Are you sure?
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleResetData}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#ef4444',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        Yes, Reset Everything
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'transparent',
                          color: 'var(--text-secondary, #94a3b8)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );

  if (isInline) {
    return (
      <div style={{ height: '100%', overflow: 'hidden', padding: '24px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(720px, 92vw)',
          maxHeight: '85vh',
          borderRadius: '16px',
          background: '#0f172a',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          overflow: 'hidden',
          fontFamily: 'var(--font-sans, Inter, sans-serif)',
        }}
      >
        {renderContent()}
      </div>
    </>
  );
}

/* ── Sub-components ────────────────────────────────────────── */

/**
 * Section title label within a settings section.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element}
 */
function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: 'var(--text-muted, #64748b)',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Toggle row for boolean settings.
 *
 * @param {Object} props
 * @param {string} props.label - Setting name.
 * @param {string} props.description - Short description.
 * @param {boolean} props.checked - Current value.
 * @param {Function} props.onChange - Toggle handler.
 * @param {React.ElementType} [props.icon] - Optional icon.
 * @returns {React.JSX.Element}
 */
function ToggleRow({ label, description, checked, onChange, icon: Icon }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        gap: '12px',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--text-primary, #f1f5f9)',
            marginBottom: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {Icon && <Icon size={14} style={{ color: 'var(--text-secondary, #94a3b8)' }} />}
          {label}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>
          {description}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '42px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          background: checked ? '#6366f1' : 'rgba(255,255,255,0.1)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '21px' : '3px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}
        />
      </button>
    </div>
  );
}

/**
 * Clickable action row for account-level actions (logout, reset).
 *
 * @param {Object} props
 * @param {React.ElementType} props.icon - Icon component.
 * @param {string} props.label - Action label.
 * @param {string} props.description - Short description.
 * @param {string} props.color - Accent color.
 * @param {Function} props.onClick - Click handler.
 * @returns {React.JSX.Element}
 */
function ActionRow({ icon: Icon, label, description, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '10px',
        border: `1px solid ${color}33`,
        background: `${color}0a`,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${color}18`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = `${color}0a`)}
    >
      <Icon size={16} style={{ color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 500, color, marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #64748b)' }}>
          {description}
        </div>
      </div>
      <ChevronRight size={14} style={{ color: 'var(--text-muted, #64748b)', flexShrink: 0 }} />
    </button>
  );
}
