import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import MonthYearPicker from '../../components/ui/MonthYearPicker';
import SearchInput from '../../components/ui/SearchInput';
import TrendComparison from '../../components/ui/TrendComparison';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import IncomeCard from './components/IncomeCard';
import IncomeSummary from './components/IncomeSummary';
import IncomeModal from './components/IncomeModal';
import IncomeFilters from './components/IncomeFilters';
import EmptyState from './components/EmptyState';
import { storage } from '../../utils/localStorage';
import { getMonthKey, filterDataByMonth, formatMonth, getPreviousMonth, getAvailableMonths } from '../../utils/dateUtils';

const IncomeManagement = () => {
  const [incomes, setIncomes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const savedIncomes = storage?.getIncome();
    setIncomes(savedIncomes || []);
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever incomes change
  useEffect(() => {
    storage?.setIncome(incomes);
  }, [incomes]);

  // Get available months and filter data
  const availableMonths = useMemo(() => {
    return getAvailableMonths(incomes);
  }, [incomes]);

  const currentMonthIncomes = useMemo(() => {
    const monthKey = getMonthKey(selectedMonth);
    return filterDataByMonth(incomes, monthKey);
  }, [incomes, selectedMonth]);

  const previousMonthIncomes = useMemo(() => {
    const prevMonth = getPreviousMonth(selectedMonth);
    const prevMonthKey = getMonthKey(prevMonth);
    return filterDataByMonth(incomes, prevMonthKey);
  }, [incomes, selectedMonth]);

  // Filter incomes by search and source
  const filteredIncomes = useMemo(() => {
    let filtered = currentMonthIncomes;

    if (selectedSource !== 'all') {
      filtered = filtered?.filter(income => income?.source === selectedSource);
    }

    if (searchTerm) {
      filtered = filtered?.filter(income =>
        income?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        income?.source?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        (income?.notes && income?.notes?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
      );
    }

    return filtered;
  }, [currentMonthIncomes, selectedSource, searchTerm]);

  // Calculate totals
  const currentTotal = useMemo(() => {
    return currentMonthIncomes?.reduce((sum, income) => sum + parseFloat(income?.amount || 0), 0);
  }, [currentMonthIncomes]);

  const previousTotal = useMemo(() => {
    return previousMonthIncomes?.reduce((sum, income) => sum + parseFloat(income?.amount || 0), 0);
  }, [previousMonthIncomes]);

  const handleAddIncome = () => {
    setEditingIncome(null);
    setIsModalOpen(true);
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };

  const handleDeleteIncome = (incomeId) => {
    if (window.confirm('Weet je zeker dat je deze inkomst wilt verwijderen?')) {
      setIncomes(prev => prev?.filter(income => income?.id !== incomeId));
    }
  };

  const handleModalSubmit = (incomeData) => {
    if (editingIncome) {
      setIncomes(prev => prev?.map(income =>
        income?.id === editingIncome?.id ? incomeData : income
      ));
    } else {
      setIncomes(prev => [...prev, incomeData]);
    }
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  // Get unique income sources for filter
  const incomeSources = useMemo(() => {
    const sources = new Set();
    incomes?.forEach(income => {
      if (income?.source) sources?.add(income?.source);
    });
    return Array.from(sources)?.sort();
  }, [incomes]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Inkomsten beheer - FamilyBudget</title>
        <meta name="description" content="Beheer uw inkomstenbronnen, salaris en extra inkomsten met uitgebreide notitie functionaliteit." />
      </Helmet>
      
      <Sidebar />
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inkomsten Beheer</h1>
              <p className="text-gray-600">Beheer je inkomstenbronnen en volg je financiële instroom</p>
            </div>
            
            <Button
              onClick={handleAddIncome}
              iconName="Plus"
              iconPosition="left"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Inkomst Toevoegen
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

          {/* Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TrendComparison
              current={currentTotal}
              previous={previousTotal}
              label={`Totale inkomsten - ${formatMonth(selectedMonth)}`}
            />
            
            <IncomeSummary 
              incomes={currentMonthIncomes} 
              filteredIncomes={filteredIncomes}
            />
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              placeholder="Zoek inkomsten..."
            />
            
            <IncomeFilters
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
              sources={incomeSources}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedPeriod={selectedMonth}
              onPeriodChange={setSelectedMonth}
              selectedType="all"
              onTypeChange={() => {}}
              totalCount={filteredIncomes?.length || 0}
            />
          </div>

          {/* Income Cards */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Icon name="Loader2" size={32} className="animate-spin text-gray-400" />
            </div>
          ) : filteredIncomes?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIncomes?.map((income) => (
                <IncomeCard
                  key={income?.id}
                  income={income}
                  onEdit={handleEditIncome}
                  onDelete={handleDeleteIncome}
                  onToggleNotes={() => {}}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              hasSearch={!!searchTerm}
              hasFilter={selectedSource !== 'all'}
              hasFilters={!!searchTerm || selectedSource !== 'all'}
              onAddIncome={handleAddIncome}
              onClearFilters={() => {
                setSearchTerm('');
                setSelectedSource('all');
              }}
              monthName={formatMonth(selectedMonth)}
            />
          )}
        </div>
      </main>
      
      {/* Floating Action Button */}
      <Button
        onClick={handleAddIncome}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl z-40 bg-indigo-600 hover:bg-indigo-700"
        size="icon"
      >
        <Icon name="Plus" size={24} />
      </Button>
      
      {/* Income Modal */}
      <IncomeModal
        income={editingIncome}
        isOpen={isModalOpen}
        onSubmit={handleModalSubmit}
        onSave={handleModalSubmit}
        onClose={handleModalClose}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default IncomeManagement;