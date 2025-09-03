import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';


const VariableExpenseForm = ({ expense, onSubmit, onCancel, isOpen, selectedMonth }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    notes: '',
    date: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: 'Boodschappen', label: 'Boodschappen' },
    { value: 'Uitgaan & Entertainment', label: 'Uitgaan & Entertainment' },
    { value: 'Winkelen', label: 'Winkelen' },
    { value: 'Gezondheid', label: 'Gezondheid' },
    { value: 'Reizen', label: 'Reizen' },
    { value: 'Persoonlijke Verzorging', label: 'Persoonlijke Verzorging' },
    { value: 'Sport & Fitness', label: 'Sport & Fitness' },
    { value: 'Hobby\'s', label: 'Hobby\'s' },
    { value: 'Kleding', label: 'Kleding' },
    { value: 'Overige Variabele', label: 'Overige Variabele' }
  ];

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense?.description || '',
        amount: expense?.amount?.toString() || '',
        category: expense?.category || '',
        notes: expense?.notes || '',
        date: expense?.date || ''
      });
    } else {
      // Set default date to current selected month
      const defaultDate = selectedMonth 
        ? selectedMonth?.toISOString()?.split('T')?.[0]
        : new Date()?.toISOString()?.split('T')?.[0];
        
      setFormData({
        description: '',
        amount: '',
        category: '',
        notes: '',
        date: defaultDate
      });
    }
    // Clear errors when opening form
    setErrors({});
    setIsSubmitting(false);
  }, [expense, selectedMonth, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.description?.trim()) {
      newErrors.description = 'Beschrijving is verplicht';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Voer een geldig bedrag in';
    }

    if (!formData?.category) {
      newErrors.category = 'Selecteer een categorie';
    }

    if (!formData?.date) {
      newErrors.date = 'Datum is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData = {
        id: expense?.id || Date.now(),
        description: formData?.description?.trim(),
        amount: parseFloat(formData?.amount),
        category: formData?.category,
        notes: formData?.notes?.trim(),
        date: formData?.date,
        createdAt: expense?.createdAt || new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      await onSubmit?.(expenseData);
    } catch (error) {
      console.error('Error submitting expense:', error);
      alert('Er is een fout opgetreden bij het opslaan van de uitgave.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      notes: '',
      date: ''
    });
    setErrors({});
    setIsSubmitting(false);
    onCancel?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card rounded-lg border border-border p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
              <Icon name="Receipt" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {expense ? 'Uitgave Bewerken' : 'Nieuwe Variabele Uitgave'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {expense ? 'Wijzig de gegevens van de uitgave' : 'Voeg een nieuwe variabele uitgave toe'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSubmitting}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Beschrijving *"
            placeholder="Bijv. Boodschappen Albert Heijn"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            error={errors?.description}
            required
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bedrag *"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData?.amount}
              onChange={(e) => handleInputChange('amount', e?.target?.value)}
              error={errors?.amount}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Datum *"
              type="date"
              value={formData?.date}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              error={errors?.date}
              required
              disabled={isSubmitting}
            />
          </div>

          <Select
            label="Categorie *"
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            placeholder="Selecteer een categorie"
            error={errors?.category}
            searchable
            required
            disabled={isSubmitting}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notities
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none disabled:opacity-50"
              rows={3}
              placeholder="Optionele notities..."
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {expense ? 'Bijwerken' : 'Toevoegen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariableExpenseForm;