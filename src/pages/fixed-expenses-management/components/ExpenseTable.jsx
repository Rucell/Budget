import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExpenseTable = ({ expenses, onEdit, onDelete, sortField, sortDirection, onSort }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Housing': 'bg-blue-100 text-blue-800 border-blue-200',
      'Energy & Utilities': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Insurance': 'bg-green-100 text-green-800 border-green-200',
      'Transportation': 'bg-purple-100 text-purple-800 border-purple-200',
      'Subscriptions & Media': 'bg-pink-100 text-pink-800 border-pink-200',
      'Other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors?.[category] || colors?.['Other'];
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      onSort(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'asc');
    }
  };

  if (expenses?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Receipt" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Geen uitgaven gevonden</h3>
        <p className="text-muted-foreground">
          Voeg je eerste uitgave toe om te beginnen met budgetbeheer.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('amount')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Bedrag
                  <Icon name={getSortIcon('amount')} size={14} className="ml-1" />
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('category')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Categorie
                  <Icon name={getSortIcon('category')} size={14} className="ml-1" />
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('description')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Beschrijving
                  <Icon name={getSortIcon('description')} size={14} className="ml-1" />
                </Button>
              </th>
              <th className="text-left p-4">Notities</th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('createdAt')}
                  className="font-medium text-foreground hover:text-foreground"
                >
                  Datum
                  <Icon name={getSortIcon('createdAt')} size={14} className="ml-1" />
                </Button>
              </th>
              <th className="text-right p-4">Acties</th>
            </tr>
          </thead>
          <tbody>
            {expenses?.map((expense, index) => (
              <tr key={expense?.id} className={`border-t border-border hover:bg-accent nav-transition ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                <td className="p-4">
                  <span className="font-semibold text-foreground">
                    {formatAmount(expense?.amount)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense?.category)}`}>
                    {expense?.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-foreground font-medium">
                    {expense?.description}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-muted-foreground text-sm">
                    {expense?.notes || '-'}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-muted-foreground text-sm">
                    {new Date(expense.createdAt)?.toLocaleDateString('nl-NL')}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(expense)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="Edit2" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(expense?.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;