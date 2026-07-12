// src/components/DashboardOverview.jsx
import React, { useMemo } from 'react';
import { 
  Trophy, Flame, Sparkles, Code2, CheckCircle2, 
  Zap, ArrowRight, Play, BookOpen, Star, Target 
} from 'lucide-react';
import { getLevelProgress, getDifficultyColor } from '../utils/helpers';

export default function DashboardOverview({
  user,
  totalXP = 0,
  streak = 3,
  solvedProblems = [],
  problems = [],
  onLoadProblem,
  onNavigate,
}) {
  const { level, currentXP, nextLevelXP, progress } = getLevelProgress(totalXP);

  // Stats computation
  const stats = useMemo(() => {
    const easy = solvedProblems.filter((p) => p.difficulty === 'Easy').length;
    const medium = solvedProblems.filter((p) => p.difficulty === 'Medium').length;
    const hard = solvedProblems.filter((p) => p.difficulty === 'Hard').length;
    return { easy, medium, hard };
  }, [solvedProblems]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '24px',
        height: '100%',
        overflowY: 'auto',
        background: 'radial-gradient(circle at 50% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
      }}
    >
      {/* ── Welcome Panel ── */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(99, 102, 241, 0.12))',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Welcome back, <span style={{
              background: 'linear-gradient(135deg, #a5b4fc, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>{user?.name || 'Student'}</span>! 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '480px', lineHeight: '1.5' }}>
            Your personal CodeMentor AI is primed. Pick up right where you left off or run a customized code challenge to supercharge your skills!
          </p>
          
          {/* Quick-stats pill row */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.78rem', background: 'rgba(245,158,11,0.1)',
              color: '#f59e0b', padding: '4px 10px', borderRadius: '20px',
              border: '1px solid rgba(245,158,11,0.2)'
            }}>
              <Flame size={12} fill="currentColor" /> {streak} Day Streak
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.78rem', background: 'rgba(129,140,248,0.12)',
              color: '#a5b4fc', padding: '4px 10px', borderRadius: '20px',
              border: '1px solid rgba(129,140,248,0.2)'
            }}>
              Level {level} Coder
            </span>
          </div>
        </div>

        {/* Level Circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '150px' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', transform: 'rotate(-90deg)', width: '80px', height: '80px' }}>
              <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="transparent" />
              <circle cx="40" cy="40" r="34" stroke="url(#indigoGrad)" strokeWidth="6" fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
              <defs>
                <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>{level}</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {currentXP} / {nextLevelXP} XP ({progress}%)
          </span>
        </div>
      </div>

      {/* ── Grid Layout ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Left Side: Recommended Challenges & AI Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Challenge Board */}
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              background: 'rgba(15, 23, 42, 0.45)',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={16} style={{ color: 'var(--primary-light)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Code Challenge Board</h3>
              </div>
              <button
                onClick={() => onNavigate('playground')}
                style={{
                  background: 'none', border: 'none', color: 'var(--primary-light)',
                  fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center',
                  gap: '4px', cursor: 'pointer'
                }}
              >
                Open Sandbox <ArrowRight size={12} />
              </button>
            </div>

            {/* Problem row listings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {problems.map((prob) => {
                const isSolved = solvedProblems.some(p => p.id === prob.id);
                return (
                  <div
                    key={prob.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: isSolved ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSolved 
                        ? '1px solid rgba(16, 185, 129, 0.15)' 
                        : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '12px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)';
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.03)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = isSolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.background = isSolved ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{ flexShrink: 0, display: 'flex' }}>
                        {isSolved ? (
                          <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                        ) : (
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '50%',
                            border: '2px solid var(--text-muted)', opacity: 0.5
                          }} />
                        )}
                      </div>
                      
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {prob.title}
                          {prob.isAIGenerated && (
                            <span style={{
                              fontSize: '0.62rem', background: 'rgba(139,92,246,0.15)',
                              color: 'var(--secondary)', border: '1px solid rgba(139,92,246,0.3)',
                              borderRadius: '4px', padding: '1px 4px', display: 'flex', alignItems: 'center', gap: '2px'
                            }}>
                              <Sparkles size={8} /> AI
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {prob.topic || 'General'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700,
                        color: getDifficultyColor(prob.difficulty),
                        background: `${getDifficultyColor(prob.difficulty)}11`,
                        padding: '2px 8px', borderRadius: '12px',
                        border: `1px solid ${getDifficultyColor(prob.difficulty)}22`
                      }}>{prob.difficulty}</span>

                      <button
                        onClick={() => onLoadProblem(prob)}
                        style={{
                          background: isSolved ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                          border: 'none', color: 'white', padding: '6px 12px', borderRadius: '8px',
                          fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px',
                          boxShadow: isSolved ? 'none' : '0 2px 8px rgba(99, 102, 241, 0.3)'
                        }}
                      >
                        <Play size={10} fill="currentColor" /> {isSolved ? 'Review' : 'Solve'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Banner Card */}
          <div
            className="glass-panel"
            style={{
              padding: '24px 28px',
              background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(15, 23, 42, 0.7) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                <Sparkles size={12} /> Adaptive Problem Builder
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>Need a completely custom challenge?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: '420px', lineHeight: '1.4' }}>
                Tell our AI model what you want to learn, choose a difficulty level, and CodeMentor AI will formulate a custom task complete with hints.
              </p>
            </div>
            <button
              onClick={() => onNavigate('generator')}
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                border: 'none', borderRadius: '10px', padding: '10px 20px',
                color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 4px 15px rgba(168,85,247,0.35)'
              }}
            >
              Launch AI Generator <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right Side: Quick Stats & Leaderboard Standing Snippet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick Metrics */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              background: 'rgba(15, 23, 42, 0.45)',
              borderRadius: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SOLVED</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
                {solvedProblems.length} <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)' }}>problems</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>XP REWARDED</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {totalXP} <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)' }}>XP</span>
              </div>
            </div>
          </div>

          {/* Leaderboard Standing Widget */}
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              background: 'rgba(15, 23, 42, 0.45)',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={16} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Leaderboard Snippet</h3>
              </div>
              <button
                onClick={() => onNavigate('leaderboard')}
                style={{
                  background: 'none', border: 'none', color: 'var(--primary-light)',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                View All
              </button>
            </div>

            {/* Top 3 Rankings Snippet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { rank: 1, name: 'Ananya Sharma', xp: 1240, streak: 14 },
                { rank: 2, name: 'Ravi Mehta', xp: 980, streak: 7 },
                { rank: 3, name: 'Priya Nair', xp: 870, streak: 21 },
                { rank: '—', name: `${user?.name || 'You'} (Standing)`, xp: totalXP, streak, isUser: true }
              ].map((ent, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    background: ent.isUser ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.01)',
                    border: ent.isUser ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{
                    width: '18px', fontSize: '0.78rem', fontWeight: 700,
                    textAlign: 'center', color: ent.rank === 1 ? '#f59e0b' : ent.rank === 2 ? '#94a3b8' : ent.rank === 3 ? '#cd7c2f' : 'var(--text-muted)'
                  }}>
                    {ent.rank === 1 ? '🥇' : ent.rank === 2 ? '🥈' : ent.rank === 3 ? '🥉' : '👤'}
                  </span>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.78rem', fontWeight: ent.isUser ? 700 : 500,
                      color: ent.isUser ? '#a5b4fc' : 'var(--text-primary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {ent.name}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>
                    {ent.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Progress Breakdown */}
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              background: 'rgba(15, 23, 42, 0.45)',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Target size={15} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Educational Badges</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.15)' }}>🏅 Beginner</span>
              <span style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.15)' }}>⚡ Speedster</span>
              <span style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.15)' }}>🌟 On a Roll</span>
              <span style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(6,182,212,0.1)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.15)' }}>🎯 Consistent</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
