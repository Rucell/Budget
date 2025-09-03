import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateGoalModal = ({ isOpen, onClose, onCreateGoal }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    monthlyContribution: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

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
    } else {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      
      if (targetDate <= today) {
        newErrors.targetDate = 'Streefdatum moet in de toekomst liggen';
      }
    }

    if (!formData?.monthlyContribution || parseFloat(formData?.monthlyContribution) <= 0) {
      newErrors.monthlyContribution = 'Maandelijkse bijdrage moet groter zijn dan 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const newGoal = {
        id: Date.now(),
        name: formData?.name?.trim(),
        targetAmount: parseFloat(formData?.targetAmount),
        currentBalance: 0,
        targetDate: formData?.targetDate,
        monthlyContribution: parseFloat(formData?.monthlyContribution),
        description: formData?.description?.trim(),
        status: 'active',
        createdAt: new Date()?.toISOString()
      };

      onCreateGoal(newGoal);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      targetAmount: '',
      targetDate: '',
      monthlyContribution: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    return tomorrow?.toISOString()?.split('T')?.[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-card max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Nieuw spaardoel</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            min={getMinDate()}
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
              iconName="Plus"
              iconPosition="left"
            >
              Doel aanmaken
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoalModal;