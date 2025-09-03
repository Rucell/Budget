import React from 'react';
import Icon from '../../../components/AppIcon';

const ExpenseSummary = ({ expenses, filteredExpenses }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense?.amount, 0);
  const filteredTotal = filteredExpenses?.reduce((sum, expense) => sum + expense?.amount, 0);
  const averageExpense = expenses?.length > 0 ? totalExpenses / expenses?.length : 0;

  const getCategoryBreakdown = () => {
    const breakdown = {};
    expenses?.forEach(expense => {
      if (!breakdown?.[expense?.category]) {
        breakdown[expense.category] = { count: 0, total: 0 };
      }
      breakdown[expense.category].count++;
      breakdown[expense.category].total += expense?.amount;
    });
    return breakdown;
  };

  const categoryBreakdown = getCategoryBreakdown();
  const topCategory = Object.entries(categoryBreakdown)?.sort(([,a], [,b]) => b?.total - a?.total)?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Euro" size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Totale Uitgaven</p>
            <p className="text-xl font-semibold text-foreground">
              {formatAmount(totalExpenses)}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Icon name="Receipt" size={20} className="text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Aantal Uitgaven</p>
            <p className="text-xl font-semibold text-foreground">
              {expenses?.length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-warning/10 rounded-lg">
            <Icon name="TrendingUp" size={20} className="text-warning" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gemiddelde Uitgave</p>
            <p className="text-xl font-semibold text-foreground">
              {formatAmount(averageExpense)}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <Icon name="Target" size={20} className="text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hoogste Categorie</p>
            <p className="text-sm font-semibold text-foreground">
              {topCategory ? topCategory?.[0] : 'Geen data'}
            </p>
            <p className="text-xs text-muted-foreground">
              {topCategory ? formatAmount(topCategory?.[1]?.total) : '€0,00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;