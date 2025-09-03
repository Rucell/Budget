import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialAlert = ({ type, message, amount }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-muted border-border text-foreground';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return 'AlertTriangle';
      case 'danger':
        return 'AlertCircle';
      case 'success':
        return 'CheckCircle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(Math.abs(value));
  };

  return (
    <div className={`p-4 rounded-lg border ${getAlertStyles()} mb-4`}>
      <div className="flex items-start space-x-3">
        <Icon name={getIcon()} size={20} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium mb-1">{message}</p>
          {amount && (
            <p className="text-sm opacity-90">
              Bedrag: {formatAmount(amount)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialAlert;