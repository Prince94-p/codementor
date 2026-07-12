import React, { useState } from 'react';
import { addSavedProblem, getProfile } from '../data/userProfile';
import { problems } from '../data/mockData';
import { useAuth } from '../auth/AuthContext';

/**
 * ProblemGenerator Component
 * A random problem generation panel that allows students to pick random challenges
 * and save them to their local user profiles.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.language - The active language context.
 * @returns {React.JSX.Element} The ProblemGenerator workspace module.
 */
export default function ProblemGenerator({ language }) {
  const { user } = useAuth();
  const [generated, setGenerated] = useState(null);

  /**
   * Triggers generation of a random coding challenge.
   * Saves the generated problem to the user's saved list.
   * 
   * @returns {void}
   */
  const generate = () => {
    // Pick a random problem from mock data
    const prob = problems[Math.floor(Math.random() * problems.length)];
    const timestamp = new Date().toISOString();
    const saved = {
      id: `${prob.id}-${timestamp}`,
      title: prob.title,
      description: prob.description,
      language,
      timestamp,
    };
    addSavedProblem(user?.email, saved);
    setGenerated(saved);
  };

  /**
   * Renders the list of saved problems.
   * 
   * @returns {React.ReactNode[]} Array of rendered saved problem items.
   */
  const viewSaved = () => {
    const saved = getProfile(user?.email).savedProblems;
    return saved.map(p => (
      <div key={p.id} style={{ marginBottom: '8px', background: 'rgba(15,23,42,0.3)', padding: '8px', borderRadius: '6px' }}>
        <strong>{p.title}</strong> ({p.language})<br/>
        <small>{p.timestamp}</small>
        <p style={{ marginTop: '4px' }}>{p.description}</p>
      </div>
    ));
  };

  return (
    <div style={{ padding: '16px' }}>
      <button className="btn-primary" onClick={generate} style={{ marginBottom: '12px' }}>
        Generate Random Problem
      </button>
      {generated && (
        <div style={{ marginTop: '12px', background: 'rgba(99,102,241,0.1)', padding: '12px', borderRadius: '6px' }}>
          <h4>{generated.title}</h4>
          <p>{generated.description}</p>
          <small>Saved to your profile.</small>
        </div>
      )}
      <hr style={{ margin: '20px 0' }} />
      <h4>Saved Problems</h4>
      {viewSaved()}
    </div>
  );
}
