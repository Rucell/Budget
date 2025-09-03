import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Housing': 'bg-blue-100 text-blue-800 border-blue-200',
      'Energy & Utilities': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Insurance': 'bg-green-100 text-green-800 border-green-200',
      'Transportation': 'bg-purple-100 text-purple-800 border-purple-200',
      'Subscriptions & Media': 'bg-pink-100 text-pink-800 border-pink-200',
      'Other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors?.[category] || colors?.['Other'];
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft hover:shadow-card nav-transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg font-semibold text-foreground">
              {formatAmount(expense?.amount)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense?.category)}`}>
              {expense?.category}
            </span>
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">
            {expense?.description}
          </h3>
          {expense?.notes && (
            <p className="text-sm text-muted-foreground">
              {expense?.notes}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(expense)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(expense?.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Toegevoegd op {new Date(expense.createdAt)?.toLocaleDateString('nl-NL')}
      </div>
    </div>
  );
};

export default ExpenseCard;