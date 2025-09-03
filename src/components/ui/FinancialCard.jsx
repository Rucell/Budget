import React from 'react';
import Icon from '../AppIcon';

const FinancialCard = ({ title, amount, type = 'default', trend, className = '' }) => {
  const getCardStyles = () => {
    switch (type) {
      case 'balance':
        return 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white';
      case 'income':
        return 'bg-white border border-gray-100';
      case 'savings':
        return 'bg-white border border-gray-100';
      case 'expenses':
        return 'bg-white border border-gray-100';
      default:
        return 'bg-white border border-gray-100';
    }
  };

  const getIconByType = () => {
    switch (type) {
      case 'balance':
        return 'Wallet';
      case 'income':
        return 'TrendingUp';
      case 'savings':
        return 'PiggyBank';
      case 'expenses':
        return 'CreditCard';
      default:
        return 'DollarSign';
    }
  };

  const getAmountColor = () => {
    if (type === 'balance') return 'text-white';
    if (type === 'income') return 'text-emerald-600';
    if (type === 'expenses') return 'text-red-600';
    return 'text-gray-900';
  };

  return (
    <div className={`rounded-2xl p-6 ${getCardStyles()} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${type === 'balance' ? 'bg-white/20' : 'bg-gray-50'}`}>
          <Icon 
            name={getIconByType()} 
            size={20} 
            className={type === 'balance' ? 'text-white' : 'text-indigo-600'} 
          />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend > 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            <Icon name={trend > 0 ? 'TrendingUp' : 'TrendingDown'} size={16} className="mr-1" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div>
        <p className={`text-sm ${type === 'balance' ? 'text-white/80' : 'text-gray-500'} mb-1`}>
          {title}
        </p>
        <p className={`text-2xl font-bold ${getAmountColor()}`}>
          €{amount?.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default FinancialCard;