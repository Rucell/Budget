import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavingsGoalCard = ({ goal, onContribute, onEdit, onDelete }) => {
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributeAmount, setContributeAmount] = useState('');

  const progressPercentage = Math.min((goal?.currentBalance / goal?.targetAmount) * 100, 100);
  const remainingAmount = Math.max(goal?.targetAmount - goal?.currentBalance, 0);
  
  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-success';
    if (progressPercentage >= 75) return 'bg-secondary';
    if (progressPercentage >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  const getStatusIcon = () => {
    if (progressPercentage >= 100) return 'CheckCircle';
    if (goal?.status === 'paused') return 'Pause';
    return 'Target';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('nl-NL');
  };

  const calculateEstimatedCompletion = () => {
    if (progressPercentage >= 100) return 'Voltooid!';
    if (goal?.monthlyContribution <= 0) return 'Geen bijdrage ingesteld';
    
    const monthsRemaining = Math.ceil(remainingAmount / goal?.monthlyContribution);
    const estimatedDate = new Date();
    estimatedDate?.setMonth(estimatedDate?.getMonth() + monthsRemaining);
    
    return `Geschat: ${formatDate(estimatedDate)}`;
  };

  const handleContribute = () => {
    if (contributeAmount && parseFloat(contributeAmount) > 0) {
      onContribute(goal?.id, parseFloat(contributeAmount));
      setContributeAmount('');
      setShowContributeModal(false);
    }
  };

  const handleQuickContribute = (amount) => {
    onContribute(goal?.id, amount);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-lg nav-transition">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getProgressColor()} bg-opacity-10`}>
              <Icon name={getStatusIcon()} size={20} className={getProgressColor()?.replace('bg-', 'text-')} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{goal?.name}</h3>
              <p className="text-sm text-muted-foreground">{goal?.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(goal)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Edit2" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(goal?.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {formatCurrency(goal?.currentBalance)} van {formatCurrency(goal?.targetAmount)}
            </span>
            <span className="text-sm font-medium text-foreground">
              {progressPercentage?.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} nav-transition`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Nog nodig: {formatCurrency(remainingAmount)}</span>
            <span>{calculateEstimatedCompletion()}</span>
          </div>
        </div>

        {/* Goal Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Streefdatum</p>
            <p className="text-sm font-medium text-foreground">{formatDate(goal?.targetDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Maandelijkse bijdrage</p>
            <p className="text-sm font-medium text-foreground">{formatCurrency(goal?.monthlyContribution)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {progressPercentage < 100 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickContribute(25)}
                className="flex-1"
              >
                +€25
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickContribute(50)}
                className="flex-1"
              >
                +€50
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickContribute(100)}
                className="flex-1"
              >
                +€100
              </Button>
            </div>
            
            <Button
              variant="default"
              fullWidth
              onClick={() => setShowContributeModal(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Bijdrage toevoegen
            </Button>
          </div>
        )}

        {progressPercentage >= 100 && (
          <div className="flex items-center justify-center p-3 bg-success bg-opacity-10 rounded-lg">
            <Icon name="Trophy" size={20} className="text-success mr-2" />
            <span className="text-success font-medium">Doel behaald!</span>
          </div>
        )}
      </div>
      {/* Contribute Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Bijdrage toevoegen</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContributeModal(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Doel: {goal?.name}</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                <input
                  type="number"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e?.target?.value)}
                  placeholder="0,00"
                  className="w-full pl-8 pr-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowContributeModal(false)}
              >
                Annuleren
              </Button>
              <Button
                variant="default"
                fullWidth
                onClick={handleContribute}
                disabled={!contributeAmount || parseFloat(contributeAmount) <= 0}
              >
                Toevoegen
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SavingsGoalCard;