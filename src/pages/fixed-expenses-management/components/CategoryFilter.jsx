import React from 'react';
import Button from '../../../components/ui/Button';

const CategoryFilter = ({ selectedCategory, onCategoryChange, expenseCounts }) => {
  const categories = [
    { key: 'all', label: 'Alle', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { key: 'Housing', label: 'Wonen', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { key: 'Energy & Utilities', label: 'Energie', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { key: 'Insurance', label: 'Verzekeringen', color: 'bg-green-100 text-green-800 border-green-200' },
    { key: 'Transportation', label: 'Transport', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { key: 'Subscriptions & Media', label: 'Abonnementen', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { key: 'Other', label: 'Overig', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-foreground mb-3">Filter op categorie</h3>
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => {
          const count = category?.key === 'all' 
            ? Object.values(expenseCounts)?.reduce((sum, count) => sum + count, 0)
            : expenseCounts?.[category?.key] || 0;
          
          const isSelected = selectedCategory === category?.key;
          
          return (
            <Button
              key={category?.key}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category?.key)}
              className={`${!isSelected ? category?.color : ''} nav-transition`}
            >
              {category?.label}
              {count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  isSelected 
                    ? 'bg-primary-foreground text-primary' 
                    : 'bg-white bg-opacity-80'
                }`}>
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;