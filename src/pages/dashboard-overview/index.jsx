import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';

import Sidebar from '../../components/ui/Sidebar';
import FinancialCard from '../../components/ui/FinancialCard';
import TransactionList from '../../components/ui/TransactionList';

import SavingsGoalCard from './components/SavingsGoalCard';
import QuickActionCard from './components/QuickActionCard';
import MonthSelector from './components/MonthSelector';
import FinancialAlert from './components/FinancialAlert';


import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CashflowChart from './components/CashflowChart';
import { storage } from '../../utils/localStorage';
import { getMonthKey, filterDataByMonth, getPreviousMonth } from '../../utils/dateUtils';
import CategorySummary from '../../components/ui/CategorySummary';


const DashboardOverview = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [variableExpenses, setVariableExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedExpenses = storage?.getExpenses() || [];
        const loadedVariableExpenses = storage?.getVariableExpenses() || [];
        const loadedIncome = storage?.getIncome() || [];
        const loadedSavingsGoals = storage?.getSavingsGoals() || [];
        
        setExpenses(loadedExpenses);
        setVariableExpenses(loadedVariableExpenses);
        setIncome(loadedIncome);
        setSavingsGoals(loadedSavingsGoals);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        setExpenses([]);
        setVariableExpenses([]);
        setIncome([]);
        setSavingsGoals([]);
      }
    };
    
    loadData();
  }, []);

  // Filter data by selected month
  const currentMonthKey = getMonthKey(currentMonth);
  const previousMonthKey = getMonthKey(getPreviousMonth(currentMonth));

  const currentMonthExpenses = filterDataByMonth(expenses || [], currentMonthKey);
  const currentMonthVariableExpenses = filterDataByMonth(variableExpenses || [], currentMonthKey);
  const currentMonthIncome = filterDataByMonth(income || [], currentMonthKey);

  const previousMonthExpenses = filterDataByMonth(expenses || [], previousMonthKey);
  const previousMonthVariableExpenses = filterDataByMonth(variableExpenses || [], previousMonthKey);
  const previousMonthIncome = filterDataByMonth(income || [], previousMonthKey);

  // Calculate financial data with better null handling
  const totalFixedExpenses = useMemo(() => {
    return currentMonthExpenses?.reduce((sum, exp) => {
      const amount = parseFloat(exp?.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0) || 0;
  }, [currentMonthExpenses]);

  const totalVariableExpenses = useMemo(() => {
    return currentMonthVariableExpenses?.reduce((sum, exp) => {
      const amount = parseFloat(exp?.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0) || 0;
  }, [currentMonthVariableExpenses]);

  const totalExpenses = totalFixedExpenses + totalVariableExpenses;
  
  const totalIncome = useMemo(() => {
    return currentMonthIncome?.reduce((sum, inc) => {
      const amount = parseFloat(inc?.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0) || 0;
  }, [currentMonthIncome]);

  const remainingBalance = totalIncome - totalExpenses;

  // Previous month calculations for trends with better null handling
  const prevTotalFixedExpenses = useMemo(() => {
    return previousMonthExpenses?.reduce((sum, exp) => {
      const amount = parseFloat(exp?.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0) || 0;
  }, [previousMonthExpenses]);

  const prevTotalVariableExpenses = useMemo(() => {
    return previousMonthVariableExpenses?.reduce((sum, exp) => {
      const amount = parseFloat(exp?.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0) || 0;
  }, [previousMonthVariableExpenses]);

  const prevTotalExpenses = prevTotalFixedExpenses + prevTotalVariableExpenses;
  
  const prevTotalIncome = useMemo(() => {
    return previousMonthIncome?.reduce((sum, inc) => {
      const amount = parseFloat(inc?.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0) || 0;
  }, [previousMonthIncome]);

  // Generate cashflow data based on real user financial data
  const cashflowData = useMemo(() => {
    // Show empty state when no actual financial data exists
    if (totalIncome === 0 && totalExpenses === 0) {
      return [
        { period: 'Week 1', income: 0, expenses: 0, netBalance: 0 },
        { period: 'Week 2', income: 0, expenses: 0, netBalance: 0 },
        { period: 'Week 3', income: 0, expenses: 0, netBalance: 0 },
        { period: 'Week 4', income: 0, expenses: 0, netBalance: 0 }
      ];
    }

    // Generate realistic weekly data based on actual monthly totals
    const weeksInMonth = 4;
    const weeklyIncome = totalIncome / weeksInMonth;
    const weeklyExpenses = totalExpenses / weeksInMonth;
    
    // Create weekly breakdown based on actual expense and income distribution
    return Array.from({ length: weeksInMonth }, (_, index) => {
      // Distribute expenses more realistically based on actual user patterns
      const weekExpenses = currentMonthExpenses?.filter((exp, i) => i % weeksInMonth === index)
        ?.reduce((sum, exp) => sum + parseFloat(exp?.amount || 0), 0) || (weeklyExpenses / weeksInMonth);
      
      const weekVariableExpenses = currentMonthVariableExpenses?.filter((exp, i) => i % weeksInMonth === index)
        ?.reduce((sum, exp) => sum + parseFloat(exp?.amount || 0), 0) || (totalVariableExpenses / weeksInMonth);
      
      const weekIncomeAmount = currentMonthIncome?.filter((inc, i) => i % weeksInMonth === index)
        ?.reduce((sum, inc) => sum + parseFloat(inc?.amount || 0), 0) || weeklyIncome;
      
      const totalWeekExpenses = weekExpenses + weekVariableExpenses;
      const netBalance = weekIncomeAmount - totalWeekExpenses;

      return {
        period: `Week ${index + 1}`,
        income: Math.round(weekIncomeAmount || weeklyIncome),
        expenses: Math.round(totalWeekExpenses || weeklyExpenses),
        netBalance: Math.round(netBalance),
        processedDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), (index + 1) * 7)?.toISOString()
      };
    });
  }, [totalIncome, totalExpenses, currentMonthExpenses, currentMonthVariableExpenses, currentMonthIncome, currentMonth]);

  const quickActions = [
    {
      title: "Vaste uitgaven toevoegen",
      description: "Voeg nieuwe vaste uitgaven toe",
      icon: "CreditCard",
      route: "/fixed-expenses-management",
      variant: "primary"
    },
    {
      title: "Variabele uitgaven",
      description: "Beheer wisselende uitgaven",
      icon: "Receipt",
      route: "/variable-expenses-management",
      variant: "warning"
    },
    {
      title: "Inkomsten beheren",
      description: "Beheer je inkomstenbronnen",
      icon: "TrendingUp",
      route: "/income-management",
      variant: "success"
    },
    {
      title: "Spaardoelen bijwerken",
      description: "Werk je spaardoelen bij",
      icon: "Target",
      route: "/savings-goals-tracking",
      variant: "secondary"
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Reload data from localStorage
      const loadedExpenses = storage?.getExpenses() || [];
      const loadedVariableExpenses = storage?.getVariableExpenses() || [];
      const loadedIncome = storage?.getIncome() || [];
      const loadedSavingsGoals = storage?.getSavingsGoals() || [];
      
      setExpenses(loadedExpenses);
      setVariableExpenses(loadedVariableExpenses);
      setIncome(loadedIncome);
      setSavingsGoals(loadedSavingsGoals);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  };

  const getFinancialAlerts = () => {
    const alerts = [];
    
    if (remainingBalance < 0) {
      alerts?.push({
        type: 'danger',
        message: 'Je uitgaven zijn hoger dan je inkomsten deze maand',
        amount: remainingBalance
      });
    } else if (remainingBalance < 200 && remainingBalance >= 0) {
      alerts?.push({
        type: 'warning',
        message: 'Je hebt weinig budget over deze maand',
        amount: remainingBalance
      });
    }

    // Check savings goals near deadline with better error handling
    if (Array.isArray(savingsGoals)) {
      const nearDeadlineGoals = savingsGoals?.filter(goal => {
        try {
          const deadline = new Date(goal?.deadline);
          const today = new Date();
          const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
          const currentAmount = parseFloat(goal?.currentAmount || 0);
          const targetAmount = parseFloat(goal?.targetAmount || 0);
          
          return daysUntilDeadline <= 30 && daysUntilDeadline > 0 && currentAmount < targetAmount;
        } catch (error) {
          console.warn('Error processing savings goal:', goal, error);
          return false;
        }
      });

      if (nearDeadlineGoals?.length > 0) {
        alerts?.push({
          type: 'info',
          message: `${nearDeadlineGoals?.length} spaardoel(en) hebben binnenkort hun deadline`
        });
      }
    }

    return alerts;
  };

  const financialAlerts = getFinancialAlerts();

  // Combine all expenses for category summary with better data handling
  const allCurrentExpenses = useMemo(() => {
    const fixedExpenses = currentMonthExpenses?.map(exp => ({ 
      ...exp, 
      type: 'Vast',
      amount: parseFloat(exp?.amount || 0),
      category: exp?.category || 'Onbekend'
    })) || [];
    
    const varExpenses = currentMonthVariableExpenses?.map(exp => ({ 
      ...exp, 
      type: 'Variabel',
      amount: parseFloat(exp?.amount || 0),
      category: exp?.category || 'Onbekend'
    })) || [];
    
    return [...fixedExpenses, ...varExpenses];
  }, [currentMonthExpenses, currentMonthVariableExpenses]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welkom terug! Hier is je financiële overzicht.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoeken..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                loading={refreshing}
                iconName="RefreshCw"
                iconPosition="left"
                className="border-gray-200"
              >
                Vernieuwen
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Month Selector */}
          <div className="mb-8">
            <MonthSelector 
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>

          {/* Financial Alerts */}
          {financialAlerts?.length > 0 && (
            <div className="mb-8">
              {financialAlerts?.map((alert, index) => (
                <FinancialAlert
                  key={index}
                  type={alert?.type}
                  message={alert?.message}
                  amount={alert?.amount}
                />
              ))}
            </div>
          )}

          {/* Financial Overview Cards with better trend calculation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FinancialCard
              title="Balance"
              amount={remainingBalance}
              type="balance"
              trend={prevTotalIncome > 0 ? ((remainingBalance - (prevTotalIncome - prevTotalExpenses)) / prevTotalIncome) * 100 : 0}
              className="md:col-span-2"
            />
            <FinancialCard
              title="Income"
              amount={totalIncome}
              type="income"
              trend={prevTotalIncome > 0 ? ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100 : 0}
            />
            <FinancialCard
              title="Expenses"
              amount={totalExpenses}
              type="expenses"
              trend={prevTotalExpenses > 0 ? ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100 : 0}
            />
          </div>

          {/* Charts and Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Finances Chart - Use real data instead of mock */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Financieel Overzicht</h3>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">Inkomsten</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Uitgaven</span>
                    </div>
                  </div>
                </div>
                <CashflowChart data={cashflowData} />
              </div>
            </div>

            {/* Category Summary - Connected to real data */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uitgaven per Categorie</h3>
              <CategorySummary
                data={allCurrentExpenses}
                title=""
                showTitle={false}
              />
            </div>
          </div>

          {/* Transactions - Connected to real data */}
          <div className="mb-8">
            <TransactionList transactions={allCurrentExpenses} />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Snelle acties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions?.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action?.title}
                  description={action?.description}
                  icon={action?.icon}
                  route={action?.route}
                  variant={action?.variant}
                />
              ))}
            </div>
          </div>

          {/* Savings Goals Section */}
          {savingsGoals?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Spaardoelen</h2>
                <Link to="/savings-goals-tracking">
                  <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
                    Nieuw doel
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savingsGoals?.slice(0, 3)?.map((goal) => (
                  <SavingsGoalCard key={goal?.id} goal={goal} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardOverview;