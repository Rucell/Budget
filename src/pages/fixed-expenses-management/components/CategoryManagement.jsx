import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { storage } from '../../../utils/localStorage';

const CategoryManagement = ({ isOpen, onClose, onCategoriesUpdate }) => {
  const [categories, setCategories] = useState([
    { id: 'housing', name: 'Housing', label: 'Wonen', color: '#3B82F6' },
    { id: 'energy', name: 'Energy & Utilities', label: 'Energie & Nutsvoorzieningen', color: '#10B981' },
    { id: 'insurance', name: 'Insurance', label: 'Verzekeringen', color: '#F59E0B' },
    { id: 'transportation', name: 'Transportation', label: 'Transport', color: '#EF4444' },
    { id: 'subscriptions', name: 'Subscriptions & Media', label: 'Abonnementen & Media', color: '#8B5CF6' },
    { id: 'other', name: 'Other', label: 'Overig', color: '#6B7280' }
  ]);

  const [newCategory, setNewCategory] = useState({ name: '', label: '', color: '#3B82F6' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const predefinedColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
    '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
  ];

  useEffect(() => {
    const savedCategories = storage?.get('familybudget-expense-categories', categories);
    setCategories(savedCategories);
  }, []);

  const saveCategories = (newCategories) => {
    setCategories(newCategories);
    storage?.set('familybudget-expense-categories', newCategories);
    onCategoriesUpdate?.(newCategories);
  };

  const handleAddCategory = () => {
    if (!newCategory?.name?.trim() || !newCategory?.label?.trim()) return;

    const category = {
      id: Date.now()?.toString(),
      name: newCategory?.name?.trim(),
      label: newCategory?.label?.trim(),
      color: newCategory?.color
    };

    const updatedCategories = [...categories, category];
    saveCategories(updatedCategories);
    setNewCategory({ name: '', label: '', color: '#3B82F6' });
    setShowAddForm(false);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category?.name,
      label: category?.label,
      color: category?.color
    });
    setShowAddForm(true);
  };

  const handleUpdateCategory = () => {
    if (!newCategory?.name?.trim() || !newCategory?.label?.trim()) return;

    const updatedCategories = categories?.map(cat =>
      cat?.id === editingCategory?.id
        ? { ...cat, name: newCategory?.name?.trim(), label: newCategory?.label?.trim(), color: newCategory?.color }
        : cat
    );

    saveCategories(updatedCategories);
    setEditingCategory(null);
    setNewCategory({ name: '', label: '', color: '#3B82F6' });
    setShowAddForm(false);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Weet je zeker dat je deze categorie wilt verwijderen?')) {
      const updatedCategories = categories?.filter(cat => cat?.id !== categoryId);
      saveCategories(updatedCategories);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setNewCategory({ name: '', label: '', color: '#3B82F6' });
    setShowAddForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Categorieën Beheren</h2>
              <p className="text-blue-100 text-sm">Voeg categorieën toe, bewerk of verwijder ze</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto bg-white dark:bg-gray-800">
          {/* Existing Categories */}
          <div className="space-y-3 mb-6">
            {categories?.map((category) => (
              <div key={category?.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{category?.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{category?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category?.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Form */}
          {showAddForm ? (
            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingCategory ? 'Categorie Bewerken' : 'Nieuwe Categorie Toevoegen'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categorienaam (Engels) *
                  </label>
                  <Input
                    type="text"
                    value={newCategory?.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e?.target?.value }))}
                    placeholder="bijv. Housing, Transportation"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weergavenaam (Nederlands) *
                  </label>
                  <Input
                    type="text"
                    value={newCategory?.label}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, label: e?.target?.value }))}
                    placeholder="bijv. Wonen, Transport"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kleur
                  </label>
                  <div className="flex space-x-2 flex-wrap">
                    {predefinedColors?.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          newCategory?.color === color ? 'border-gray-400 ring-2 ring-gray-300' : 'border-transparent hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    fullWidth
                    className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="button"
                    onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                    fullWidth
                    disabled={!newCategory?.name?.trim() || !newCategory?.label?.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {editingCategory ? 'Bijwerken' : 'Toevoegen'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddForm(true)}
              iconName="Plus"
              iconPosition="left"
              fullWidth
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Nieuwe Categorie Toevoegen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;