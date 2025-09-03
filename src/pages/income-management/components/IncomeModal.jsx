import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const IncomeModal = ({ isOpen, onClose, onSave, onSubmit, editingIncome }) => {
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    type: 'salary',
    date: new Date()?.toISOString()?.split('T')?.[0],
    notes: '',
    processedDate: new Date()?.toISOString()?.split('T')?.[0]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incomeTypeOptions = [
    { value: 'salary', label: 'Salaris' },
    { value: 'additional', label: 'Extra inkomsten' }
  ];

  useEffect(() => {
    if (editingIncome) {
      setFormData({
        amount: editingIncome?.amount?.toString() || '',
        source: editingIncome?.source || '',
        type: editingIncome?.type || 'salary',
        date: editingIncome?.date || new Date()?.toISOString()?.split('T')?.[0],
        notes: editingIncome?.notes || '',
        processedDate: editingIncome?.processedDate || editingIncome?.date || new Date()?.toISOString()?.split('T')?.[0]
      });
    } else {
      setFormData({
        amount: '',
        source: '',
        type: 'salary',
        date: new Date()?.toISOString()?.split('T')?.[0],
        notes: '',
        processedDate: new Date()?.toISOString()?.split('T')?.[0]
      });
    }
    setErrors({});
    setIsSubmitting(false);
  }, [editingIncome, isOpen]);

  const handleInputChange = (field, value) => {
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

  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    if (!formData?.amount || formData?.amount?.trim() === '') {
      newErrors.amount = 'Bedrag is verplicht';
    } else if (parseFloat(formData?.amount) <= 0 || isNaN(parseFloat(formData?.amount))) {
      newErrors.amount = 'Voer een geldig bedrag in (groter dan 0)';
    }

    // Source validation
    if (!formData?.source?.trim()) {
      newErrors.source = 'Bron is verplicht';
    }

    // Date validation
    if (!formData?.date) {
      newErrors.date = 'Datum is verplicht';
    }

    // Processed date validation
    if (!formData?.processedDate) {
      newErrors.processedDate = 'Verwerkingsdatum is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const incomeData = {
        id: editingIncome?.id || Date.now(),
        amount: parseFloat(formData?.amount),
        source: formData?.source?.trim(),
        type: formData?.type,
        date: formData?.date,
        processedDate: formData?.processedDate,
        notes: formData?.notes?.trim() || '',
        createdAt: editingIncome?.createdAt || new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };

      // Use onSubmit if available, fallback to onSave for backward compatibility
      const submitHandler = onSubmit || onSave;
      if (submitHandler) {
        await submitHandler(incomeData);
      }
      
      // Reset form and close modal on success
      handleClose();
    } catch (error) {
      console.error('Error saving income:', error);
      setErrors({ submit: 'Er is een fout opgetreden bij het opslaan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    setFormData({
      amount: '',
      source: '',
      type: 'salary',
      date: new Date()?.toISOString()?.split('T')?.[0],
      notes: '',
      processedDate: new Date()?.toISOString()?.split('T')?.[0]
    });
    setErrors({});
    setIsSubmitting(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={(e) => e?.target === e?.currentTarget && handleClose()}>
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e?.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {editingIncome ? 'Inkomsten bewerken' : 'Nieuwe inkomsten toevoegen'}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isSubmitting}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors?.submit && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive">{errors?.submit}</p>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Bedrag *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData?.amount}
              onChange={(e) => handleInputChange('amount', e?.target?.value)}
              placeholder="0.00"
              required
              disabled={isSubmitting}
              className={errors?.amount ? 'border-destructive' : ''}
            />
            {errors?.amount && (
              <p className="text-sm text-destructive mt-1">{errors?.amount}</p>
            )}
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Bron *
            </label>
            <Input
              type="text"
              value={formData?.source}
              onChange={(e) => handleInputChange('source', e?.target?.value)}
              placeholder="Bijv. Hoofdwerkgever, Freelance project..."
              required
              disabled={isSubmitting}
              className={errors?.source ? 'border-destructive' : ''}
            />
            {errors?.source && (
              <p className="text-sm text-destructive mt-1">{errors?.source}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Type *
            </label>
            <Select
              options={incomeTypeOptions}
              value={formData?.type}
              onChange={(value) => handleInputChange('type', value)}
              placeholder="Selecteer type"
              disabled={isSubmitting}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Datum *
            </label>
            <Input
              type="date"
              value={formData?.date}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              required
              disabled={isSubmitting}
              className={errors?.date ? 'border-destructive' : ''}
            />
            {errors?.date && (
              <p className="text-sm text-destructive mt-1">{errors?.date}</p>
            )}
          </div>

          {/* Processed Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Verwerkingsdatum *
            </label>
            <Input
              type="date"
              value={formData?.processedDate}
              onChange={(e) => handleInputChange('processedDate', e?.target?.value)}
              required
              disabled={isSubmitting}
              className={errors?.processedDate ? 'border-destructive' : ''}
            />
            {errors?.processedDate && (
              <p className="text-sm text-destructive mt-1">{errors?.processedDate}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              De datum waarop deze inkomsten worden verwerkt voor cashflow berekeningen
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Notities
            </label>
            <textarea
              rows={4}
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              placeholder="Extra informatie, projectdetails, etc..."
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              fullWidth
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
              {editingIncome ? 'Bijwerken' : 'Opslaan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeModal;