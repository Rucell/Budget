import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';


const ExpenseForm = ({ expense, onSubmit, onCancel, isOpen, customCategories = [] }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    notes: '',
    processedDate: new Date()?.toISOString()?.split('T')?.[0]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine default and custom categories
  const defaultCategories = [
    { value: 'Housing', label: 'Wonen' },
    { value: 'Energy & Utilities', label: 'Energie & Nutsvoorzieningen' },
    { value: 'Insurance', label: 'Verzekeringen' },
    { value: 'Transportation', label: 'Transport' },
    { value: 'Subscriptions & Media', label: 'Abonnementen & Media' },
    { value: 'Healthcare', label: 'Zorgverzekering' },
    { value: 'Banking & Finance', label: 'Banking & Financieel' },
    { value: 'Other', label: 'Overig' }
  ];

  const categoryOptions = customCategories?.length > 0
    ? customCategories?.map(cat => ({ value: cat?.name, label: cat?.label || cat?.name }))
    : defaultCategories;

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense?.amount?.toString() || '',
        category: expense?.category || '',
        description: expense?.description || '',
        notes: expense?.notes || '',
        processedDate: expense?.processedDate ? expense?.processedDate?.split('T')?.[0] : new Date()?.toISOString()?.split('T')?.[0]
      });
    } else {
      setFormData({
        amount: '',
        category: '',
        description: '',
        notes: '',
        processedDate: new Date()?.toISOString()?.split('T')?.[0]
      });
    }
    setErrors({});
    setIsSubmitting(false);
  }, [expense, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Voer een geldig bedrag in';
    }

    if (!formData?.category) {
      newErrors.category = 'Selecteer een categorie';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Voer een beschrijving in';
    }

    if (!formData?.processedDate) {
      newErrors.processedDate = 'Verwerkingsdatum is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newExpense = {
        id: expense?.id || Date.now(),
        amount: parseFloat(formData?.amount),
        category: formData?.category,
        description: formData?.description?.trim(),
        notes: formData?.notes?.trim(),
        processedDate: formData?.processedDate + 'T10:00:00Z',
        createdAt: expense?.createdAt || new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      await onSubmit?.(newExpense);
    } catch (error) {
      console.error('Error submitting expense:', error);
      alert('Er is een fout opgetreden bij het opslaan van de uitgave.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCancel = () => {
    setFormData({
      amount: '',
      category: '',
      description: '',
      notes: '',
      processedDate: new Date()?.toISOString()?.split('T')?.[0]
    });
    setErrors({});
    setIsSubmitting(false);
    onCancel?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modern Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {expense ? 'Uitgave bewerken' : 'Nieuwe uitgave toevoegen'}
              </h2>
              <p className="text-blue-100 text-sm">Voer de uitgave details in</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="text-white hover:bg-white/20" disabled={isSubmitting}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Bedrag *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData?.amount}
                onChange={(e) => handleChange('amount', e?.target?.value)}
                placeholder="0.00"
                className="pl-8"
                error={errors?.amount}
                required
                disabled={isSubmitting}
              />
            </div>
            {errors?.amount && (
              <p className="text-sm text-red-500 mt-1">{errors?.amount}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <Select
              label="Categorie *"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleChange('category', value)}
              placeholder="Selecteer categorie"
              error={errors?.category}
              searchable
              required
              disabled={isSubmitting}
            />
            {errors?.category && (
              <p className="text-sm text-red-500 mt-1">{errors?.category}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <Input
              label="Beschrijving *"
              type="text"
              value={formData?.description}
              onChange={(e) => handleChange('description', e?.target?.value)}
              placeholder="Bijv. Hypotheek, Gas & Licht..."
              error={errors?.description}
              required
              disabled={isSubmitting}
            />
            {errors?.description && (
              <p className="text-sm text-red-500 mt-1">{errors?.description}</p>
            )}
          </div>

          {/* Processed Date Field */}
          <div>
            <Input
              label="Verwerkingsdatum *"
              type="date"
              value={formData?.processedDate}
              onChange={(e) => handleChange('processedDate', e?.target?.value)}
              error={errors?.processedDate}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              De datum waarop deze uitgave wordt verwerkt voor cashflow berekeningen
            </p>
            {errors?.processedDate && (
              <p className="text-sm text-red-500 mt-1">{errors?.processedDate}</p>
            )}
          </div>

          {/* Notes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Notities
            </label>
            <textarea
              rows={3}
              value={formData?.notes}
              onChange={(e) => handleChange('notes', e?.target?.value)}
              placeholder="Extra informatie of opmerkingen..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:opacity-50"
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel} 
              fullWidth
              className="border-gray-200"
              disabled={isSubmitting}
            >
              Annuleren
            </Button>
            <Button 
              type="submit" 
              fullWidth
              className="bg-indigo-600 hover:bg-indigo-700"
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

export default ExpenseForm;