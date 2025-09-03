import React from 'react';

import Icon from '../../../components/AppIcon';


const SavingsGoalCard = ({ goal }) => {
  const progressPercentage = Math.min((goal?.currentAmount / goal?.targetAmount) * 100, 100);
  const remainingAmount = Math.max(goal?.targetAmount - goal?.currentAmount, 0);

  const formatAmount = (value) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(value);
  };

  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-emerald-500';
    if (progressPercentage >= 75) return 'bg-blue-500';
    if (progressPercentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name={goal?.icon || 'Target'} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{goal?.name}</h3>
            <p className="text-sm text-muted-foreground">{goal?.category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Voortgang</p>
          <p className="font-semibold text-foreground">{progressPercentage?.toFixed(1)}%</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Huidig bedrag</span>
          <span className="font-medium text-foreground">{formatAmount(goal?.currentAmount)}</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Doel</span>
          <span className="font-medium text-foreground">{formatAmount(goal?.targetAmount)}</span>
        </div>
        
        {remainingAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Nog nodig</span>
            <span className="font-medium text-orange-600">{formatAmount(remainingAmount)}</span>
          </div>
        )}
      </div>
      {goal?.deadline && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>Deadline</span>
            </span>
            <span className="font-medium text-foreground">
              {new Date(goal.deadline)?.toLocaleDateString('nl-NL')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalCard;