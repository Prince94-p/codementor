import React, { useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy, Trash2, FileCode, Check } from 'lucide-react';

/**
 * Editor Component
 * Providing a code playground with synchronized line numbers gutter, copy utility,
 * custom tab spaces key capture, and problem selection controls.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.code - The current source code in workspace.
 * @param {Function} props.onChange - Setter callback function for code state updates.
 * @param {string} props.language - Active compiler language selected.
 * @param {Function} props.onLanguageChange - Callback when switching compiler target language.
 * @param {Object} props.selectedProblem - Currently selected challenge config.
 * @param {Function} props.onProblemChange - Callback when selecting a different challenge.
 * @param {Array<Object>} props.problems - Complete list of active coding problems.
 * @param {Array<Object>} props.languages - List of supported compiler language targets.
 * @param {Function} props.onRun - Callback to execute the sandbox compiler.
 * @param {Function} props.onReset - Callback to reset code workspace back to starter template.
 * @param {boolean} props.isCompiling - Compiling status flag.
 * @returns {React.JSX.Element} The Editor workspace view.
 */
export default function Editor({ 
  code, 
  onChange, 
  language, 
  onLanguageChange, 
  selectedProblem, 
  onProblemChange, 
  problems, 
  languages, 
  onRun, 
  onReset,
  isCompiling
}) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  /**
   * Syncs the scrolling offset of the line numbers gutter with the code textarea.
   * 
   * @returns {void}
   */
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Generate line numbers array matching line feeds
  const lines = code.split('\n');
  const lineNumbers = Array.from({ length: Math.max(lines.length, 1) }, (_, i) => i + 1);

  /**
   * Handles keyboard events inside the code editor area.
   * Intercepts "Tab" key presses to insert space tabulations instead of shifting field focus.
   * 
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e - Keyboard event context.
   * @returns {void}
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);
      
      // Reset cursor position (requires setTimeout to execute after React state updates)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  /**
   * Copies the current code to clipboard buffer.
   * 
   * @returns {Promise<void>}
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="glass-panel active-glow flex flex-col h-full overflow-hidden" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
      {/* Editor Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCode size={18} style={{ color: 'var(--primary-light)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600' }}>
            solution.{languages.find(l => l.id === language)?.ext || 'js'}
          </span>
        </div>
        
        {/* Selectors */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Problem:</label>
            <select 
              value={selectedProblem?.id || 'custom'} 
              onChange={(e) => onProblemChange(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(0,0,0,0.4)' }}
            >
              <option value="custom">✏️ Custom Code Playground</option>
              {problems.map(p => (
                <option key={p.id} value={p.id}>
                  {p.difficulty === 'Easy' ? '🟢' : p.difficulty === 'Medium' ? '🟡' : '🔴'} {p.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Language:</label>
            <select 
              value={language} 
              onChange={(e) => onLanguageChange(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(0,0,0,0.4)' }}
            >
              {languages.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Code Workspace */}
      <div style={{
        display: 'flex',
        flex: 1,
        position: 'relative',
        background: 'rgba(8, 11, 17, 0.95)',
        minHeight: '350px',
        overflow: 'hidden'
      }}>
        {/* Line Numbers Gutter */}
        <div 
          ref={lineNumbersRef}
          style={{
            width: '45px',
            background: 'rgba(15, 23, 42, 0.4)',
            padding: '16px 0',
            textAlign: 'right',
            paddingRight: '12px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            userSelect: 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {lineNumbers.map(n => (
            <div key={n} style={{ height: '22.5px' }}>{n}</div>
          ))}
        </div>

        {/* Text Area Code Editor */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            padding: '16px 16px',
            resize: 'none',
            outline: 'none',
            overflowY: 'auto',
            whiteSpace: 'pre',
            wordWrap: 'normal',
            boxShadow: 'none',
            height: '100%'
          }}
          placeholder="// Type your student code here..."
        />
      </div>

      {/* Editor Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-secondary" 
            onClick={onReset}
            title="Reset to Starter Code"
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={handleCopy}
            title="Copy Code to Clipboard"
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={() => onChange('')}
            title="Clear Workspace"
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>

        <button 
          className="btn-primary" 
          onClick={onRun}
          disabled={isCompiling}
          style={{ padding: '8px 20px', fontSize: '0.85rem', minWidth: '130px' }}
        >
          <Play size={14} fill="currentColor" />
          {isCompiling ? 'Running...' : 'Run Code'}
        </button>
      </div>
    </div>
  );
}
