import React, { useEffect } from 'react';
import Routes from './Routes';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    // Ensure theme is applied on app initialization
    const savedTheme = localStorage.getItem('familybudget-theme');
    if (savedTheme) {
      const root = document.documentElement;
      let finalTheme = savedTheme;
      
      if (savedTheme === 'auto') {
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')?.matches;
        finalTheme = systemPrefersDark ? 'dark' : 'light';
      }
      
      root.classList?.remove('light', 'dark');
      root.classList?.add(finalTheme);
      root.setAttribute('data-theme', finalTheme);
      root.setAttribute('data-applied-theme', finalTheme);
    }
  }, []);

  return <Routes />;
}

export default App;