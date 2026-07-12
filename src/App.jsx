import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Console from './components/Console';
import AgentPanel from './components/AgentPanel';
import ChatCompanion from './components/ChatCompanion';
import LoginPage from './components/LoginPage';
import AIProblemGenerator from './components/AIProblemGenerator';
import SavedProblems from './components/SavedProblems';
import DashboardOverview from './components/DashboardOverview';
import ProgressTracker from './components/ProgressTracker';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import { useAuth } from './auth/AuthContext';
import { getProfile, addSolvedProblem } from './data/userProfile';
import { 
  languages, 
  problems, 
  starterCode, 
  agentMockData, 
  analyzeCustomCode 
} from './data/mockData';
import { GraduationCap, Cpu, Sparkles, BookOpen, LogOut, LayoutDashboard, Trophy, TrendingUp, Settings as SettingsIcon, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * App Root Component
 * Handles global authentication state routing. Renders the LoginPage if the user is unauthenticated,
 * otherwise redirects them to the core Dashboard.
 * 
 * @returns {React.JSX.Element} The primary root route.
 */
export default function App() {
  const { user, logout } = useAuth();

  // Show login page when not authenticated
  if (!user) return <LoginPage />;

  return <Dashboard user={user} logout={logout} />;
}

/**
 * Dashboard Container Component
 * The main workspace dashboard containing the code editor, execution terminal console,
 * tutor agents analysis panels, and the companion tutor chatbot.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.user - The currently authenticated user object session.
 * @param {Function} props.logout - Callback to terminate the current session.
 * @returns {React.JSX.Element} The full CodeMentor workspace UI.
 */
function Dashboard({ user, logout }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [profile, setProfile] = useState(() => getProfile(user.email));
  const [language, setLanguage] = useState('javascript');
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [code, setCode] = useState('');
  const [hintsUnlocked, setHintsUnlocked] = useState(1);
  const [solutionUnlocked, setSolutionUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('analyzer');

  // Modal visibility
  const [showGenerator, setShowGenerator] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Console logs state
  const [logs, setLogs] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Chat message companion state
  const [messages, setMessages] = useState([]);

  // AI-generated problems extend the built-in list
  const [aiProblems, setAiProblems] = useState([]);
  const allProblems = [...problems, ...aiProblems];

  const refreshProfile = () => {
    setProfile(getProfile(user.email));
  };

  // Load an AI-generated problem into the editor
  const handleLoadAIProblem = (prob) => {
    const asProblem = {
      id: prob.id,
      title: prob.title,
      description: prob.description,
      difficulty: prob.difficulty,
      topic: prob.topic,
      isAIGenerated: true,
    };
    setAiProblems(prev => {
      if (prev.find(p => p.id === prob.id)) return prev;
      return [...prev, asProblem];
    });
    setSelectedProblem(asProblem);
    setCode(prob.starterCode || '');
    setLogs([{ type: 'system', text: `> Loaded AI problem: ${prob.title}` }]);
    setMessages([{
      sender: 'tutor',
      text: `Let's work on the AI-generated problem: "${prob.title}"!\n\nTopic: ${prob.topic} | Difficulty: ${prob.difficulty}\n\n${prob.description}\n\nHit "Run Code" when ready, or ask me for a hint!`
    }]);
    setCurrentView('playground');
  };

  // Unified problem loader for dashboard click-throughs
  const handleLoadProblem = (prob) => {
    if (prob.isAIGenerated || !problems.some(p => p.id === prob.id)) {
      handleLoadAIProblem(prob);
    } else {
      setSelectedProblem(prob);
      const start = starterCode[language]?.[prob.id] || '';
      setCode(start);
      setLogs([{ type: 'system', text: `> Loaded problem: ${prob.title}` }]);
      setMessages([{
        sender: 'tutor',
        text: `Let's work on "${prob.title}" today.\n\nType some code on the left and hit "Run Code" when you are ready to test it. If you need any direction, just ask me for a hint!`
      }]);
      setCurrentView('playground');
    }
  };

  // Fetch initial template code
  useEffect(() => {
    if (selectedProblem && selectedProblem !== 'custom') {
      const start = starterCode[language]?.[selectedProblem.id] || '';
      setCode(start);
    } else {
      setCode(
        language === 'javascript' 
          ? `// Custom JavaScript Code\nconsole.log("Hello, student!");\n`
          : language === 'python'
          ? `# Custom Python Code\nprint("Hello, student!")\n`
          : `// Custom template\n`
      );
    }
    setHintsUnlocked(1);
    setSolutionUnlocked(false);
    setLogs([]);
    
    // Initialize Chat Welcome Message
    setMessages([
      {
        sender: 'tutor',
        text: `Hi! I'm CodeMentor AI. Let's work on "${selectedProblem === 'custom' ? 'Custom Playground' : selectedProblem.title}" today.\n\nType some code on the left and hit "Run Code" when you are ready to test it. If you need any direction, just ask me for a hint!`
      }
    ]);
  }, [language, selectedProblem]);

  // Compute active agent data based on selection and code analysis
  const getActiveAgentData = () => {
    if (selectedProblem === 'custom') {
      return analyzeCustomCode(code, language);
    }
    // Pre-analyzed data
    const preanalyzed = agentMockData[selectedProblem.id];
    if (!preanalyzed) return analyzeCustomCode(code, language);

    // If they changed the template, merge with dynamic custom analyzer to flag custom mistakes
    const dynamicAnalysis = analyzeCustomCode(code, language);
    return {
      ...preanalyzed,
      reviewer: code.includes('for (let j = 0; j < nums.length; j++)') && language === 'javascript'
        ? preanalyzed.reviewer 
        : dynamicAnalysis.reviewer
    };
  };

  const agentData = getActiveAgentData();

  // Run/compile code simulator
  const handleRun = () => {
    setIsCompiling(true);
    setLogs([
      { type: 'system', text: `> Initializing compiler engine...` },
      { type: 'compile', text: `> Compiling solution.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}...` }
    ]);

    setTimeout(() => {
      // Sandboxed JavaScript Execution
      if (language === 'javascript') {
        const capturedLogs = [];
        const originalLog = console.log;
        
        // Mocked console.log
        const mockLog = (...args) => {
          capturedLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };

        try {
          if (selectedProblem.id === 'two_sum') {
            const runCodeString = `
              ${code}
              try {
                const r1 = twoSum([2, 7, 11, 15], 9);
                const r2 = twoSum([3, 2, 4], 6);
                console.log("👉 Test case 1: twoSum([2, 7, 11, 15], 9) => Output: [" + r1 + "]");
                console.log("👉 Test case 2: twoSum([3, 2, 4], 6) => Output: [" + r2 + "]");
                
                const ok1 = Array.isArray(r1) && r1.includes(0) && r1.includes(1);
                const ok2 = Array.isArray(r2) && r2.includes(1) && r2.includes(2);
                
                if (ok1 && ok2) {
                  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
                  return "SUCCESS";
                } else {
                  console.log("⚠️ TEST FAILED: Incorrect returned values.");
                  if (ok1 && r1.includes(0) && r1.length === 2 && r1[0] === r1[1]) {
                    console.log("💡 Mentor Check: Did you match the same element twice (e.g. nums[0] + nums[0] = 6)? Check your loops index starting points.");
                  }
                  return "FAIL";
                }
              } catch (e) {
                console.log("❌ Execution Error: " + e.message);
                return "ERROR";
              }
            `;
            const fn = new Function('console', runCodeString);
            const status = fn({ log: mockLog });

            const newLogs = [
              { type: 'system', text: `> Initializing sandboxed execution context...` },
              ...capturedLogs.map(l => {
                if (l.includes("SUCCESS")) return { type: 'success', text: l };
                if (l.includes("Error") || l.includes("❌")) return { type: 'error', text: l };
                if (l.includes("FAILED") || l.includes("⚠️")) return { type: 'warning', text: l };
                return { type: 'system', text: l };
              })
            ];
            
            setLogs(prev => [...prev, ...newLogs]);

            if (status === "SUCCESS") {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
              
              const res = addSolvedProblem(user.email, selectedProblem);
              refreshProfile();

              // Mentor congratulations chat
              setMessages(prev => [...prev, {
                sender: 'tutor',
                text: `Awesome job! 🌟 Your JavaScript code passed the Two Sum tests! We verified [2,7,11,15] and [3,2,4] successfully. ${res.newlySolved ? `You earned +${res.xpEarned} XP!` : ''} Check out the Complexity tab to see if your approach is optimal!`
              }]);
            }
          } else if (selectedProblem.id === 'reverse_string') {
            const runCodeString = `
              ${code}
              try {
                let s1 = ["h","e","l","l","o"];
                reverseString(s1);
                console.log("👉 Test case 1: reverseString(['h','e','l','l','o']) => Result: " + JSON.stringify(s1));
                
                const ok1 = JSON.stringify(s1) === JSON.stringify(["o","l","l","e","h"]);
                if (ok1) {
                  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
                  return "SUCCESS";
                } else {
                  console.log("⚠️ TEST FAILED: String not reversed properly.");
                  return "FAIL";
                }
              } catch (e) {
                console.log("❌ Execution Error: " + e.message);
                return "ERROR";
              }
            `;
            const fn = new Function('console', runCodeString);
            const status = fn({ log: mockLog });
            
            setLogs(prev => [
              ...prev,
              { type: 'system', text: `> Initializing sandboxed execution context...` },
              ...capturedLogs.map(l => {
                if (l.includes("SUCCESS")) return { type: 'success', text: l };
                if (l.includes("Error") || l.includes("❌")) return { type: 'error', text: l };
                if (l.includes("FAILED")) return { type: 'warning', text: l };
                return { type: 'system', text: l };
              })
            ]);

            if (status === "SUCCESS") {
              confetti({ particleCount: 80, spread: 60 });
              const res = addSolvedProblem(user.email, selectedProblem);
              refreshProfile();
              setMessages(prev => [...prev, {
                sender: 'tutor',
                text: `Terrific! Your in-place string reversal logic is fully functional and correct! 🎉${res.newlySolved ? ` (+${res.xpEarned} XP earned!)` : ''}`
              }]);
            }
          } else if (selectedProblem.id === 'valid_parentheses') {
            const runCodeString = `
              ${code}
              try {
                const r1 = isValid("()[]{}");
                const r2 = isValid("(]");
                console.log("👉 Test case 1: isValid('()[]{}') => Output: " + r1);
                console.log("👉 Test case 2: isValid('(]') => Output: " + r2);
                
                if (r1 === true && r2 === false) {
                  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
                  return "SUCCESS";
                } else {
                  console.log("⚠️ TEST FAILED: Bracket matching validation returned wrong answers.");
                  return "FAIL";
                }
              } catch (e) {
                console.log("❌ Execution Error: " + e.message);
                return "ERROR";
              }
            `;
            const fn = new Function('console', runCodeString);
            const status = fn({ log: mockLog });
            
            setLogs(prev => [
              ...prev,
              { type: 'system', text: `> Initializing sandboxed execution context...` },
              ...capturedLogs.map(l => {
                if (l.includes("SUCCESS")) return { type: 'success', text: l };
                if (l.includes("Error") || l.includes("❌")) return { type: 'error', text: l };
                if (l.includes("FAILED")) return { type: 'warning', text: l };
                return { type: 'system', text: l };
              })
            ]);

            if (status === "SUCCESS") {
              confetti({ particleCount: 80, spread: 60 });
              const res = addSolvedProblem(user.email, selectedProblem);
              refreshProfile();
              setMessages(prev => [...prev, {
                sender: 'tutor',
                text: `Excellent! Stack verification logic passed cleanly. 🥞${res.newlySolved ? ` (+${res.xpEarned} XP earned!)` : ''}`
              }]);
            }
          } else {
            // Custom JavaScript playground evaluation
            const runCodeString = `
              try {
                ${code}
                console.log("\\n> Program completed execution with return status 0.");
              } catch (e) {
                console.log("❌ Execution Error: " + e.message);
              }
            `;
            const fn = new Function('console', runCodeString);
            fn({ log: mockLog });

            setLogs(prev => [
              ...prev,
              ...capturedLogs.map(l => {
                if (l.includes("❌")) return { type: 'error', text: l };
                return { type: 'system', text: l };
              })
            ]);
          }
        } catch (globalErr) {
          setLogs(prev => [...prev, { type: 'error', text: `❌ Compilation Syntax Error: ${globalErr.message}` }]);
        }

      } else {
        // Simulated execution logs for Python / C++ / Java
        const hasDoubleLoopBug = code.includes('for j in range') || code.includes('for (int j = 0;');
        
        let outputLogs = [];
        if (selectedProblem.id === 'two_sum') {
          outputLogs = [
            { type: 'system', text: `> Running tests in target interpreter environment...` },
            { type: 'system', text: `👉 Test case 1: twoSum([2,7,11,15], 9)` }
          ];

          if (hasDoubleLoopBug) {
            outputLogs.push(
              { type: 'warning', text: `⚠️ Test Failed: twoSum([3,2,4], 6) returned [0, 0] instead of [1, 2]` },
              { type: 'error', text: `❌ Self-matching index detected. Pointer comparison must start at i+1.` }
            );
          } else {
            const res = addSolvedProblem(user.email, selectedProblem);
            refreshProfile();
            outputLogs.push(
              { type: 'success', text: `👉 Result: [0, 1] - Expected: [0, 1] (Passed)` },
              { type: 'success', text: `👉 Test case 2: twoSum([3,2,4], 6) => Result: [1, 2] (Passed)` },
              { type: 'success', text: `🎉 ALL SIMULATED TESTS COMPLETED SUCCESSFULLY!${res.newlySolved ? ` (+${res.xpEarned} XP)` : ''}` }
            );
            confetti({ particleCount: 80, spread: 60 });
          }
        } else {
          outputLogs = [
            { type: 'system', text: `> Compiling source components...` },
            { type: 'success', text: `> Execution finished successfully.\nProcess output:\nHello, student!` }
          ];
        }
        setLogs(prev => [...prev, ...outputLogs]);
      }
      setIsCompiling(false);
    }, 1200);
  };

  // Chat message dynamic responder
  const handleSendMessage = (text) => {
    const newStudentMessage = { sender: 'student', text };
    setMessages(prev => [...prev, newStudentMessage]);

    // Tutor generates educational reply
    setTimeout(() => {
      let replyText = '';
      const lowerText = text.toLowerCase();

      if (lowerText.includes('hint') || lowerText.includes('stuck') || lowerText.includes('help')) {
        if (hintsUnlocked < 3) {
          const nextLvl = hintsUnlocked + 1;
          setHintsUnlocked(nextLvl);
          setActiveTab('hints');
          replyText = `I hear you! I've unlocked **Hint Level ${nextLvl}** for you in the Hints tab on the right. Here it is:\n\n${agentData.hints[nextLvl]}\n\nLet me know if this helps you get unstuck!`;
        } else {
          replyText = `You've unlocked all hints! You can review Hint 3 which provides a complete algorithmic blueprint. If you are still stuck, you can check the "Solution" tab to see the code structure!`;
        }
      } else if (lowerText.includes('complexity') || lowerText.includes('big o') || lowerText.includes('slow') || lowerText.includes('fast')) {
        setActiveTab('complexity');
        replyText = `Your code currently runs with a time complexity of **${agentData.complexity.current.time}** because of nested iterations.\n\nWe can optimize it to **${agentData.complexity.optimal.time}** using a Hash Map structure. Check out the "Complexity" tab on the right for a full visual comparison!`;
      } else if (lowerText.includes('review') || lowerText.includes('bug') || lowerText.includes('wrong') || lowerText.includes('error')) {
        setActiveTab('reviewer');
        if (agentData.reviewer.length > 0) {
          replyText = `I ran a code review check. I detected a **${agentData.reviewer[0].severity} severity issue**: "${agentData.reviewer[0].issue}".\n\n${agentData.reviewer[0].why}\n\nSuggested Fix:\n\`${agentData.reviewer[0].fix}\``;
        } else {
          replyText = `Good news! I scanned your code and did not find any critical compilation or index bugs. Give "Run Code" a try to see if it passes all tests!`;
        }
      } else if (lowerText.includes('optimize') || lowerText.includes('improve')) {
        replyText = `To optimize this code, we want to look at reducing the lookup time. Instead of looking up complements with a nested loop (which is quadratic), we can record values in a Hash Map to locate complements in constant time.\n\nCheck out the "Teacher Mode" tab and toggle to "Intermediate" to read about this exact tradeoff!`;
      } else if (lowerText.includes('test')) {
        setActiveTab('testcases');
        replyText = `I've generated a set of test cases for you in the "Tests" tab. You should test: \n1. Simple arrays.\n2. Duplicates.\n3. Targets that are double an array item (a classic edge case!).`;
      } else if (lowerText.includes('solution') || lowerText.includes('code') || lowerText.includes('reveal')) {
        setActiveTab('solution');
        if (solutionUnlocked) {
          replyText = `The optimal solution code is unlocked! Check out the "Solution" tab on the right to examine it. Try comparing it to your code line-by-line.`;
        } else {
          replyText = `I have the solution ready! Head over to the "Solution" tab on the right and click "Reveal Solution Code" to inspect the code and walkthrough.`;
        }
      } else {
        replyText = `That's a great question! I'm scanning your code for "${selectedProblem === 'custom' ? 'Custom' : selectedProblem.title}".\n\nCould you try explaining what you want your code to do at this step? That way, we can figure out the next line together!`;
      }

      setMessages(prev => [...prev, { sender: 'tutor', text: replyText }]);
    }, 1000);
  };

  const handleProblemChange = (probId) => {
    if (probId === 'custom') {
      setSelectedProblem('custom');
    } else {
      const p = problems.find(x => x.id === probId);
      setSelectedProblem(p);
    }
  };

  const handleResetCode = () => {
    if (selectedProblem && selectedProblem !== 'custom') {
      setCode(starterCode[language]?.[selectedProblem.id] || '');
      setLogs([{ type: 'system', text: `> Editor reset to starter code.` }]);
    } else {
      setCode('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--bg-deep)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      {/* Modals */}
      {showGenerator && (
        <AIProblemGenerator
          language={language}
          onLoadProblem={handleLoadAIProblem}
          onClose={() => setShowGenerator(false)}
        />
      )}
      {showSaved && (
        <SavedProblems
          onLoadProblem={handleLoadAIProblem}
          onClose={() => setShowSaved(false)}
        />
      )}

      {/* Global Dashboard Navigation Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 10,
        gap: '16px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '8px', borderRadius: '10px', display: 'flex',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.35)'
          }}>
            <GraduationCap size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: '700', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              CodeMentor <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '2px 6px', background: 'rgba(99,102,241,0.15)', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.3)', color: 'var(--primary)' }}>AI Tutor</span>
            </h1>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>Pair Programming & Learning Platform</span>
          </div>
        </div>

        {/* Center status */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <Cpu size={12} style={{ color: 'var(--accent)' }} />
            <span>9 AI Agents Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <Sparkles size={12} style={{ color: 'var(--warning)' }} />
            <span>Local Compilers Ready</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            id="open-generator-btn"
            onClick={() => setCurrentView('ai-generator')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              border: 'none', borderRadius: '8px', padding: '7px 14px',
              color: 'white', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(99,102,241,0.35)',
            }}>
            <Sparkles size={13} /> Generate
          </button>
          <button
            id="open-saved-btn"
            onClick={() => setCurrentView('saved-problems')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '7px 14px',
              color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer',
            }}>
            <BookOpen size={13} /> My Problems
          </button>

          {/* User avatar + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '0.8rem', color: 'white',
              boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
            }}>{user.avatar}</div>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</span>
            <button
              id="logout-btn"
              onClick={logout}
              title="Logout"
              style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '8px', padding: '6px 8px', cursor: 'pointer',
                color: '#f87171', display: 'flex', alignItems: 'center',
              }}>
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar + Main Content Layout */}
      <div style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.3) 0%, var(--bg-deep) 100%)'
      }}>
        {/* Navigation Sidebar */}
        <nav style={{
          width: '230px',
          background: 'rgba(15, 23, 42, 0.3)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 12px',
          gap: '8px',
          flexShrink: 0,
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'playground', label: 'Code Workspace', icon: Terminal },
            { id: 'performance', label: 'Progress Hub', icon: TrendingUp },
            { id: 'leaderboard', label: 'Leaderboards', icon: Trophy },
            { id: 'ai-generator', label: 'AI Problem Builder', icon: Sparkles },
            { id: 'saved-problems', label: 'Saved Vault', icon: BookOpen },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? '#a5b4fc' : 'var(--text-secondary)',
                  borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={16} style={{ color: isActive ? '#818cf8' : 'inherit' }} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ marginTop: 'auto', padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.1)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>CURRENT RANK</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fbbf24', display: 'block' }}>🥇 #1 Class</span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
              {profile.totalXP} XP • {profile.solvedProblems.length} Solved
            </span>
          </div>
        </nav>

        {/* View Switcher Window */}
        <div style={{ flex: 1, height: '100%', overflow: 'hidden', position: 'relative' }}>
          {currentView === 'dashboard' && (
            <DashboardOverview 
              user={user}
              totalXP={profile.totalXP}
              streak={profile.streak}
              solvedProblems={profile.solvedProblems}
              problems={allProblems}
              onLoadProblem={handleLoadProblem}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'playground' && (
            <main style={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 0.8fr',
              gap: '16px',
              padding: '16px',
              overflow: 'hidden',
            }}>
              {/* COLUMN 1: Editor & Compiler Terminal Console */}
              <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflow: 'hidden' }}>
                <div style={{ flex: 1.4, overflow: 'hidden' }}>
                  <Editor 
                    code={code}
                    onChange={setCode}
                    language={language}
                    onLanguageChange={setLanguage}
                    selectedProblem={selectedProblem}
                    onProblemChange={handleProblemChange}
                    problems={allProblems}
                    languages={languages}
                    onRun={handleRun}
                    onReset={handleResetCode}
                    isCompiling={isCompiling}
                  />
                </div>
                <div style={{ flex: 0.8, overflow: 'hidden' }}>
                  <Console 
                    logs={logs} 
                    onClear={() => setLogs([])}
                    language={language}
                  />
                </div>
              </section>

              {/* COLUMN 2: Multi-Agent Workspace Insights */}
              <section style={{ height: '100%', overflow: 'hidden' }}>
                <AgentPanel 
                  data={agentData}
                  language={language}
                  hintsUnlocked={hintsUnlocked}
                  onUnlockHint={setHintsUnlocked}
                  solutionUnlocked={solutionUnlocked}
                  onUnlockSolution={() => setSolutionUnlocked(true)}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </section>

              {/* COLUMN 3: AI Chat Companion */}
              <section style={{ height: '100%', overflow: 'hidden' }}>
                <ChatCompanion 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  selectedProblem={selectedProblem}
                  language={language}
                />
              </section>
            </main>
          )}

          {currentView === 'performance' && (
            <ProgressTracker 
              user={user}
              solvedProblems={profile.solvedProblems}
              totalXP={profile.totalXP}
              streak={profile.streak}
            />
          )}

          {currentView === 'leaderboard' && (
            <Leaderboard 
              user={user}
              userXP={profile.totalXP}
              userSolved={profile.solvedProblems.length}
              userStreak={profile.streak}
            />
          )}

          {currentView === 'ai-generator' && (
            <div style={{ height: '100%', overflow: 'hidden' }}>
              <AIProblemGenerator 
                language={language}
                onLoadProblem={handleLoadAIProblem}
                isInline={true}
                onNavigate={setCurrentView}
              />
            </div>
          )}

          {currentView === 'saved-problems' && (
            <div style={{ height: '100%', overflow: 'hidden' }}>
              <SavedProblems 
                onLoadProblem={handleLoadProblem}
                isInline={true}
                onNavigate={setCurrentView}
              />
            </div>
          )}

          {currentView === 'settings' && (
            <Settings 
              user={user}
              logout={logout}
              isInline={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
