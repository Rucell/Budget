import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import MonthYearPicker from '../../components/ui/MonthYearPicker';
import SearchInput from '../../components/ui/SearchInput';
import CategorySummary from '../../components/ui/CategorySummary';
import TrendComparison from '../../components/ui/TrendComparison';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VariableExpenseCard from './components/VariableExpenseCard';
import VariableExpenseForm from './components/VariableExpenseForm';
import { storage } from '../../utils/localStorage';
import { getMonthKey, filterDataByMonth, formatMonth, getPreviousMonth, getAvailableMonths } from '../../utils/dateUtils';

const VariableExpensesManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = storage?.getVariableExpenses();
    setExpenses(savedExpenses);
  }, []);

  // Save to localStorage whenever expenses change
  useEffect(() => {
    storage?.setVariableExpenses(expenses);
  }, [expenses]);

  // Get available months and filter data
  const availableMonths = useMemo(() => {
    return getAvailableMonths(expenses);
  }, [expenses]);

  const currentMonthExpenses = useMemo(() => {
    const monthKey = getMonthKey(selectedMonth);
    return filterDataByMonth(expenses, monthKey);
  }, [expenses, selectedMonth]);

  const previousMonthExpenses = useMemo(() => {
    const prevMonth = getPreviousMonth(selectedMonth);
    const prevMonthKey = getMonthKey(prevMonth);
    return filterDataByMonth(expenses, prevMonthKey);
  }, [expenses, selectedMonth]);

  // Search filtered expenses
  const filteredExpenses = useMemo(() => {
    if (!searchTerm) return currentMonthExpenses;
    
    return currentMonthExpenses?.filter(expense =>
      expense?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      expense?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      (expense?.notes && expense?.notes?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
    );
  }, [currentMonthExpenses, searchTerm]);

  // Calculate totals
  const currentTotal = useMemo(() => {
    return currentMonthExpenses?.reduce((sum, expense) => sum + parseFloat(expense?.amount || 0), 0);
  }, [currentMonthExpenses]);

  const previousTotal = useMemo(() => {
    return previousMonthExpenses?.reduce((sum, expense) => sum + parseFloat(expense?.amount || 0), 0);
  }, [previousMonthExpenses]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Weet je zeker dat je deze variabele uitgave wilt verwijderen?')) {
      setExpenses(prev => prev?.filter(expense => expense?.id !== expenseId));
    }
  };

  const handleFormSubmit = (expenseData) => {
    if (editingExpense) {
      setExpenses(prev => prev?.map(expense =>
        expense?.id === editingExpense?.id ? expenseData : expense
      ));
    } else {
      setExpenses(prev => [...prev, expenseData]);
    }
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Variabele Uitgaven</h1>
              <p className="text-gray-600">Beheer je wisselende maandelijkse kosten en uitgaven</p>
            </div>
            
            <Button
              onClick={handleAddExpense}
              iconName="Plus"
              iconPosition="left"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Uitgave Toevoegen
            </Button>
          </div>
        </div>

        <div className="p-8">
          <NavigationBreadcrumb />
          
          {/* Month Navigation */}
          <div className="mb-8">
            <MonthYearPicker
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              availableMonths={availableMonths}
              className="justify-center"
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TrendComparison
              current={currentTotal}
              previous={previousTotal}
              label={`Variabele uitgaven - ${formatMonth(selectedMonth)}`}
            />
            
            <CategorySummary
              data={currentMonthExpenses}
              title="Uitgaven per Categorie"
              className="lg:col-span-1"
            />
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              placeholder="Zoek variabele uitgaven..."
              className="max-w-md"
            />
          </div>

          {/* Expenses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExpenses?.map((expense) => (
              <VariableExpenseCard
                key={expense?.id}
                expense={expense}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            ))}
            
            {filteredExpenses?.length === 0 && (
              <div className="col-span-full bg-white border border-gray-100 rounded-lg p-8 text-center">
                <Icon name="Receipt" size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Geen variabele uitgaven gevonden
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Probeer je zoekopdracht aan te passen.'
                    : `Geen variabele uitgaven voor ${formatMonth(selectedMonth)}.`
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddExpense} iconName="Plus" iconPosition="left">
                    Eerste Uitgave Toevoegen
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Floating Action Button */}
      <Button
        onClick={handleAddExpense}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl z-40 bg-indigo-600 hover:bg-indigo-700"
        size="icon"
      >
        <Icon name="Plus" size={24} />
      </Button>
      
      {/* Expense Form Modal */}
      <VariableExpenseForm
        expense={editingExpense}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isOpen={isFormOpen}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default VariableExpensesManagement;