import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IncomeCard = ({ income, onEdit, onDelete, onToggleNotes }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getIncomeTypeIcon = (type) => {
    return type === 'salary' ? 'Briefcase' : 'PlusCircle';
  };

  const getIncomeTypeLabel = (type) => {
    return type === 'salary' ? 'Salaris' : 'Extra inkomsten';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${income?.type === 'salary' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
            <Icon 
              name={getIncomeTypeIcon(income?.type)} 
              size={20} 
              color={income?.type === 'salary' ? 'var(--color-primary)' : 'var(--color-secondary)'} 
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{income?.source}</h3>
            <p className="text-sm text-muted-foreground">{getIncomeTypeLabel(income?.type)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(income)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(income?.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl font-bold text-foreground">
          {formatCurrency(income?.amount)}
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDate(income?.date)}
        </div>
      </div>
      {income?.notes && (
        <div className="border-t border-border pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleNotes(income?.id)}
            className="w-full justify-between text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center space-x-2">
              <Icon name="FileText" size={16} />
              <span>Notities</span>
            </span>
            <Icon name={income?.showNotes ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
          
          {income?.showNotes && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {income?.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IncomeCard;