import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Get theme from localStorage if available, otherwise default to light
    const savedMode = localStorage.getItem('theme-mode');
    return savedMode || 'light';
  });

  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const value = {
    mode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
