/**
 * BackgroundContext.jsx — Global Mood Infrastructure
 *
 * Provides a centralized state store for the application's visual 
 * and auditory "mood". Orchestrates data attributes on the DOM root 
 * to enable CSS-driven theme transitions across the entire stack.
 */

import React, { createContext, useContext, useState } from 'react';

// ── Context Definition ─────────────────────────────────────────────────────

const BackgroundContext = createContext();

// ── Provider Component ────────────────────────────────────────────────────

/**
 * BackgroundProvider
 * Wraps the application to provide mood state and persistence logic.
 */
export const BackgroundProvider = ({ children }) => {
  const [mood, setMood] = useState('Good');

  // 📝 Side Effect: Sync mood state with CSS custom properties via data-attributes
  React.useEffect(() => {
    document.documentElement.setAttribute('data-mood', mood.toLowerCase());
  }, [mood]);

  return (
    <BackgroundContext.Provider value={{ mood, setMood }}>
      {children}
    </BackgroundContext.Provider>
  );
};

// ── Custom Hook ───────────────────────────────────────────────────────────

/**
 * useBackground
 * Accesses the global mood state. Throws if used outside of a Provider.
 */
export const useBackground = () => {
  const context = useContext(BackgroundContext);
  
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  
  return context;
};

