import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CategoryModal = ({ 
  category, 
  isOpen, 
  onSubmit, 
  onClose, 
  existingCategories = [] 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Tag',
    color: '#3B82F6'
  });
  const [errors, setErrors] = useState({});

  // Available icons for categories
  const availableIcons = [
    'Home', 'Car', 'Shield', 'Smartphone', 'ShoppingCart', 'Heart', 
    'CreditCard', 'Utensils', 'Zap', 'Wifi', 'Baby', 'Book', 
    'Coffee', 'Gift', 'Music', 'Plane', 'Tag', 'MoreHorizontal'
  ];

  // Predefined colors
  const availableColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#EC4899', '#6B7280', '#64748B', '#14B8A6', '#F97316',
    '#84CC16', '#A855F7', '#06B6D4', '#EAB308', '#F43F5E'
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category?.name || '',
        description: category?.description || '',
        icon: category?.icon || 'Tag',
        color: category?.color || '#3B82F6'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: 'Tag',
        color: '#3B82F6'
      });
    }
    setErrors({});
  }, [category, isOpen]);

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

    if (!formData?.name?.trim()) {
      newErrors.name = 'Naam is verplicht';
    } else {
      // Check for duplicate names (excluding current category)
      const isDuplicate = existingCategories?.some(cat => 
        cat?.name?.toLowerCase() === formData?.name?.trim()?.toLowerCase() && 
        cat?.id !== category?.id
      );
      if (isDuplicate) {
        newErrors.name = 'Deze naam bestaat al';
      }
    }

    if (formData?.name?.trim()?.length > 50) {
      newErrors.name = 'Naam mag maximaal 50 tekens zijn';
    }

    if (formData?.description?.length > 200) {
      newErrors.description = 'Beschrijving mag maximaal 200 tekens zijn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    const categoryData = {
      id: category?.id || `custom_${Date.now()}`,
      name: formData?.name?.trim(),
      description: formData?.description?.trim(),
      icon: formData?.icon,
      color: formData?.color,
      createdAt: category?.createdAt || new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };

    onSubmit?.(categoryData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'Tag',
      color: '#3B82F6'
    });
    setErrors({});
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {category ? 'Categorie Bewerken' : 'Nieuwe Categorie'}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Naam *
            </label>
            <Input
              type="text"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              placeholder="Categorie naam"
              error={errors?.name}
              maxLength={50}
              required
            />
            {errors?.name && (
              <p className="text-red-500 text-sm mt-1">{errors?.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschrijving
            </label>
            <textarea
              rows={3}
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              placeholder="Optionele beschrijving..."
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
            />
            {errors?.description && (
              <p className="text-red-500 text-sm mt-1">{errors?.description}</p>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {formData?.description?.length}/200 tekens
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icoon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {availableIcons?.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleInputChange('icon', iconName)}
                  className={`p-3 rounded-lg border-2 flex items-center justify-center hover:bg-gray-50 transition-colors ${
                    formData?.icon === iconName 
                      ? 'border-indigo-500 bg-indigo-50' :'border-gray-200'
                  }`}
                >
                  <Icon name={iconName} size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kleur
            </label>
            <div className="grid grid-cols-5 gap-2">
              {availableColors?.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange('color', color)}
                  className={`w-12 h-12 rounded-lg border-2 transition-transform hover:scale-110 ${
                    formData?.color === color 
                      ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-300' :'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voorbeeld
            </label>
            <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${formData?.color}20` }}
              >
                <Icon 
                  name={formData?.icon} 
                  size={20} 
                  style={{ color: formData?.color }}
                />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {formData?.name || 'Categorie naam'}
                </div>
                <div className="text-sm text-gray-600">
                  {formData?.description || 'Beschrijving...'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} fullWidth>
              Annuleren
            </Button>
            <Button type="submit" fullWidth className="bg-indigo-600 hover:bg-indigo-700">
              {category ? 'Bijwerken' : 'Toevoegen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;