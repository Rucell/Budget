import React from 'react';
import Icon from '../../../components/AppIcon';

const IncomeSummary = ({ incomes, filteredIncomes }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  const calculateTotals = (incomeList) => {
    const salary = incomeList?.filter(income => income?.type === 'salary')?.reduce((sum, income) => sum + income?.amount, 0);
    
    const additional = incomeList?.filter(income => income?.type === 'additional')?.reduce((sum, income) => sum + income?.amount, 0);
    
    return { salary, additional, total: salary + additional };
  };

  const currentMonth = new Date()?.getMonth();
  const currentYear = new Date()?.getFullYear();
  
  const thisMonthIncomes = incomes?.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate?.getMonth() === currentMonth && incomeDate?.getFullYear() === currentYear;
  });

  const filteredTotals = calculateTotals(filteredIncomes);
  const monthlyTotals = calculateTotals(thisMonthIncomes);

  const summaryCards = [
    {
      title: 'Totaal gefilterd',
      amount: filteredTotals?.total,
      icon: 'Calculator',
      color: 'primary',
      description: `${filteredIncomes?.length} inkomstenbronnen`
    },
    {
      title: 'Deze maand',
      amount: monthlyTotals?.total,
      icon: 'Calendar',
      color: 'secondary',
      description: `${thisMonthIncomes?.length} inkomstenbronnen`
    },
    {
      title: 'Salaris (gefilterd)',
      amount: filteredTotals?.salary,
      icon: 'Briefcase',
      color: 'primary',
      description: 'Reguliere inkomsten'
    },
    {
      title: 'Extra (gefilterd)',
      amount: filteredTotals?.additional,
      icon: 'PlusCircle',
      color: 'secondary',
      description: 'Aanvullende inkomsten'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards?.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${card?.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
              <Icon 
                name={card?.icon} 
                size={20} 
                color={card?.color === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)'} 
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              {card?.title}
            </h3>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(card?.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {card?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncomeSummary;