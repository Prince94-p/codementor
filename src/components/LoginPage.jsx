// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Sparkles, Code2, Cpu, Brain } from 'lucide-react';

/**
 * LoginPage Component
 * Renders the initial authentication gateway allowing students to login or register
 * a new local profile. Includes animations, branding features list, and interactive forms.
 * 
 * @returns {React.JSX.Element} The LoginPage wrapper.
 */
export default function LoginPage() {
  const { login, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles authentication form submission.
   * Simulates a brief loading state before calling local signup or login auth methods.
   * 
   * @param {React.FormEvent} e - Form submission event context.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 600)); // UX delay

    const result = mode === 'login'
      ? login(email, password)
      : signUp(name, email, password);

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  /**
   * Switches the active authentication mode between Login and Sign Up.
   * Automatically resets all form fields and error messages.
   * 
   * @returns {void}
   */
  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-deep)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background blobs */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          top: '-200px', left: '-100px', borderRadius: '50%',
          animation: 'pulse 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          bottom: '-150px', right: '-100px', borderRadius: '50%',
          animation: 'pulse 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%',
        }} />
        {/* Floating code symbols */}
        {['{', '}', '<', '/>', '()', '=>', '[]', '=='].map((sym, i) => (
          <div key={i} style={{
            position: 'absolute',
            color: `rgba(99,102,241,${0.05 + i * 0.02})`,
            fontSize: `${1.2 + (i % 3) * 0.8}rem`,
            fontFamily: 'monospace',
            fontWeight: '700',
            top: `${10 + (i * 11) % 80}%`,
            left: `${5 + (i * 13) % 90}%`,
            animation: `float ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            userSelect: 'none',
          }}>{sym}</div>
        ))}
      </div>

      {/* Left panel — Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '60px 80px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '60px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '12px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(99,102,241,0.4)',
          }}>
            <GraduationCap size={28} style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              CodeMentor <span style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>AI</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              PAIR PROGRAMMING & LEARNING PLATFORM
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          letterSpacing: '-0.04em',
          lineHeight: '1.1',
          color: 'var(--text-primary)',
          marginBottom: '20px',
          maxWidth: '500px',
        }}>
          Learn to code<br />
          <span style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>10x faster</span><br />
          with AI
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.7',
          maxWidth: '420px',
          marginBottom: '48px',
        }}>
          Get instant AI-generated coding problems, real-time hints, multi-language support, and a personal AI tutor that adapts to your skill level.
        </p>

        {/* Feature badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { icon: Brain, text: 'AI Problem Generator — Infinite custom challenges', color: 'var(--primary)' },
            { icon: Code2, text: 'Multi-Language Compiler — JS, Python, C++, Java', color: 'var(--secondary)' },
            { icon: Cpu, text: '9 Educational AI Agents — Hints, Reviews & More', color: 'var(--accent)' },
          ].map(({ icon: Icon, text, color }, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '12px 18px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                background: `${color}22`,
                border: `1px solid ${color}44`,
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
              }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Auth Form */}
      <div style={{
        width: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          width: '100%',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '48px 40px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Form Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '0.75rem',
              color: 'var(--primary)',
              marginBottom: '16px',
            }}>
              <Sparkles size={12} />
              {mode === 'login' ? 'Welcome back!' : 'Join for free'}
            </div>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {mode === 'login'
                ? 'Access your problems, progress, and AI tutor'
                : 'Start your AI-powered coding journey today'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'signup' && (
              <FormField
                icon={<User size={16} />}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            )}

            <FormField
              icon={<Mail size={16} />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <FormField
              icon={<Lock size={16} />}
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)', display: 'flex', padding: '0',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Error message */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="auth-submit-btn"
              style={{
                background: loading
                  ? 'rgba(99,102,241,0.5)'
                  : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? '🚀 Sign In' : '✨ Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Switch mode */}
          <button
            onClick={switchMode}
            id="auth-switch-btn"
            style={{
              width: '100%',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '12px',
              padding: '12px',
              color: 'var(--primary)',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(99,102,241,0.2)';
              e.target.style.borderColor = 'rgba(99,102,241,0.5)';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'rgba(99,102,241,0.1)';
              e.target.style.borderColor = 'rgba(99,102,241,0.25)';
            }}
          >
            {mode === 'login' ? '📝 Sign Up for Free' : '← Back to Sign In'}
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '0.72rem',
            color: 'var(--text-muted, #475569)',
            marginTop: '20px',
          }}>
            Your data is stored locally on your device. No external servers.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function FormField({ icon, suffix, ...inputProps }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '12px 16px',
      transition: 'border-color 0.2s',
    }}
      onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
      onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
    >
      <span style={{ color: 'var(--text-secondary)', display: 'flex' }}>{icon}</span>
      <input
        {...inputProps}
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
        }}
      />
      {suffix}
    </div>
  );
}
