import React from 'react';
import Icon from '../../../components/AppIcon';

const AnnualSummaryCards = ({ summaryData, previousYearData }) => {
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100)?.toFixed(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  const cards = [
    {
      title: 'Totaal Inkomen',
      value: summaryData?.totalIncome,
      previousValue: previousYearData?.totalIncome || 0,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Totaal Uitgaven',
      value: summaryData?.totalExpenses,
      previousValue: previousYearData?.totalExpenses || 0,
      icon: 'TrendingDown',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      title: 'Totaal Besparingen',
      value: summaryData?.totalSavings,
      previousValue: previousYearData?.totalSavings || 0,
      icon: 'PiggyBank',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Netto Verandering',
      value: summaryData?.netChange,
      previousValue: previousYearData?.netChange || 0,
      icon: summaryData?.netChange >= 0 ? 'Plus' : 'Minus',
      color: summaryData?.netChange >= 0 ? 'text-success' : 'text-destructive',
      bgColor: summaryData?.netChange >= 0 ? 'bg-success/10' : 'bg-destructive/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards?.map((card, index) => {
        const percentageChange = calculatePercentageChange(card?.value, card?.previousValue);
        const isPositiveChange = percentageChange > 0;
        
        return (
          <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${card?.bgColor}`}>
                <Icon name={card?.icon} size={20} className={card?.color} />
              </div>
              {percentageChange !== 0 && (
                <div className={`flex items-center space-x-1 text-xs ${
                  isPositiveChange ? 'text-success' : 'text-destructive'
                }`}>
                  <Icon 
                    name={isPositiveChange ? 'ArrowUp' : 'ArrowDown'} 
                    size={12} 
                  />
                  <span>{Math.abs(percentageChange)}%</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {card?.title}
              </h3>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(card?.value)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnnualSummaryCards;