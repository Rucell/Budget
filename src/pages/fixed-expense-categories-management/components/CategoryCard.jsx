import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CategoryCard = ({ 
  category, 
  usage = 0, 
  isSelected = false, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  const handleEdit = (e) => {
    e?.stopPropagation();
    onEdit?.(category);
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    onDelete?.(category?.id);
  };

  const handleSelect = (e) => {
    e?.stopPropagation();
    onSelect?.(!isSelected);
  };

  const isDefault = ['housing', 'insurance', 'transport', 'subscriptions', 'food', 'healthcare', 'debt', 'other']?.includes(category?.id);

  return (
    <div 
      className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer relative ${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-100 hover:border-gray-200'
      }`}
      onClick={handleSelect}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 right-4">
        <Checkbox
          checked={isSelected}
          onChange={handleSelect}
          className="text-indigo-600"
        />
      </div>

      {/* Category Icon */}
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: `${category?.color}20` }}
      >
        <Icon 
          name={category?.icon || 'Tag'} 
          size={24} 
          style={{ color: category?.color }}
        />
      </div>

      {/* Category Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-900">{category?.name}</h3>
          {isDefault && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Standaard
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3">
          {category?.description || 'Geen beschrijving'}
        </p>
        <div className="text-sm text-gray-500">
          <span className="font-medium">{usage}</span> uitgaven
        </div>
      </div>

      {/* Usage Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: category?.color,
            width: usage > 0 ? `${Math.min((usage / 10) * 100, 100)}%` : '0%'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          onClick={handleEdit}
          variant="outline"
          size="sm"
          iconName="Edit2"
          className="flex-1 text-gray-600 hover:text-gray-900"
        >
          Bewerken
        </Button>
        {!isDefault && (
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            iconName="Trash2"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;