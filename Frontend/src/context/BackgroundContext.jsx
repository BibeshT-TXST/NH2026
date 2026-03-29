import React, { createContext, useContext, useState } from 'react';

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
  const [mood, setMood] = useState('Good');

  // Sync mood with data-mood attribute on :root
  React.useEffect(() => {
    document.documentElement.setAttribute('data-mood', mood.toLowerCase());
  }, [mood]);

  return (
    <BackgroundContext.Provider value={{ mood, setMood }}>
      {children}
    </BackgroundContext.Provider>

  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
