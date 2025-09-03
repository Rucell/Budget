import { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = storage?.getTheme();
    return savedTheme || 'light';
  });

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList?.remove('light', 'dark');
    
    if (newTheme === 'dark') {
      root.classList?.add('dark');
      // Set data attribute for additional CSS targeting if needed
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList?.add('light');
      root.setAttribute('data-theme', 'light');
    }
    
    // Store the applied theme for reference
    root.setAttribute('data-applied-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage?.setTheme(newTheme);
    applyTheme(newTheme);
  };

  const setThemeMode = (newTheme) => {
    let finalTheme = newTheme;
    
    if (newTheme === 'auto') {
      // Check system preference
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')?.matches;
      finalTheme = systemPrefersDark ? 'dark' : 'light';
    }
    
    setTheme(newTheme); // Store the actual setting (including 'auto')
    storage?.setTheme(newTheme);
    applyTheme(finalTheme); // Apply the resolved theme
  };

  useEffect(() => {
    // Apply theme on mount
    let finalTheme = theme;
    
    if (theme === 'auto') {
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')?.matches;
      finalTheme = systemPrefersDark ? 'dark' : 'light';
    }
    
    applyTheme(finalTheme);

    // Listen for system theme changes when auto mode is selected
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        applyTheme(e?.matches ? 'dark' : 'light');
      };
      
      if (mediaQuery?.addEventListener) {
        mediaQuery?.addEventListener('change', handleChange);
        return () => mediaQuery?.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery?.addListener(handleChange);
        return () => mediaQuery?.removeListener(handleChange);
      }
    }
  }, [theme]);

  // Calculate isDark based on current applied theme
  const getIsDark = () => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    if (theme === 'auto') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')?.matches;
    }
    return false;
  };

  return {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: getIsDark()
  };
};