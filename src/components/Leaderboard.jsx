// src/components/Leaderboard.jsx
// Student leaderboard panel showing XP rankings, badges, and comparative stats

import React, { useMemo, useState } from 'react';
import {
  Trophy, Medal, Crown, Star, TrendingUp,
  Flame, ChevronUp, ChevronDown, Minus
} from 'lucide-react';
import { calculateLevel, getDifficultyColor } from '../utils/helpers';

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} id - Unique user ID.
 * @property {string} name - Display name.
 * @property {string} [email] - Email (used for avatar initial fallback).
 * @property {number} xp - Total XP accumulated.
 * @property {number} solved - Total problems solved.
 * @property {number} streak - Current day streak.
 * @property {number} [rank] - Previous rank for change indicator.
 */

/** Mock leaderboard dataset for demo purposes */
const MOCK_LEADERBOARD = [
  { id: 'u1', name: 'Ananya Sharma',  xp: 1240, solved: 38, streak: 14 },
  { id: 'u2', name: 'Ravi Mehta',     xp: 980,  solved: 29, streak: 7  },
  { id: 'u3', name: 'Priya Nair',     xp: 870,  solved: 25, streak: 21 },
  { id: 'u4', name: 'Kabir Singh',    xp: 760,  solved: 22, streak: 5  },
  { id: 'u5', name: 'Divya Patel',    xp: 640,  solved: 18, streak: 3  },
  { id: 'u6', name: 'Arjun Verma',    xp: 530,  solved: 15, streak: 9  },
  { id: 'u7', name: 'Sneha Gupta',    xp: 420,  solved: 12, streak: 2  },
  { id: 'u8', name: 'Rohan Das',      xp: 310,  solved: 9,  streak: 1  },
  { id: 'u9', name: 'Meera Iyer',     xp: 200,  solved: 5,  streak: 4  },
  { id: 'u10', name: 'Aditya Kumar',  xp: 90,   solved: 2,  streak: 0  },
];

/**
 * @typedef {'xp'|'solved'|'streak'} SortKey
 */

const RANK_ICONS = [
  <Crown key={1} size={16} style={{ color: '#f59e0b' }} />,
  <Medal key={2} size={16} style={{ color: '#94a3b8' }} />,
  <Medal key={3} size={16} style={{ color: '#cd7c2f' }} />,
];

/**
 * Leaderboard component displaying ranked student performance data.
 * Supports sorting by XP, problems solved, or streak.
 * Highlights the current user's row.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.user - The currently authenticated user.
 * @param {number} [props.userXP=0] - The current user's total XP.
 * @param {number} [props.userSolved=0] - The current user's solved count.
 * @param {number} [props.userStreak=0] - The current user's streak.
 * @param {LeaderboardEntry[]} [props.entries] - Optional custom leaderboard data (defaults to mock).
 * @returns {React.JSX.Element} The leaderboard panel UI.
 */
export default function Leaderboard({
  user,
  userXP = 0,
  userSolved = 0,
  userStreak = 0,
  entries,
}) {
  const [sortBy, setSortBy] = useState('xp');

  // Merge current user into leaderboard
  const allEntries = useMemo(() => {
    const base = entries ?? MOCK_LEADERBOARD;
    const userEntry = {
      id: 'current-user',
      name: user?.name ?? 'You',
      email: user?.email,
      xp: userXP,
      solved: userSolved,
      streak: userStreak,
      isCurrentUser: true,
    };

    // Replace placeholder if user already exists
    const withoutUser = base.filter((e) => e.id !== 'current-user');
    return [...withoutUser, userEntry];
  }, [entries, user, userXP, userSolved, userStreak]);

  const sorted = useMemo(() => {
    return [...allEntries].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [allEntries, sortBy]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Trophy size={16} style={{ color: '#f59e0b' }} />
          <span
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-primary, #f1f5f9)',
            }}
          >
            Leaderboard
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.65rem',
              padding: '2px 8px',
              borderRadius: '20px',
              background: 'rgba(245,158,11,0.12)',
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.2)',
            }}
          >
            This Week
          </span>
        </div>

        {/* Sort tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { key: 'xp',     label: '⚡ XP'      },
            { key: 'solved', label: '✅ Solved'   },
            { key: 'streak', label: '🔥 Streak'   },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: `1px solid ${sortBy === key ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                background: sortBy === key ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: sortBy === key ? '#818cf8' : 'var(--text-muted, #64748b)',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: sortBy === key ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Entries ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        {sorted.map((entry, index) => {
          const rank = index + 1;
          const level = calculateLevel(entry.xp);
          const isUser = entry.isCurrentUser;

          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 10px',
                borderRadius: '10px',
                marginBottom: '4px',
                background: isUser
                  ? 'rgba(99,102,241,0.12)'
                  : 'rgba(255,255,255,0.02)',
                border: isUser
                  ? '1px solid rgba(99,102,241,0.3)'
                  : '1px solid transparent',
                transition: 'background 0.15s',
              }}
            >
              {/* Rank */}
              <div
                style={{
                  width: '24px',
                  textAlign: 'center',
                  flexShrink: 0,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color:
                    rank === 1
                      ? '#f59e0b'
                      : rank === 2
                      ? '#94a3b8'
                      : rank === 3
                      ? '#cd7c2f'
                      : 'var(--text-muted, #64748b)',
                }}
              >
                {rank <= 3 ? RANK_ICONS[rank - 1] : `#${rank}`}
              </div>

              {/* Avatar */}
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: isUser
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                    : `hsl(${(entry.name.charCodeAt(0) * 37) % 360}, 60%, 40%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                  boxShadow: isUser ? '0 0 12px rgba(99,102,241,0.35)' : 'none',
                }}
              >
                {(entry.name ?? 'U').charAt(0).toUpperCase()}
              </div>

              {/* Name + level */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: isUser ? 700 : 500,
                    color: isUser ? '#a5b4fc' : 'var(--text-primary, #f1f5f9)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.name}
                  {isUser && (
                    <span style={{ marginLeft: '6px', fontSize: '0.65rem', opacity: 0.7 }}>
                      (you)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted, #64748b)' }}>
                  Lv.{level} • {entry.streak}🔥 streak
                </div>
              </div>

              {/* Stats */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: sortBy === 'xp' ? '#f59e0b' : 'var(--text-primary, #f1f5f9)',
                  }}
                >
                  {sortBy === 'xp'
                    ? `${entry.xp} XP`
                    : sortBy === 'solved'
                    ? `${entry.solved} ✅`
                    : `${entry.streak} 🔥`}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted, #64748b)' }}>
                  {sortBy === 'xp'
                    ? `${entry.solved} solved`
                    : `${entry.xp} XP`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
