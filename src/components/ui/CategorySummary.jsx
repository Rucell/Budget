import React from 'react';
import Icon from '../AppIcon';

const CategorySummary = ({ 
  data = [], 
  title = "Category Overview",
  formatValue = (value) => `€${value?.toFixed(2)}`,
  className = '' 
}) => {
  // Calculate totals by category
  const categorySummary = data?.reduce((acc, item) => {
    const category = item?.category || 'Uncategorized';
    if (!acc?.[category]) {
      acc[category] = { total: 0, count: 0, items: [] };
    }
    acc[category].total += parseFloat(item?.amount || 0);
    acc[category].count += 1;
    acc?.[category]?.items?.push(item);
    return acc;
  }, {});

  const categories = Object.keys(categorySummary)?.sort((a, b) => 
    categorySummary?.[b]?.total - categorySummary?.[a]?.total
  );

  const grandTotal = Object.values(categorySummary)?.reduce(
    (sum, cat) => sum + cat?.total, 0
  );

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Housing': 'Home',
      'Huisvesting': 'Home',
      'Energy & Utilities': 'Zap',
      'Energie & Nutsvoorzieningen': 'Zap',
      'Insurance': 'Shield',
      'Verzekeringen': 'Shield',
      'Transportation': 'Car',
      'Vervoer': 'Car',
      'Subscriptions & Media': 'Tv',
      'Abonnementen & Media': 'Tv',
      'Variable Costs': 'Shuffle',
      'Variabele Kosten': 'Shuffle',
      'Income': 'TrendingUp',
      'Inkomsten': 'TrendingUp',
      'Other': 'MoreHorizontal',
      'Overig': 'MoreHorizontal'
    };
    
    return iconMap?.[category] || 'Circle';
  };

  if (!categories?.length) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        <div className="text-center py-8">
          <Icon name="PieChart" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Geen gegevens beschikbaar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Totaal</p>
          <p className="text-lg font-bold text-foreground">
            {formatValue(grandTotal)}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {categories?.map(category => {
          const categoryData = categorySummary?.[category];
          const percentage = grandTotal > 0 ? (categoryData?.total / grandTotal) * 100 : 0;
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                    <Icon 
                      name={getCategoryIcon(category)} 
                      size={16} 
                      className="text-primary" 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{category}</p>
                    <p className="text-sm text-muted-foreground">
                      {categoryData?.count} item{categoryData?.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatValue(categoryData?.total)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {percentage?.toFixed(1)}%
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySummary;