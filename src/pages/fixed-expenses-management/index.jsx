import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';

import MonthYearPicker from '../../components/ui/MonthYearPicker';

import CategorySummary from '../../components/ui/CategorySummary';

import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Sidebar from '../../components/ui/Sidebar';
import FinancialCard from '../../components/ui/FinancialCard';
import TransactionList from '../../components/ui/TransactionList';
import CategoryManagement from './components/CategoryManagement';

import ExpenseCard from './components/ExpenseCard';
import ExpenseForm from './components/ExpenseForm';
import CategoryFilter from './components/CategoryFilter';
import ExpenseTable from './components/ExpenseTable';

import { storage } from '../../utils/localStorage';
import { getMonthKey, filterDataByMonth, formatMonth, getPreviousMonth, getAvailableMonths } from '../../utils/dateUtils';
import CashflowChart from '../dashboard-overview/components/CashflowChart';


const FixedExpensesManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = storage?.getExpenses();
    setExpenses(savedExpenses);
  }, []);

  // Save to localStorage whenever expenses change
  useEffect(() => {
    storage?.setExpenses(expenses);
  }, [expenses]);

  // Load custom categories
  useEffect(() => {
    const savedCategories = storage?.get('familybudget-expense-categories', []);
    setCustomCategories(savedCategories);
  }, []);

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

  // Filter and search expenses
  const filteredExpenses = useMemo(() => {
    let filtered = currentMonthExpenses;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(expense => expense?.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered?.filter(expense =>
        expense?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        expense?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        (expense?.notes && expense?.notes?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
      );
    }

    // Sort expenses
    filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      if (sortField === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortField === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue?.toString()?.toLowerCase();
        bValue = bValue?.toString()?.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [currentMonthExpenses, selectedCategory, searchTerm, sortField, sortDirection]);

  // Calculate expense counts by category
  const expenseCounts = useMemo(() => {
    const counts = {};
    currentMonthExpenses?.forEach(expense => {
      counts[expense.category] = (counts?.[expense?.category] || 0) + 1;
    });
    return counts;
  }, [currentMonthExpenses]);

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
    if (window.confirm('Weet je zeker dat je deze uitgave wilt verwijderen?')) {
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

  const handleExportData = () => {
    const csvContent = [
      ['Bedrag', 'Categorie', 'Beschrijving', 'Notities', 'Datum']?.join(','),
      ...expenses?.map(expense => [
        expense?.amount,
        expense?.category,
        `"${expense?.description}"`,
        `"${expense?.notes || ''}"`,
        new Date(expense.createdAt)?.toLocaleDateString('nl-NL')
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `uitgaven_${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleCategoriesUpdate = (newCategories) => {
    setCustomCategories(newCategories);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vaste Uitgaven</h1>
              <p className="text-gray-600">Beheer je vaste uitgaven en categorieën</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek uitgaven..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsCategoryManagementOpen(true)}
                iconName="Settings"
                iconPosition="left"
                className="border-gray-200"
              >
                Categorieën
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Month Navigation */}
          <div className="mb-8">
            <MonthYearPicker
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              availableMonths={availableMonths}
              className="justify-center"
            />
          </div>

          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FinancialCard
              title="Totale Vaste Uitgaven"
              amount={currentTotal}
              type="expenses"
              className="md:col-span-2"
              trend={((currentTotal - previousTotal) / previousTotal * 100) || 0}
            />
            <FinancialCard
              title="Aantal Uitgaven"
              amount={currentMonthExpenses?.length}
              type="info"
              trend={0}
            />
            <FinancialCard
              title="Gemiddelde Uitgave"
              amount={currentTotal / (currentMonthExpenses?.length || 1)}
              type="info"
              trend={0}
            />
          </div>

          {/* Charts and Category Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Expense Trend Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Uitgaven Trend</h3>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Vaste Uitgaven</span>
                    </div>
                  </div>
                </div>
                <CashflowChart 
                  data={[
                    { period: 'Jan', expenses: currentTotal/12, netBalance: -currentTotal/12 },
                    { period: 'Feb', expenses: currentTotal/12, netBalance: -currentTotal/12 },
                    { period: 'Mar', expenses: currentTotal/12, netBalance: -currentTotal/12 },
                    { period: 'Apr', expenses: currentTotal/12, netBalance: -currentTotal/12 },
                    { period: 'May', expenses: currentTotal/12, netBalance: -currentTotal/12 },
                    { period: 'Jun', expenses: currentTotal/12, netBalance: -currentTotal/12 },
                  ]} 
                />
              </div>
            </div>

            {/* Expense Breakdown Pie Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Uitgaven per Categorie</h3>
              </div>
              <CategorySummary
                data={currentMonthExpenses}
                title=""
                showTitle={false}
              />
            </div>
          </div>

          {/* Transaction List */}
          <div className="mb-8">
            <TransactionList transactions={currentMonthExpenses} />
          </div>

          {/* Expense Management Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vaste Uitgaven Beheer</h3>
                <p className="text-gray-600">Beheer je maandelijkse vaste kosten</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </Button>
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

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-gray-50 rounded-xl p-4">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    expenseCounts={expenseCounts}
                  />
                </div>
              </div>

              <div className="flex-1">
                {viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredExpenses?.map((expense) => (
                      <ExpenseCard
                        key={expense?.id}
                        expense={expense}
                        onEdit={handleEditExpense}
                        onDelete={handleDeleteExpense}
                      />
                    ))}
                    {filteredExpenses?.length === 0 && (
                      <div className="col-span-full bg-gray-50 rounded-xl p-8 text-center">
                        <Icon name="Receipt" size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Geen uitgaven gevonden
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {searchTerm || selectedCategory !== 'all' ? 'Probeer je zoekopdracht aan te passen of filter te wijzigen.' 
                            : `Geen vaste uitgaven voor ${formatMonth(selectedMonth)}.`
                          }
                        </p>
                        {(!searchTerm && selectedCategory === 'all') && (
                          <Button onClick={handleAddExpense} iconName="Plus" iconPosition="left">
                            Eerste Uitgave Toevoegen
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <ExpenseTable
                    expenses={filteredExpenses}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ExpenseForm
        expense={editingExpense}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isOpen={isFormOpen}
        selectedMonth={selectedMonth}
        customCategories={customCategories}
      />

      <CategoryManagement
        isOpen={isCategoryManagementOpen}
        onClose={() => setIsCategoryManagementOpen(false)}
        onCategoriesUpdate={handleCategoriesUpdate}
      />
    </div>
  );
};

export default FixedExpensesManagement;