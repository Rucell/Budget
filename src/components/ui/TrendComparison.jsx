import React from 'react';
import Icon from '../AppIcon';

const TrendComparison = ({ 
  current, 
  previous, 
  label, 
  formatValue = (value) => `€${value?.toFixed(2)}`,
  className = '' 
}) => {
  const calculateTrend = () => {
    if (!previous || previous === 0) return { percentage: 0, direction: 'neutral' };
    
    const difference = current - previous;
    const percentage = (difference / Math.abs(previous)) * 100;
    
    return {
      percentage: Math.abs(percentage),
      direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral'
    };
  };

  const trend = calculateTrend();
  
  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return label?.toLowerCase()?.includes('income') || label?.toLowerCase()?.includes('inkomst')
          ? 'text-success' :'text-error';
      case 'down':
        return label?.toLowerCase()?.includes('income') || label?.toLowerCase()?.includes('inkomst')
          ? 'text-error' :'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const getTrendText = () => {
    if (trend?.direction === 'neutral' || trend?.percentage === 0) {
      return 'Geen verandering';
    }
    
    const direction = trend?.direction === 'up' ? 'hoger' : 'lager';
    return `${trend?.percentage?.toFixed(1)}% ${direction}`;
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="space-y-3">
        {/* Current Value */}
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">
            {formatValue(current)}
          </p>
        </div>

        {/* Trend Comparison */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getTrendIcon()} 
              size={16} 
              className={getTrendColor()} 
            />
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {getTrendText()}
            </span>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Vorige maand</p>
            <p className="text-sm font-medium text-foreground">
              {formatValue(previous)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendComparison;