import React from 'react';
import Button from './Button';
import Icon from '../AppIcon';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = ({ variant = 'ghost', size = 'sm', showLabel = false, className = '' }) => {
  const { theme, toggleTheme, setThemeMode, isDark } = useTheme();

  if (showLabel) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant={variant}
          size={size}
          onClick={() => setThemeMode('light')}
          className={theme === 'light' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Icon name="Sun" size={16} />
          {showLabel && <span className="ml-2">Light</span>}
        </Button>
        
        <Button
          variant={variant}
          size={size}
          onClick={() => setThemeMode('dark')}
          className={theme === 'dark' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Icon name="Moon" size={16} />
          {showLabel && <span className="ml-2">Dark</span>}
        </Button>
        
        <Button
          variant={variant}
          size={size}
          onClick={() => setThemeMode('auto')}
          className={theme === 'auto' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Icon name="Monitor" size={16} />
          {showLabel && <span className="ml-2">Auto</span>}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={className}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Icon name={isDark ? 'Sun' : 'Moon'} size={16} />
    </Button>
  );
};

export default ThemeToggle;