import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryStats = ({ goals }) => {
  const activeGoals = goals?.filter(goal => goal?.status === 'active');
  const completedGoals = goals?.filter(goal => goal?.status === 'completed');
  
  const totalTargetAmount = goals?.reduce((sum, goal) => sum + goal?.targetAmount, 0);
  const totalCurrentBalance = goals?.reduce((sum, goal) => sum + goal?.currentBalance, 0);
  const totalMonthlyContribution = activeGoals?.reduce((sum, goal) => sum + goal?.monthlyContribution, 0);
  
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentBalance / totalTargetAmount) * 100 : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  const stats = [
    {
      label: 'Totaal gespaard',
      value: formatCurrency(totalCurrentBalance),
      icon: 'Wallet',
      color: 'text-success',
      bgColor: 'bg-success bg-opacity-10'
    },
    {
      label: 'Totaal streefbedrag',
      value: formatCurrency(totalTargetAmount),
      icon: 'Target',
      color: 'text-primary',
      bgColor: 'bg-primary bg-opacity-10'
    },
    {
      label: 'Maandelijkse bijdrage',
      value: formatCurrency(totalMonthlyContribution),
      icon: 'TrendingUp',
      color: 'text-secondary',
      bgColor: 'bg-secondary bg-opacity-10'
    },
    {
      label: 'Voltooide doelen',
      value: `${completedGoals?.length} van ${goals?.length}`,
      icon: 'CheckCircle',
      color: 'text-warning',
      bgColor: 'bg-warning bg-opacity-10'
    }
  ];

  return (
    <div className="mb-6">
      {/* Overall Progress */}
      <div className="bg-card border border-border rounded-lg p-6 mb-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Totale voortgang</h3>
          <span className="text-lg font-semibold text-foreground">{overallProgress?.toFixed(1)}%</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden mb-2">
          <div
            className="h-full bg-primary nav-transition"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground">
          {formatCurrency(totalCurrentBalance)} van {formatCurrency(totalTargetAmount)} gespaard
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 shadow-card">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat?.label}</p>
                <p className="text-sm font-semibold text-foreground truncate">{stat?.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryStats;