import React from 'react';
import Input from './Input';
import Icon from '../AppIcon';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Zoeken...", 
  className = "",
  onClear,
  ...props 
}) => {
  const handleClear = () => {
    onChange?.({ target: { value: '' } });
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name="Search" size={16} className="text-muted-foreground" />
      </div>
      
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-10"
        {...props}
      />
      
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground text-muted-foreground nav-transition"
        >
          <Icon name="X" size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;