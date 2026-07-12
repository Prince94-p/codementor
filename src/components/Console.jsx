import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

/**
 * Console log item structure.
 * @typedef {Object} LogItem
 * @property {'system'|'compile'|'success'|'error'|'warning'} type - The type of log event.
 * @property {string} text - The log message text to display.
 */

/**
 * Console component that displays compiler output, sandboxed execution logs,
 * and test case results in a terminal-like environment.
 * 
 * @param {Object} props - Component properties.
 * @param {LogItem[]} props.logs - Array of log messages to display.
 * @param {Function} props.onClear - Callback function to clear console logs.
 * @param {string} props.language - The active programming language.
 * @returns {React.JSX.Element} The Terminal Console component.
 */
export default function Console({ logs, onClear, language }) {
  const endRef = useRef(null);

  // Auto-scroll to the bottom of the console whenever new logs arrive
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden" style={{ background: '#030712', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      {/* Terminal Title Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: '#0f172a',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
            <Terminal size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              console - {language === 'javascript' ? 'node' : language === 'python' ? 'python3' : 'g++'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={onClear} 
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.7rem'
          }}
          title="Clear Console"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      {/* Terminal Content Screen */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        lineHeight: '1.6',
        color: '#e2e8f0'
      }}>
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '8px' }}>
            <Terminal size={24} style={{ opacity: 0.3 }} />
            <span>Console is empty. Click "Run Code" above to execute.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((log, index) => {
              let color = '#f8fafc';
              let icon = null;

              if (log.type === 'system') color = 'var(--text-muted)';
              else if (log.type === 'compile') color = 'var(--accent)';
              else if (log.type === 'success') {
                color = 'var(--success)';
                icon = <CheckCircle2 size={14} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
              } else if (log.type === 'error') {
                color = 'var(--danger)';
                icon = <XCircle size={14} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
              } else if (log.type === 'warning') {
                color = 'var(--warning)';
                icon = <AlertTriangle size={14} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
              }

              return (
                <div 
                  key={index} 
                  style={{ 
                    color, 
                    borderLeft: log.type === 'error' ? '3px solid var(--danger)' : log.type === 'success' ? '3px solid var(--success)' : 'none',
                    paddingLeft: log.type === 'error' || log.type === 'success' ? '8px' : '0',
                    background: log.type === 'error' ? 'rgba(239, 68, 68, 0.05)' : log.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                    padding: log.type === 'error' || log.type === 'success' ? '6px 8px' : '2px 0',
                    borderRadius: '4px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {icon}
                  {log.text}
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </div>
  );
}
