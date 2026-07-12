import React, { useState, useRef, useEffect } from 'react';
import { Send, GraduationCap, HelpCircle } from 'lucide-react';

/**
 * Message item data structure.
 * @typedef {Object} MessageItem
 * @property {'tutor'|'student'} sender - The sender identity.
 * @property {string} text - Message message body.
 */

/**
 * ChatCompanion Component
 * Renders an interactive sidebar chat interface between the student and CodeMentor AI.
 * Enables quick question templates and captures student chat queries.
 * 
 * @param {Object} props - Component properties.
 * @param {MessageItem[]} props.messages - List of chat messages exchanged.
 * @param {Function} props.onSendMessage - Callback to process and respond to student messages.
 * @param {Object} props.selectedProblem - Config metadata of selected problem challenge.
 * @param {string} props.language - Active compiler programming language.
 * @returns {React.JSX.Element} The ChatCompanion tutor component view.
 */
export default function ChatCompanion({ 
  messages, 
  onSendMessage, 
  selectedProblem, 
  language 
}) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const quickQuestions = [
    { text: 'Explain my code logic', label: '📖 Explain logic' },
    { text: 'How do I optimize this code?', label: '⚡ Ask to optimize' },
    { text: 'Give me another hint', label: '💡 Ask for hint' },
    { text: 'What test case should I try?', label: '🧪 Ask for test cases' }
  ];

  /**
   * Process form submission to send student message.
   * 
   * @param {React.FormEvent} [e] - Form submission event context.
   * @returns {void}
   */
  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  /**
   * Triggers automated query from quick-action button shortcuts.
   * 
   * @param {string} text - The preset quick question string.
   * @returns {void}
   */
  const handleQuickQuestion = (text) => {
    onSendMessage(text);
  };

  // Scroll to bottom of message list on new chat additions
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
      {/* Companion Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '16px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
          borderRadius: '8px', 
          padding: '6px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white'
        }}>
          <GraduationCap size={16} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '600' }}>CodeMentor AI Chat</h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>● Companion Tutor Online</span>
        </div>
      </div>

      {/* Message Feed Area */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'rgba(8, 11, 17, 0.4)'
      }}>
        {messages.map((msg, idx) => {
          const isTutor = msg.sender === 'tutor';
          return (
            <div 
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isTutor ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                alignSelf: isTutor ? 'flex-start' : 'flex-end',
                animation: 'slideUp 0.2s ease forwards'
              }}
            >
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '3px', padding: '0 4px' }}>
                {isTutor ? '🤖 CodeMentor' : '👤 Student'}
              </span>
              <div style={{
                background: isTutor ? 'rgba(15, 23, 42, 0.8)' : 'var(--primary)',
                color: isTutor ? 'var(--text-primary)' : '#ffffff',
                border: isTutor ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                padding: '10px 14px',
                borderRadius: isTutor ? '0px 12px 12px 12px' : '12px 0px 12px 12px',
                fontSize: '0.82rem',
                lineHeight: '1.4',
                whiteSpace: 'pre-line'
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions */}
      <div style={{
        padding: '10px 16px 4px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        background: 'rgba(15, 23, 42, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px' }}>
          <HelpCircle size={10} />
          <span>Quick Questions:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuestion(q.text)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.06)';
                e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                e.target.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.03)';
                e.target.style.borderColor = 'rgba(255,255,255,0.05)';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} style={{
        display: 'flex',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.8)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        gap: '8px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CodeMentor about logic, errors, or complexity..."
          style={{
            flex: 1,
            fontSize: '0.8rem',
            background: 'rgba(0,0,0,0.3)',
            padding: '8px 12px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        />
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ padding: '8px 12px' }}
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
