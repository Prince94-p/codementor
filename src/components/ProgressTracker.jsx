// src/components/ProgressTracker.jsx
// Student progress tracking panel showing XP, level, streaks, and solved problems

import React, { useMemo } from 'react';
import {
  Trophy, Flame, TrendingUp, Code2, CheckCircle2,
  Star, Zap, Target, Award, BarChart3
} from 'lucide-react';
import { getLevelProgress, getDifficultyColor, formatDate, groupBy } from '../utils/helpers';
import { DIFFICULTY } from '../utils/constants';

/**
 * @typedef {Object} SolvedEntry
 * @property {string} id - Problem ID.
 * @property {string} title - Problem title.
 * @property {string} difficulty - 'Easy' | 'Medium' | 'Hard'.
 * @property {string} topic - Problem topic category.
 * @property {number} solvedAt - Unix timestamp of when the problem was solved.
 * @property {number} xpEarned - XP earned for this problem.
 */

/**
 * ProgressTracker component that displays the student's accumulated XP,
 * current level, streaks, topic breakdown, and recent problem history.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.user - The authenticated user object.
 * @param {SolvedEntry[]} [props.solvedProblems=[]] - List of problems solved by the user.
 * @param {number} [props.totalXP=0] - Total XP accumulated by the user.
 * @param {number} [props.streak=0] - Current daily login/solve streak in days.
 * @returns {React.JSX.Element} The progress tracking UI panel.
 */
