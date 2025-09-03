import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/dateUtils';

const VariableExpenseCard = ({ expense, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Groceries': 'ShoppingCart',
      'Boodschappen': 'ShoppingCart',
      'Dining & Entertainment': 'Coffee',
      'Uitgaan & Entertainment': 'Coffee', 
      'Shopping': 'ShoppingBag',
      'Winkelen': 'ShoppingBag',
      'Healthcare': 'Heart',
      'Gezondheid': 'Heart',
      'Travel': 'Plane',
      'Reizen': 'Plane',
      'Personal Care': 'User',
      'Persoonlijke Verzorging': 'User',
      'Other Variable': 'MoreHorizontal',
      'Overige Variabele': 'MoreHorizontal'
    };
    
    return iconMap?.[category] || 'Receipt';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Groceries': 'text-emerald-600 bg-emerald-100',
      'Boodschappen': 'text-emerald-600 bg-emerald-100',
      'Dining & Entertainment': 'text-purple-600 bg-purple-100',
      'Uitgaan & Entertainment': 'text-purple-600 bg-purple-100',
      'Shopping': 'text-pink-600 bg-pink-100', 
      'Winkelen': 'text-pink-600 bg-pink-100',
      'Healthcare': 'text-red-600 bg-red-100',
      'Gezondheid': 'text-red-600 bg-red-100',
      'Travel': 'text-blue-600 bg-blue-100',
      'Reizen': 'text-blue-600 bg-blue-100',
      'Personal Care': 'text-indigo-600 bg-indigo-100',
      'Persoonlijke Verzorging': 'text-indigo-600 bg-indigo-100',
      'Other Variable': 'text-gray-600 bg-gray-100',
      'Overige Variabele': 'text-gray-600 bg-gray-100'
    };
    
    return colorMap?.[category] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft hover:shadow-card nav-transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getCategoryColor(expense?.category)}`}>
            <Icon 
              name={getCategoryIcon(expense?.category)} 
              size={20} 
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base">
              {expense?.description}
            </h3>
            <p className="text-sm text-muted-foreground">
              {expense?.category}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-bold text-error">
            -€{parseFloat(expense?.amount)?.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(expense?.createdAt)}
          </p>
        </div>
      </div>
      {expense?.notes && (
        <div className="mb-3">
          <p className="text-sm text-muted-foreground bg-muted/50 rounded px-2 py-1">
            {expense?.notes}
          </p>
        </div>
      )}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {expense?.recurringUntil && (
            <span>Tot: {formatDate(expense?.recurringUntil)}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(expense)}
            className="p-2"
          >
            <Icon name="Edit" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(expense?.id)}
            className="p-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VariableExpenseCard;