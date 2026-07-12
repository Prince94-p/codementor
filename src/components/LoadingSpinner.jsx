// src/components/LoadingSpinner.jsx
// Reusable animated loading spinner with size and label variants

import React from 'react';

/**
 * @typedef {'sm'|'md'|'lg'|'xl'} SpinnerSize
 */

const SIZE_MAP = {
  sm: { outer: 20, border: 2, label: '0.7rem' },
  md: { outer: 32, border: 3, label: '0.8rem' },
  lg: { outer: 48, border: 4, label: '0.9rem' },
  xl: { outer: 64, border: 5, label: '1rem' },
};

/**
 * Animated circular loading spinner component.
 * Uses a pure CSS border-based animation with no external dependencies.
 *
 * @param {Object} props - Component properties.
 * @param {SpinnerSize} [props.size='md'] - Spinner size variant.
 * @param {string} [props.color='var(--primary-light, #818cf8)'] - Spinner accent color.
 * @param {string} [props.label] - Optional accessible label shown below the spinner.
 * @param {boolean} [props.fullScreen=false] - If true, centers the spinner in the full viewport.
 * @param {boolean} [props.overlay=false] - If true, renders a semi-transparent overlay behind it.
 * @returns {React.JSX.Element} The loading spinner.
 *
 * @example
 * <LoadingSpinner size="lg" label="Compiling..." />
 */
export default function LoadingSpinner({
  size = 'md',
  color = 'var(--primary-light, #818cf8)',
  label,
  fullScreen = false,
  overlay = false,
}) {
  const { outer, border, label: labelSize } = SIZE_MAP[size] ?? SIZE_MAP.md;

  const spinner = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* Spinner ring */}
      <div
        style={{
          width: outer,
          height: outer,
          borderRadius: '50%',
          border: `${border}px solid rgba(255,255,255,0.1)`,
          borderTopColor: color,
          animation: 'codementor-spin 0.75s linear infinite',
          flexShrink: 0,
        }}
      />

      {/* Inline keyframes injected once */}
      <style>{`
        @keyframes codementor-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Label */}
      {label && (
        <span
          style={{
            fontSize: labelSize,
            color: 'var(--text-secondary, #94a3b8)',
            fontFamily: 'var(--font-sans, Inter, sans-serif)',
            animation: 'codementor-pulse 1.4s ease-in-out infinite',
          }}
        >
          {label}
        </span>
      )}
      <style>{`
        @keyframes codementor-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        role="status"
        aria-label={label ?? 'Loading'}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: overlay ? 'rgba(0,0,0,0.5)' : 'transparent',
          backdropFilter: overlay ? 'blur(4px)' : 'none',
          zIndex: 9999,
        }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label={label ?? 'Loading'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {spinner}
    </div>
  );
}

/**
 * Inline loading dots animation — alternative to the spinner for inline use.
 *
 * @param {Object} props
 * @param {string} [props.color='var(--primary-light, #818cf8)'] - Dot color.
 * @param {number} [props.size=6] - Dot diameter in pixels.
 * @returns {React.JSX.Element}
 */
export function LoadingDots({ color = 'var(--primary-light, #818cf8)', size = 6 }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ display: 'inline-flex', gap: size / 2, alignItems: 'center' }}
    >
      <style>{`
        @keyframes codementor-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            display: 'inline-block',
            animation: `codementor-bounce 1.2s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
