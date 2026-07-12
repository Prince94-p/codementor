import React, { useState } from 'react';
import { 
  Sparkles, Lightbulb, CheckSquare, BarChart2, BookOpen, 
  ListTodo, Key, ShieldCheck, Briefcase, Eye, ChevronRight,
  TrendingDown, ShieldAlert, Award
} from 'lucide-react';

export default function AgentPanel({ 
  data, 
  language,
  hintsUnlocked, 
  onUnlockHint,
  solutionUnlocked, 
  onUnlockSolution,
  activeTab,
  setActiveTab
}) {
  const [teacherLevel, setTeacherLevel] = useState('beginner');

  const tabs = [
    { id: 'analyzer', label: 'Analyzer', icon: Sparkles, color: 'var(--primary-light)' },
    { id: 'hints', label: 'Hints', icon: Lightbulb, color: 'var(--warning)' },
    { id: 'reviewer', label: 'Reviewer', icon: CheckSquare, color: 'var(--danger)' },
    { id: 'complexity', label: 'Complexity', icon: BarChart2, color: 'var(--accent)' },
    { id: 'teacher', label: 'Teacher', icon: BookOpen, color: 'var(--secondary)' },
    { id: 'testcases', label: 'Tests', icon: ListTodo, color: '#22c55e' },
    { id: 'solution', label: 'Solution', icon: Key, color: '#f43f5e' },
    { id: 'plagiarism', label: 'Authenticity', icon: ShieldCheck, color: '#e2e8f0' },
    { id: 'coach', label: 'Coach', icon: Briefcase, color: '#3b82f6' }
  ];

  if (!data) {
    return (
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
        Loading agent insights...
      </div>
    );
  }

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Agent Panel Tabs */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        background: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '14px 18px',
                background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${tab.color}` : '2px solid transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={14} style={{ color: isActive ? tab.color : 'var(--text-secondary)' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Agent Content Workspace */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        
        {/* AGENT 1: QUESTION ANALYZER */}
        {activeTab === 'analyzer' && (
          <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Agent 1: Question Analyzer</h3>
              <span className={`tag ${data.analyzer.difficulty === 'Easy' ? 'tag-easy' : data.analyzer.difficulty === 'Medium' ? 'tag-medium' : 'tag-hard'}`}>
                {data.analyzer.difficulty}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Topic</strong>
                <p style={{ fontSize: '0.95rem', marginTop: '4px' }}>{data.analyzer.topic}</p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Key Concepts Required</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {data.analyzer.concepts.map((concept, i) => (
                    <span key={i} style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--primary-light)' }}>
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '16px', borderRadius: '8px', marginTop: '8px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontSize: '0.9rem', marginBottom: '10px' }}>
                  <ShieldAlert size={16} /> Common Beginner Pitfalls
                </h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  {data.analyzer.mistakes.map((mistake, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>{mistake}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* AGENT 2: HINT GENERATOR */}
        {activeTab === 'hints' && (
          <div className="animate-slide-up">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>Agent 2: Hint Generator</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Solve the problem step-by-step! Request clues progressively to help you figure it out.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Hint Level 1 (Always Visible) */}
              <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--warning)', textTransform: 'uppercase' }}>Hint Level 1: Initial Clue</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlocked</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{data.hints[1]}</p>
              </div>

              {/* Hint Level 2 */}
              {hintsUnlocked >= 2 ? (
                <div className="animate-slide-up" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--warning)', textTransform: 'uppercase' }}>Hint Level 2: Algorithmic Approach</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlocked</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{data.hints[2]}</p>
                </div>
              ) : (
                <button 
                  className="btn-secondary" 
                  onClick={() => onUnlockHint(2)}
                  style={{ justifyContent: 'center', borderStyle: 'dashed', padding: '16px' }}
                >
                  <Eye size={14} /> Request Hint Level 2 (Detailed Guidance)
                </button>
              )}

              {/* Hint Level 3 */}
              {hintsUnlocked >= 3 ? (
                <div className="animate-slide-up" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--warning)', textTransform: 'uppercase' }}>Hint Level 3: Code Blueprint</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unlocked</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{data.hints[3]}</p>
                </div>
              ) : hintsUnlocked >= 2 ? (
                <button 
                  className="btn-secondary animate-slide-up" 
                  onClick={() => onUnlockHint(3)}
                  style={{ justifyContent: 'center', borderStyle: 'dashed', padding: '16px' }}
                >
                  <Eye size={14} /> Request Hint Level 3 (Final Blueprint)
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* AGENT 3: CODE REVIEWER */}
        {activeTab === 'reviewer' && (
          <div className="animate-slide-up">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>Agent 3: Code Reviewer</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Scanning your code for syntax issues, logic gaps, runtime crashes, and smells.
            </p>

            {data.reviewer.length === 0 ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                <CheckSquare size={32} style={{ color: 'var(--success)', marginBottom: '8px' }} />
                <h4 style={{ color: 'var(--success)', fontWeight: '600', marginBottom: '4px' }}>No major bugs detected!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your code syntax is clean and structured. Try running tests next!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.reviewer.map((item, i) => (
                  <div 
                    key={i} 
                    style={{
                      background: 'rgba(15, 23, 42, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderLeft: `4px solid ${item.severity === 'Critical' || item.severity === 'Major' ? 'var(--danger)' : 'var(--warning)'}`,
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{item.issue}</span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: '600', 
                        textTransform: 'uppercase',
                        color: item.severity === 'Critical' || item.severity === 'Major' ? 'var(--danger)' : 'var(--warning)',
                        background: item.severity === 'Critical' || item.severity === 'Major' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {item.severity} severity
                      </span>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Problematic Line:</strong>
                        <pre style={{ background: '#080b11', padding: '8px 12px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f8fafc', marginTop: '4px', overflowX: 'auto' }}>
                          {item.line}
                        </pre>
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Why it happens:</strong>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.why}</p>
                      </div>
                      <div style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                        <strong style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Suggested Fix:</strong>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px' }}>{item.fix}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AGENT 4: COMPLEXITY ANALYZER */}
        {activeTab === 'complexity' && (
          <div className="animate-slide-up">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>Agent 4: Complexity Analyzer</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {/* Time Complexity Card */}
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Time Complexity</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>{data.complexity.current.time}</span>
                  {data.complexity.current.time !== data.complexity.optimal.time && (
                    <span style={{ color: 'var(--success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                      <TrendingDown size={14} style={{ marginRight: '2px' }} /> Optimal is {data.complexity.optimal.time}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.5' }}>
                  {data.complexity.current.reason}
                </p>
              </div>

              {/* Space Complexity Card */}
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Space Complexity</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>{data.complexity.current.space}</span>
                  {data.complexity.current.space !== data.complexity.optimal.space && (
                    <span style={{ color: 'var(--warning)', fontSize: '0.85rem' }}>
                      Optimal: {data.complexity.optimal.space}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.5' }}>
                  {data.complexity.current.reason}
                </p>
              </div>
            </div>

            {/* Complexity Table */}
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Metric</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Current Code</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Optimal Goal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>⏰ Time Complexity</td>
                    <td style={{ padding: '12px 16px', color: 'var(--danger)' }}>{data.complexity.current.time}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--success)' }}>{data.complexity.optimal.time}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>💾 Space Complexity</td>
                    <td style={{ padding: '12px 16px' }}>{data.complexity.current.space}</td>
                    <td style={{ padding: '12px 16px' }}>{data.complexity.optimal.space}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AGENT 5: TEACHER MODE */}
        {activeTab === 'teacher' && (
          <div className="animate-slide-up">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>Agent 5: Teacher Mode</h3>
            
            {/* Level Toggles */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
              {['beginner', 'intermediate', 'advanced'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setTeacherLevel(lvl)}
                  style={{
                    background: teacherLevel === lvl ? 'var(--primary)' : 'transparent',
                    color: teacherLevel === lvl ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Explanation box */}
            <div 
              className="md-content"
              style={{ 
                background: 'rgba(15, 23, 42, 0.4)', 
                border: '1px solid rgba(255,255,255,0.06)', 
                padding: '20px', 
                borderRadius: '8px',
                lineHeight: '1.6'
              }}
            >
              {teacherLevel === 'beginner' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ color: 'var(--primary-light)', fontSize: '1rem', fontWeight: '600' }}>Beginner Analogy</h4>
                  <div dangerouslySetInnerHTML={{ __html: data.teacher.beginner.replace(/\n/g, '<br/>') }} />
                </div>
              )}
              {teacherLevel === 'intermediate' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ color: 'var(--primary-light)', fontSize: '1rem', fontWeight: '600' }}>Intermediate Mechanics</h4>
                  <div dangerouslySetInnerHTML={{ __html: data.teacher.intermediate.replace(/\n/g, '<br/>') }} />
                </div>
              )}
              {teacherLevel === 'advanced' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ color: 'var(--primary-light)', fontSize: '1rem', fontWeight: '600' }}>Advanced Optimization & Theory</h4>
                  <div dangerouslySetInnerHTML={{ __html: data.teacher.advanced.replace(/\n/g, '<br/>') }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* AGENT 6: TEST CASES */}
        {activeTab === 'testcases' && (
          <div className="animate-slide-up">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>Agent 6: Test Case Generator</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              A robust test suite makes sure code behaves under all edge and stress conditions.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Type</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Input</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Expected Output</th>
                  </tr>
                </thead>
                <tbody>
                  {data.testCases.map((tc, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === data.testCases.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          background: tc.type.includes('Stress') ? 'rgba(239, 68, 68, 0.1)' : tc.type.includes('Edge') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: tc.type.includes('Stress') ? 'var(--danger)' : tc.type.includes('Edge') ? 'var(--warning)' : 'var(--success)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {tc.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{tc.input}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{tc.output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AGENT 7: SOLUTION GENERATOR */}
        {activeTab === 'solution' && (
          <div className="animate-slide-up">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>Agent 7: Solution Generator</h3>

            {!solutionUnlocked ? (
              <div style={{
                background: 'rgba(244, 63, 94, 0.03)',
                border: '1px dashed rgba(244, 63, 94, 0.3)',
                padding: '40px 20px',
                borderRadius: '12px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Key size={40} style={{ color: '#f43f5e', opacity: 0.8 }} />
                <h4 style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Solution Code is Locked</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px', lineHeight: '1.5', margin: '0 auto' }}>
                  We recommend attempting to solve the problem using the Hints and Code Reviewer first! Click below if you want to see the optimal solution.
                </p>
                <button 
                  className="btn-primary" 
                  onClick={onUnlockSolution}
                  style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)', boxShadow: '0 4px 12px rgba(244, 63, 94, 0.25)', marginTop: '8px' }}
                >
                  <Eye size={14} /> Reveal Solution Code
                </button>
              </div>
            ) : (
              <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--success)', marginBottom: '6px' }}>Optimal Approach</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{data.solution.approach}</p>
                </div>

                <div>
                  <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Solution Implementation ({language}):</strong>
                  <pre style={{
                    background: '#080b11',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '16px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: '#e2e8f0',
                    lineHeight: '1.5',
                    marginTop: '6px',
                    overflowX: 'auto'
                  }}>
                    {data.solution.code[language] || data.solution.code['javascript'] || '// Solution template details'}
                  </pre>
                </div>

                <div>
                  <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Code Walkthrough:</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '6px', whiteSpace: 'pre-wrap' }}>
                    {data.solution.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AGENT 8: PLAGIARISM CHECK */}
        {activeTab === 'plagiarism' && (
          <div className="animate-slide-up">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>Agent 8: Authenticity & Plagiarism</h3>
            
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.45)', 
              border: '1px solid rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <Award size={48} style={{ color: 'var(--success)' }} />
              
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Authenticity Evaluation</span>
                <h4 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--success)', marginTop: '4px' }}>
                  {data.plagiarism.score}
                </h4>
              </div>

              <div style={{ width: '100%', maxWidth: '300px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ 
                  width: data.plagiarism.score === 'Likely Original' ? '92%' : data.plagiarism.score === 'Possibly AI Assisted' ? '50%' : '15%', 
                  height: '100%', 
                  background: data.plagiarism.score === 'Likely Original' ? 'var(--success)' : data.plagiarism.score === 'Possibly AI Assisted' ? 'var(--warning)' : 'var(--danger)',
                  borderRadius: '999px' 
                }} />
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '500px' }}>
                {data.plagiarism.reason}
              </p>
            </div>
          </div>
        )}

        {/* AGENT 9: INTERVIEW COACH */}
        {activeTab === 'coach' && (
          <div className="animate-slide-up">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>Agent 9: Interview Coach</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              {/* Readiness Score Card */}
              <div style={{ 
                background: 'rgba(15, 23, 42, 0.5)', 
                border: '1px solid rgba(255, 255, 255, 0.05)', 
                borderRadius: '12px', 
                padding: '20px', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Readiness Score</span>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary-light)' }}>
                  {data.interview.ready ? '85' : '70'}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                  Solid Progress
                </span>
              </div>

              {/* Insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Readability</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px' }}>{data.interview.readability || 'Code is legible, but spacing and logic loops can be refined.'}</p>
                </div>
                <div>
                  <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Maintainability & Complexity</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px' }}>{data.interview.maintainability || 'Avoid nesting loops. Use dictionaries for O(1) checks.'}</p>
                </div>
                <div>
                  <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Naming Conventions</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px' }}>{data.interview.naming || 'Variable naming aligns with algorithmic templates.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
