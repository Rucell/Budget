import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Icon from '../../components/AppIcon';
import CategoryCard from './components/CategoryCard';
import CategoryModal from './components/CategoryModal';
import EmptyState from './components/EmptyState';
import CategoryMergeModal from './components/CategoryMergeModal';
import { storage } from '../../utils/localStorage';

const FixedExpenseCategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'usage', 'created'

  // Default categories
  const defaultCategories = [
    { id: 'housing', name: 'Huisvesting', icon: 'Home', color: '#3B82F6', description: 'Huur, hypotheek, utilities' },
    { id: 'insurance', name: 'Verzekeringen', icon: 'Shield', color: '#10B981', description: 'Alle verzekeringen' },
    { id: 'transport', name: 'Transport', icon: 'Car', color: '#F59E0B', description: 'Auto, OV, brandstof' },
    { id: 'subscriptions', name: 'Abonnementen', icon: 'Smartphone', color: '#8B5CF6', description: 'Streaming, telefoon, internet' },
    { id: 'food', name: 'Voeding', icon: 'ShoppingCart', color: '#EF4444', description: 'Boodschappen, maaltijden' },
    { id: 'healthcare', name: 'Zorgkosten', icon: 'Heart', color: '#EC4899', description: 'Medische kosten' },
    { id: 'debt', name: 'Schulden', icon: 'CreditCard', color: '#6B7280', description: 'Leningen, afbetalingen' },
    { id: 'other', name: 'Overige', icon: 'MoreHorizontal', color: '#64748B', description: 'Andere vaste kosten' }
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedCategories = storage?.get('familybudget-expense-categories', []);
    const savedExpenses = storage?.getExpenses() || [];
    
    // Merge default categories with custom ones
    const allCategories = [...defaultCategories];
    savedCategories?.forEach(savedCat => {
      const existingIndex = allCategories?.findIndex(cat => cat?.id === savedCat?.id);
      if (existingIndex >= 0) {
        allCategories[existingIndex] = savedCat;
      } else {
        allCategories?.push(savedCat);
      }
    });

    setCategories(allCategories);
    setExpenses(savedExpenses);
    setIsLoading(false);
  }, []);

  // Save custom categories to localStorage
  useEffect(() => {
    if (!isLoading) {
      const customCategories = categories?.filter(cat => 
        !defaultCategories?.some(defaultCat => defaultCat?.id === cat?.id) || 
        JSON.stringify(cat) !== JSON.stringify(defaultCategories?.find(defaultCat => defaultCat?.id === cat?.id))
      );
      storage?.set('familybudget-expense-categories', customCategories);
    }
  }, [categories, isLoading]);

  // Calculate usage statistics
  const categoryUsage = useMemo(() => {
    const usage = {};
    expenses?.forEach(expense => {
      const categoryId = expense?.category;
      usage[categoryId] = (usage?.[categoryId] || 0) + 1;
    });
    return usage;
  }, [expenses]);

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let filtered = categories;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered?.filter(category =>
        category?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        category?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Sort categories
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return (categoryUsage?.[b?.id] || 0) - (categoryUsage?.[a?.id] || 0);
        case 'created':
          return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
        case 'name':
        default:
          return a?.name?.localeCompare(b?.name, 'nl');
      }
    });

    return filtered;
  }, [categories, searchTerm, sortBy, categoryUsage]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories?.find(cat => cat?.id === categoryId);
    const usageCount = categoryUsage?.[categoryId] || 0;
    
    if (usageCount > 0) {
      const confirmed = window.confirm(
        `Deze categorie wordt gebruikt door ${usageCount} uitgaven. Als je deze verwijdert, worden deze uitgaven verplaatst naar "Overige". Weet je het zeker?`
      );
      if (!confirmed) return;

      // Move expenses to "other" category
      const updatedExpenses = expenses?.map(expense => 
        expense?.category === categoryId 
          ? { ...expense, category: 'other' }
          : expense
      );
      setExpenses(updatedExpenses);
      storage?.setExpenses(updatedExpenses);
    }

    setCategories(prev => prev?.filter(cat => cat?.id !== categoryId));
  };

  const handleModalSubmit = (categoryData) => {
    if (editingCategory) {
      setCategories(prev => prev?.map(cat =>
        cat?.id === editingCategory?.id ? categoryData : cat
      ));
    } else {
      setCategories(prev => [...prev, categoryData]);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleMergeCategories = () => {
    if (selectedCategories?.length < 2) {
      alert('Selecteer minimaal 2 categorieën om samen te voegen');
      return;
    }
    setIsMergeModalOpen(true);
  };

  const handleMergeSubmit = (targetCategoryId, categoriesToMerge) => {
    // Update expenses to use target category
    const updatedExpenses = expenses?.map(expense => {
      if (categoriesToMerge?.includes(expense?.category)) {
        return { ...expense, category: targetCategoryId };
      }
      return expense;
    });

    // Remove merged categories (except target)
    const updatedCategories = categories?.filter(cat => 
      !categoriesToMerge?.includes(cat?.id) || cat?.id === targetCategoryId
    );

    setExpenses(updatedExpenses);
    setCategories(updatedCategories);
    storage?.setExpenses(updatedExpenses);
    
    setIsMergeModalOpen(false);
    setSelectedCategories([]);
  };

  const handleExportCategories = () => {
    const exportData = {
      categories: categories,
      exportDate: new Date()?.toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json;charset=utf-8;' 
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `expense-categories_${new Date()?.toISOString()?.split('T')?.[0]}.json`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleImportCategories = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e?.target?.result);
        if (importData?.categories) {
          const confirmed = window.confirm(
            'Dit zal je huidige categorieën overschrijven. Weet je het zeker?'
          );
          if (confirmed) {
            setCategories(importData?.categories);
          }
        }
      } catch (error) {
        alert('Ongeldig bestand formaat');
      }
    };
    reader?.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Categorie Beheer - FamilyBudget</title>
        <meta name="description" content="Beheer je uitgaven categorieën voor betere financiële organisatie." />
      </Helmet>
      
      <Sidebar />
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categorie Beheer</h1>
              <p className="text-gray-600">Beheer je uitgaven categorieën voor betere organisatie</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedCategories?.length > 0 && (
                <Button
                  onClick={handleMergeCategories}
                  variant="outline"
                  iconName="Merge"
                  iconPosition="left"
                >
                  Samenvoegen ({selectedCategories?.length})
                </Button>
              )}
              <Button
                onClick={handleAddCategory}
                iconName="Plus"
                iconPosition="left"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Categorie Toevoegen
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <NavigationBreadcrumb />
          
          {/* Control Bar */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  placeholder="Zoek categorieën..."
                  className="md:w-80"
                />
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Sorteer op:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e?.target?.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="name">Naam</option>
                    <option value="usage">Gebruik</option>
                    <option value="created">Aangemaakt</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportCategories}
                  className="hidden"
                  id="import-categories"
                />
                <label htmlFor="import-categories">
                  <Button
                    as="span"
                    variant="outline"
                    iconName="Upload"
                    iconPosition="left"
                    className="cursor-pointer"
                  >
                    Importeren
                  </Button>
                </label>
                <Button
                  onClick={handleExportCategories}
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                >
                  Exporteren
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                {filteredCategories?.length} van {categories?.length} categorieën
              </div>
              {selectedCategories?.length > 0 && (
                <div className="text-sm text-indigo-600">
                  {selectedCategories?.length} geselecteerd
                </div>
              )}
            </div>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Icon name="Loader2" size={32} className="animate-spin text-gray-400" />
            </div>
          ) : filteredCategories?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories?.map((category) => (
                <CategoryCard
                  key={category?.id}
                  category={category}
                  usage={categoryUsage?.[category?.id] || 0}
                  isSelected={selectedCategories?.includes(category?.id)}
                  onSelect={(selected) => {
                    if (selected) {
                      setSelectedCategories(prev => [...prev, category?.id]);
                    } else {
                      setSelectedCategories(prev => prev?.filter(id => id !== category?.id));
                    }
                  }}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              hasSearch={!!searchTerm}
              onAddCategory={handleAddCategory}
              onClearSearch={() => setSearchTerm('')}
            />
          )}
        </div>
      </main>
      
      {/* Floating Action Button */}
      <Button
        onClick={handleAddCategory}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl z-40 bg-indigo-600 hover:bg-indigo-700"
        size="icon"
      >
        <Icon name="Plus" size={24} />
      </Button>
      
      {/* Modals */}
      <CategoryModal
        category={editingCategory}
        isOpen={isModalOpen}
        onSubmit={handleModalSubmit}
        onClose={handleModalClose}
        existingCategories={categories}
      />

      <CategoryMergeModal
        isOpen={isMergeModalOpen}
        categories={categories?.filter(cat => selectedCategories?.includes(cat?.id))}
        onSubmit={handleMergeSubmit}
        onClose={() => {
          setIsMergeModalOpen(false);
          setSelectedCategories([]);
        }}
      />
    </div>
  );
};

export default FixedExpenseCategoriesManagement;