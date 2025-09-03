import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, selectedCategories, onCategoryChange }) => {
  const categoryIcons = {
    'Huisvesting': 'Home',
    'Energie & Nutsvoorzieningen': 'Zap',
    'Verzekeringen': 'Shield',
    'Vervoer': 'Car',
    'Abonnementen & Media': 'Tv',
    'Overig': 'MoreHorizontal'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
        <Icon name="Filter" size={16} />
        <span>Categorieën</span>
      </h4>
      <div className="space-y-2">
        {categories?.map((category) => (
          <Checkbox
            key={category}
            label={
              <div className="flex items-center space-x-2">
                <Icon 
                  name={categoryIcons?.[category] || 'Circle'} 
                  size={14} 
                  className="text-muted-foreground" 
                />
                <span className="text-sm">{category}</span>
              </div>
            }
            checked={selectedCategories?.includes(category)}
            onChange={(e) => onCategoryChange(category, e?.target?.checked)}
            className="w-full"
          />
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <button
          onClick={() => onCategoryChange('all', true)}
          className="text-xs text-primary hover:text-primary/80 nav-transition"
        >
          Alles selecteren
        </button>
        <span className="mx-2 text-xs text-muted-foreground">|</span>
        <button
          onClick={() => onCategoryChange('none', false)}
          className="text-xs text-muted-foreground hover:text-foreground nav-transition"
        >
          Alles deselecteren
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;