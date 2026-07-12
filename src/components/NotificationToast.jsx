// src/components/NotificationToast.jsx
// Animated toast notification system with auto-dismiss and stacking

import React, { useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * @typedef {'success'|'error'|'warning'|'info'} ToastType
 */

/**
 * @typedef {Object} Toast
 * @property {string} id - Unique toast identifier.
 * @property {ToastType} type - Visual type of the toast.
 * @property {string} title - Short bold title.
 * @property {string} [message] - Optional longer description.
 * @property {number} [duration=4000] - Auto-dismiss delay in ms (0 = no auto-dismiss).
 */

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 0.25)',
  },
  error: {
    icon: XCircle,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.25)',
  },
  warning: {
    icon: AlertTriangle,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.25)',
  },
  info: {
    icon: Info,
    color: '#818cf8',
    bg: 'rgba(129, 140, 248, 0.1)',
    border: 'rgba(129, 140, 248, 0.25)',
  },
};

/**
 * Individual toast item that auto-dismisses after `duration` ms.
 *
 * @param {Object} props
 * @param {Toast} props.toast - Toast data object.
 * @param {Function} props.onDismiss - Callback to remove this toast by ID.
 * @returns {React.JSX.Element}
 */
function ToastItem({ toast, onDismiss }) {
  const config = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.info;
  const Icon = config.icon;

  useEffect(() => {
    if (!toast.duration && toast.duration !== 0) {
      // Default 4 seconds
      const timer = setTimeout(() => onDismiss(toast.id), 4000);
      return () => clearTimeout(timer);
    }
    if (toast.duration > 0) {
      const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 14px',
        borderRadius: '10px',
        background: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        minWidth: '260px',
        maxWidth: '360px',
        animation: 'toast-in 0.25s ease',
        fontFamily: 'var(--font-sans, Inter, sans-serif)',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(40px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
      `}</style>

      {/* Icon */}
      <Icon size={18} style={{ color: config.color, flexShrink: 0, marginTop: '1px' }} />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-primary, #f1f5f9)',
            marginBottom: toast.message ? '3px' : 0,
          }}
        >
          {toast.title}
        </div>
        {toast.message && (
          <div
            style={{
              fontSize: '0.73rem',
              color: 'var(--text-secondary, #94a3b8)',
              lineHeight: 1.4,
            }}
          >
            {toast.message}
          </div>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted, #64748b)',
          cursor: 'pointer',
          padding: '2px',
          flexShrink: 0,
          borderRadius: '4px',
          display: 'flex',
        }}
      >
        <X size={14} />
      </button>

      {/* Progress bar for auto-dismiss */}
      {(toast.duration === undefined || toast.duration > 0) && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            borderRadius: '0 0 10px 10px',
            background: config.color,
            opacity: 0.5,
            animation: `toast-progress ${toast.duration ?? 4000}ms linear forwards`,
            transformOrigin: 'left',
          }}
        />
      )}
      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

/**
 * Toast container that renders all active toasts stacked in the bottom-right corner.
 *
 * @param {Object} props
 * @param {Toast[]} props.toasts - Array of active toast objects.
 * @param {Function} props.onDismiss - Callback to dismiss a toast by ID.
 * @returns {React.JSX.Element|null}
 */
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'all' }}>
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

/**
 * Custom hook that manages a list of active toast notifications.
 * Returns the toast list and imperative methods to add/dismiss toasts.
 *
 * @returns {{
 *   toasts: Toast[],
 *   toast: Function,
 *   dismiss: Function,
 *   dismissAll: Function,
 * }}
 *
 * @example
 * const { toasts, toast, dismiss } = useToast();
 * toast.success('All tests passed!', 'Your solution is correct.');
 */
export function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const add = useCallback((type, title, message, duration) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev.slice(-4), { id, type, title, message, duration }]);
    return id;
  }, []);

  const toast = {
    success: (title, message, duration) => add('success', title, message, duration),
    error:   (title, message, duration) => add('error',   title, message, duration),
    warning: (title, message, duration) => add('warning', title, message, duration),
    info:    (title, message, duration) => add('info',    title, message, duration),
  };

  return { toasts, toast, dismiss, dismissAll };
}