export default function ProgressTracker({
  user,
  solvedProblems = [],
  totalXP = 0,
  streak = 0,
}) {
  const { level, currentXP, nextLevelXP, progress } = getLevelProgress(totalXP);

  const stats = useMemo(() => {
    const easy = solvedProblems.filter((p) => p.difficulty === DIFFICULTY.EASY).length;
    const medium = solvedProblems.filter((p) => p.difficulty === DIFFICULTY.MEDIUM).length;
    const hard = solvedProblems.filter((p) => p.difficulty === DIFFICULTY.HARD).length;
    const byTopic = groupBy(solvedProblems, 'topic');
    const topTopic = Object.entries(byTopic).sort((a, b) => b[1].length - a[1].length)[0];
    return { easy, medium, hard, byTopic, topTopic };
  }, [solvedProblems]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        height: '100%',
        overflowY: 'auto',
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <TrendingUp size={18} style={{ color: 'var(--primary-light, #818cf8)' }} />
        <h2
          style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary, #f1f5f9)',
            letterSpacing: '0.02em',
          }}
        >
          My Progress
        </h2>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '20px',
            background: 'rgba(129, 140, 248, 0.15)',
            color: 'var(--primary-light, #818cf8)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
          }}
        >
          {user?.name ?? 'Student'}
        </span>
      </div>

      {/* ── Level + XP Bar ── */}
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(129, 140, 248, 0.08)',
          border: '1px solid rgba(129, 140, 248, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
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
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
            }}
          >
            {level}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary, #f1f5f9)',
                marginBottom: '2px',
              }}
            >
              Level {level} Coder
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #94a3b8)' }}>
              {currentXP} / {nextLevelXP} XP to next level
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
              {totalXP} XP
            </span>
          </div>
        </div>

        {/* XP progress bar */}
        <div
          style={{
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              borderRadius: '3px',
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
        <div
          style={{
            fontSize: '0.65rem',
            color: 'var(--text-muted, #64748b)',
            marginTop: '6px',
            textAlign: 'right',
          }}
        >
          {progress}% towards Level {level + 1}
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <StatCard
          icon={<CheckCircle2 size={16} />}
          label="Problems Solved"
          value={solvedProblems.length}
          color="#22c55e"
        />
        <StatCard
          icon={<Flame size={16} />}
          label="Day Streak"
          value={`${streak}🔥`}
          color="#f97316"
        />
        <StatCard
          icon={<Star size={16} />}
          label="Best Topic"
          value={stats.topTopic ? stats.topTopic[0] : '—'}
          color="#f59e0b"
          small
        />
        <StatCard
          icon={<Target size={16} />}
          label="Hard Solved"
          value={stats.hard}
          color="#ef4444"
        />
      </div>

      {/* ── Difficulty Breakdown ── */}
      <div
        style={{
          padding: '14px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-secondary, #94a3b8)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <BarChart3 size={13} />
          DIFFICULTY BREAKDOWN
        </div>
        {[
          { label: 'Easy', count: stats.easy, color: getDifficultyColor(DIFFICULTY.EASY) },
          { label: 'Medium', count: stats.medium, color: getDifficultyColor(DIFFICULTY.MEDIUM) },
          { label: 'Hard', count: stats.hard, color: getDifficultyColor(DIFFICULTY.HARD) },
        ].map(({ label, count, color }) => {
          const pct =
            solvedProblems.length > 0
              ? Math.round((count / solvedProblems.length) * 100)
              : 0;
          return (
            <div key={label} style={{ marginBottom: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                  fontSize: '0.73rem',
                }}
              >
                <span style={{ color }}>{label}</span>
                <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>
                  {count} solved
                </span>
              </div>
              <div
                style={{
                  height: '5px',
                  borderRadius: '3px',
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    borderRadius: '3px',
                    background: color,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Recent Activity ── */}
      {solvedProblems.length > 0 && (
        <div
          style={{
            padding: '14px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary, #94a3b8)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Code2 size={13} />
            RECENT ACTIVITY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[...solvedProblems]
              .sort((a, b) => b.solvedAt - a.solvedAt)
              .slice(0, 5)
              .map((p) => (
                <div
                  key={`${p.id}-${p.solvedAt}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <CheckCircle2
                    size={14}
                    style={{ color: getDifficultyColor(p.difficulty), flexShrink: 0 }}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontSize: '0.78rem',
                      color: 'var(--text-primary, #f1f5f9)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: '#f59e0b',
                      fontWeight: 600,
                    }}
                  >
                    +{p.xpEarned ?? 0} XP
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: 'var(--text-muted, #64748b)',
                    }}
                  >
                    {p.solvedAt ? formatDate(p.solvedAt) : ''}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {solvedProblems.length === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '32px 16px',
            color: 'var(--text-muted, #64748b)',
            textAlign: 'center',
          }}
        >
          <Trophy size={32} style={{ opacity: 0.3 }} />
          <p style={{ margin: 0, fontSize: '0.82rem' }}>
            No problems solved yet. Start coding to earn XP and level up!
          </p>
        </div>
      )}

      {/* ── Badges row ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {level >= 2 && <Badge icon="🏅" label="Beginner" />}
        {level >= 5 && <Badge icon="⚡" label="Speedster" />}
        {stats.hard >= 1 && <Badge icon="🔥" label="Hard Mode" />}
        {streak >= 3 && <Badge icon="🌟" label="On a Roll" />}
        {solvedProblems.length >= 10 && <Badge icon="🎯" label="Consistent" />}
        {stats.easy + stats.medium + stats.hard >= 5 && <Badge icon="💪" label="Grinder" />}
      </div>
    </div>
  );
}

/**
 * Small statistic card sub-component.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element.
 * @param {string} props.label - Card label.
 * @param {string|number} props.value - Displayed value.
 * @param {string} props.color - Accent color.
 * @param {boolean} [props.small] - If true, uses smaller font for the value.
 * @returns {React.JSX.Element}
 */
function StatCard({ icon, label, value, color, small }) {
  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ color, display: 'flex', alignItems: 'center', gap: '5px' }}>
        {icon}
        <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary, #94a3b8)' }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: small ? '0.78rem' : '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary, #f1f5f9)',
          lineHeight: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Badge chip sub-component for earned achievements.
 *
 * @param {Object} props
 * @param {string} props.icon - Emoji icon.
 * @param {string} props.label - Badge label.
 * @returns {React.JSX.Element}
 */
function Badge({ icon, label }) {
  return (
    <div
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '20px',
        background: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        fontSize: '0.7rem',
        color: '#a5b4fc',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
