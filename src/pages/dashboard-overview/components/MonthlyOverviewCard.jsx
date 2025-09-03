import React from 'react';
import Icon from '../../../components/AppIcon';

const MonthlyOverviewCard = ({ title, amount, type, icon, trend }) => {
  const getCardStyles = () => {
    switch (type) {
      case 'income':
        return 'bg-emerald-50 border-emerald-200';
      case 'expenses':
        return 'bg-red-50 border-red-200';
      case 'remaining':
        return amount >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200';
      default:
        return 'bg-card border-border';
    }
  };

  const getAmountColor = () => {
    switch (type) {
      case 'income':
        return 'text-emerald-600';
      case 'expenses':
        return 'text-red-600';
      case 'remaining':
        return amount >= 0 ? 'text-blue-600' : 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'income':
        return 'text-emerald-600';
      case 'expenses':
        return 'text-red-600';
      case 'remaining':
        return amount >= 0 ? 'text-blue-600' : 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(value);
  };

  return (
    <div className={`p-6 rounded-lg border shadow-card ${getCardStyles()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-white ${getIconColor()}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <Icon name={trend > 0 ? 'TrendingUp' : 'TrendingDown'} size={16} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className={`text-2xl font-bold ${getAmountColor()}`}>
          {formatAmount(amount)}
        </p>
      </div>
    </div>
  );
};

export default MonthlyOverviewCard;