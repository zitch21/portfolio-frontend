// src/context/ThemeContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('dark');
  const [themeAccent, setThemeAccent] = useState('blue');

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || 'dark';
    const savedAccent = localStorage.getItem('themeAccent') || 'blue';
    
    setThemeMode(savedMode);
    setThemeAccent(savedAccent);
    
    // Apply to document
    document.documentElement.setAttribute('data-mode', savedMode);
    document.documentElement.setAttribute('data-accent', savedAccent);
  }, []);

  // Update theme mode
  const toggleThemeMode = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
    document.documentElement.setAttribute('data-mode', newMode);
  };

  // Update accent color
  const setAccentColor = (accent) => {
    setThemeAccent(accent);
    localStorage.setItem('themeAccent', accent);
    document.documentElement.setAttribute('data-accent', accent);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, themeAccent, toggleThemeMode, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
