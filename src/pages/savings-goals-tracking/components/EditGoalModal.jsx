import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EditGoalModal = ({ isOpen, onClose, onUpdateGoal, goal }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    monthlyContribution: '',
    description: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'active', label: 'Actief' },
    { value: 'paused', label: 'Gepauzeerd' },
    { value: 'completed', label: 'Voltooid' }
  ];

  useEffect(() => {
    if (goal && isOpen) {
      setFormData({
        name: goal?.name || '',
        targetAmount: goal?.targetAmount?.toString() || '',
        targetDate: goal?.targetDate || '',
        monthlyContribution: goal?.monthlyContribution?.toString() || '',
        description: goal?.description || '',
        status: goal?.status || 'active'
      });
    }
  }, [goal, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Doelnaam is verplicht';
    }

    if (!formData?.targetAmount || parseFloat(formData?.targetAmount) <= 0) {
      newErrors.targetAmount = 'Streefbedrag moet groter zijn dan 0';
    }

    if (!formData?.targetDate) {
      newErrors.targetDate = 'Streefdatum is verplicht';
    }

    if (!formData?.monthlyContribution || parseFloat(formData?.monthlyContribution) < 0) {
      newErrors.monthlyContribution = 'Maandelijkse bijdrage moet 0 of hoger zijn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const updatedGoal = {
        ...goal,
        name: formData?.name?.trim(),
        targetAmount: parseFloat(formData?.targetAmount),
        targetDate: formData?.targetDate,
        monthlyContribution: parseFloat(formData?.monthlyContribution),
        description: formData?.description?.trim(),
        status: formData?.status,
        updatedAt: new Date()?.toISOString()
      };

      onUpdateGoal(updatedGoal);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    })?.format(amount);
  };

  if (!isOpen || !goal) return null;

  const progressPercentage = Math.min((goal?.currentBalance / goal?.targetAmount) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-card max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Spaardoel bewerken</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Current Progress */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Huidige voortgang</span>
              <span className="text-sm font-medium text-foreground">{progressPercentage?.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 overflow-hidden mb-2">
              <div
                className="h-full bg-primary nav-transition"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(goal?.currentBalance)} van {formatCurrency(goal?.targetAmount)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Doelnaam"
              type="text"
              placeholder="bijv. Vakantie naar Spanje"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <Input
              label="Streefbedrag"
              type="number"
              placeholder="0,00"
              value={formData?.targetAmount}
              onChange={(e) => handleInputChange('targetAmount', e?.target?.value)}
              error={errors?.targetAmount}
              step="0.01"
              min="0"
              required
            />

            <Input
              label="Streefdatum"
              type="date"
              value={formData?.targetDate}
              onChange={(e) => handleInputChange('targetDate', e?.target?.value)}
              error={errors?.targetDate}
              required
            />

            <Input
              label="Maandelijkse bijdrage"
              type="number"
              placeholder="0,00"
              value={formData?.monthlyContribution}
              onChange={(e) => handleInputChange('monthlyContribution', e?.target?.value)}
              error={errors?.monthlyContribution}
              description="Hoeveel wil je elke maand sparen voor dit doel?"
              step="0.01"
              min="0"
              required
            />

            <Select
              label="Status"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleInputChange('status', value)}
              description="Wijzig de status van je spaardoel"
            />

            <Input
              label="Beschrijving (optioneel)"
              type="text"
              placeholder="Korte beschrijving van je spaardoel"
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
            />

            <div className="flex items-center space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleClose}
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                variant="default"
                fullWidth
                iconName="Save"
                iconPosition="left"
              >
                Opslaan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGoalModal;