// src/components/SavedProblems.jsx
import React from 'react';
import { X, BookOpen, Trash2, Clock, Sparkles } from 'lucide-react';
import { getSavedProblems, removeSavedProblem } from '../data/userProfile';
import { useAuth } from '../auth/AuthContext';

const DIFF_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

/**
 * SavedProblems Component
 * Renders a slide-over panel displaying all problems saved by the authenticated student.
 * Enables loading a saved problem context back into the editor workspace or removing it from profile.
 * 
 * @param {Object} props - Component properties.
 * @param {Function} props.onLoadProblem - Callback to load a selected problem into workspace.
 * @param {Function} props.onClose - Callback to close the slide-over panel.
 * @returns {React.JSX.Element} The SavedProblems side panel component.
 */
export default function SavedProblems({ onLoadProblem, onClose, isInline, onNavigate }) {
  const { user } = useAuth();
  const [problems, setProblems] = React.useState(() => getSavedProblems(user?.email));

  /**
   * Deletes a saved problem by ID and updates local state.
   * 
   * @param {string|number} id - Unique identifier of the problem to delete.
   * @returns {void}
   */
  const handleDelete = (id) => {
    removeSavedProblem(user?.email, id);
    setProblems(getSavedProblems(user?.email));
  };

  /**
   * Loads a problem into the workspace and closes the panel.
   * 
   * @param {Object} prob - The problem object configuration.
   * @returns {void}
   */
  const handleLoad = (prob) => {
    onLoadProblem(prob);
    if (onNavigate) {
      onNavigate('playground');
    } else if (onClose) {
      onClose();
    }
  };

  const renderContent = () => (
    <div style={{
      width: '100%',
      height: '100%',
      background: isInline ? 'transparent' : 'rgba(10,15,30,0.97)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
        borderRadius: isInline ? '16px 16px 0 0' : '0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '8px', borderRadius: '10px', display: 'flex',
          }}>
            <BookOpen size={18} style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>My Saved Problems</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{problems.length} problem{problems.length !== 1 ? 's' : ''} saved</div>
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

      {/* User badge */}
      {user && !isInline && (
        <div style={{
          margin: '16px 20px 0',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', fontSize: '0.9rem', color: 'white', flexShrink: 0,
          }}>{user.avatar}</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{user.email}</div>
          </div>
        </div>
      )}

      {/* Problems list */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px', 
        display: isInline ? 'grid' : 'flex',
        gridTemplateColumns: isInline ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'none',
        flexDirection: isInline ? 'none' : 'column',
        gap: '16px' 
      }}>
        {problems.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '60px 20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📂</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>No saved problems yet</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Use the <strong style={{ color: 'var(--primary)' }}>✨ Generate</strong> button to create AI-powered problems and save them here.
            </div>
          </div>
        ) : (
          problems.map(prob => (
            <div key={prob.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)';
                e.currentTarget.style.background = 'rgba(99,102,241,0.02)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div>
                {/* Badges */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: `${DIFF_COLORS[prob.difficulty] || '#6366f1'}22`,
                    color: DIFF_COLORS[prob.difficulty] || '#6366f1',
                    border: `1px solid ${DIFF_COLORS[prob.difficulty] || '#6366f1'}44`,
                    padding: '2px 8px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: '700',
                  }}>{prob.difficulty}</span>
                  <span style={{
                    background: 'rgba(99,102,241,0.12)', color: 'var(--primary-light)',
                    padding: '2px 8px', borderRadius: '20px', fontSize: '0.68rem',
                  }}>{prob.topic}</span>
                  {prob.isAIGenerated && (
                    <span style={{
                      background: 'rgba(139,92,246,0.12)', color: 'var(--secondary)',
                      padding: '2px 8px', borderRadius: '20px', fontSize: '0.68rem',
                      display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                      <Sparkles size={9} /> AI
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {prob.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5',
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {prob.description}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <Clock size={10} />
                  {new Date(prob.savedAt || prob.generatedAt).toLocaleDateString()}
                </div>
                <button onClick={() => handleDelete(prob.id)} style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '6px', padding: '4px 8px', cursor: 'pointer',
                  color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem',
                }}>
                  <Trash2 size={11} /> Delete
                </button>
                <button onClick={() => handleLoad(prob)} style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                  border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer',
                  color: 'white', fontWeight: '600', fontSize: '0.78rem',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.25)'
                }}>
                  Load →
                </button>
              </div>
            </div>
          ))
        )}
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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '420px', height: '100vh',
        background: 'rgba(10,15,30,0.97)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRight: 'none',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
      }}>
        {renderContent()}
      </div>
    </div>
  );
}
