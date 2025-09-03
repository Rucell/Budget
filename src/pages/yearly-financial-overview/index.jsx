import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import YearSelector from './components/YearSelector';
import ChartTypeToggle from './components/ChartTypeToggle';
import ExportMenu from './components/ExportMenu';
import AnnualSummaryCards from './components/AnnualSummaryCards';
import MonthlyIncomeChart from './components/MonthlyIncomeChart';
import ExpenseTrendChart from './components/ExpenseTrendChart';
import NetBalanceChart from './components/NetBalanceChart';
import CategoryFilter from './components/CategoryFilter';
import SavingsContributionChart from './components/SavingsContributionChart';
import CategoryBreakdownChart from './components/CategoryBreakdownChart';
import PeriodFilter from './components/PeriodFilter';
import IncomeSourceChart from './components/IncomeSourceChart';
import { storage } from '../../utils/localStorage';

import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const YearlyFinancialOverview = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [chartType, setChartType] = useState('bar');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Load actual data from localStorage instead of mock data
  const [actualData, setActualData] = useState({});
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Load real data from localStorage and generate year data
    const expenses = storage?.getExpenses() || [];
    const variableExpenses = storage?.getVariableExpenses() || [];
    const income = storage?.getIncome() || [];
    const savingsGoals = storage?.getSavingsGoals() || [];

    // Extract available years from actual data
    const allYears = new Set();
    [...expenses, ...variableExpenses, ...income, ...savingsGoals]?.forEach(item => {
      if (item?.createdAt) {
        const year = new Date(item.createdAt)?.getFullYear();
        allYears?.add(year);
      }
    });

    const yearsArray = Array.from(allYears)?.sort((a, b) => b - a);
    
    // If no data exists, show current year as option
    if (yearsArray?.length === 0) {
      yearsArray?.push(new Date()?.getFullYear());
    }

    setAvailableYears(yearsArray);

    // Generate yearly data structure from actual data
    const yearlyData = {};
    yearsArray?.forEach(year => {
      const yearExpenses = [...expenses, ...variableExpenses]?.filter(item => 
        new Date(item?.createdAt)?.getFullYear() === year
      );
      const yearIncome = income?.filter(item => 
        new Date(item?.createdAt)?.getFullYear() === year
      );
      const yearSavings = savingsGoals?.filter(item => 
        new Date(item?.createdAt)?.getFullYear() === year
      );

      // Generate monthly data for the year based on actual user data
      const monthlyData = [];
      for (let month = 0; month < 12; month++) {
        const monthExpenses = yearExpenses?.filter(item => 
          new Date(item?.createdAt)?.getMonth() === month
        );
        const monthIncome = yearIncome?.filter(item => 
          new Date(item?.createdAt)?.getMonth() === month
        );
        
        const totalExpenses = monthExpenses?.reduce((sum, exp) => sum + parseFloat(exp?.amount || 0), 0);
        const totalIncome = monthIncome?.reduce((sum, inc) => sum + parseFloat(inc?.amount || 0), 0);
        const netBalance = totalIncome - totalExpenses;
        
        const monthNames = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
        
        // Generate expense breakdown based on actual categories in user data
        const expenseByCategory = {};
        monthExpenses?.forEach(expense => {
          const category = expense?.category || 'other';
          expenseByCategory[category] = (expenseByCategory?.[category] || 0) + parseFloat(expense?.amount || 0);
        });

        // Generate income breakdown based on actual sources in user data
        const incomeBySource = {};
        monthIncome?.forEach(income => {
          const source = income?.source || income?.category || 'salary';
          incomeBySource[source] = (incomeBySource?.[source] || 0) + parseFloat(income?.amount || 0);
        });
        
        monthlyData?.push({
          month: monthNames?.[month],
          income: totalIncome,
          expenses: totalExpenses,
          netBalance: netBalance,
          savings: Math.max(0, netBalance > 0 ? netBalance * 0.1 : 0), // Conservative 10% savings when positive
          processedDate: new Date(year, month, new Date(year, month + 1, 0).getDate())?.toISOString(),
          incomeBreakdown: incomeBySource,
          expenseBreakdown: expenseByCategory
        });
      }

      // Calculate yearly summary from actual data
      const summary = {
        totalIncome: monthlyData?.reduce((sum, month) => sum + month?.income, 0),
        totalExpenses: monthlyData?.reduce((sum, month) => sum + month?.expenses, 0),
        totalSavings: monthlyData?.reduce((sum, month) => sum + month?.savings, 0),
        netChange: monthlyData?.reduce((sum, month) => sum + month?.netBalance, 0)
      };

      // Aggregate income by source across all months
      const allIncomeBySource = {};
      monthlyData?.forEach(month => {
        Object?.entries(month?.incomeBreakdown || {})?.forEach(([source, amount]) => {
          allIncomeBySource[source] = (allIncomeBySource?.[source] || 0) + amount;
        });
      });

      // Aggregate expenses by category across all months  
      const allExpensesByCategory = {};
      monthlyData?.forEach(month => {
        Object?.entries(month?.expenseBreakdown || {})?.forEach(([category, amount]) => {
          allExpensesByCategory[category] = (allExpensesByCategory?.[category] || 0) + amount;
        });
      });

      summary.incomeBySource = allIncomeBySource;
      summary.expensesByCategory = allExpensesByCategory;

      yearlyData[year] = {
        monthlyData,
        summary
      };
    });

    setActualData(yearlyData);
  }, []);

  const categories = ['Huisvesting', 'Energie & Nutsvoorzieningen', 'Verzekeringen', 'Vervoer', 'Abonnementen & Media', 'Overig'];

  useEffect(() => {
    setSelectedCategories(categories);
  }, []);

  // Filter data based on selected period
  const getFilteredData = (yearData, period) => {
    if (!yearData?.monthlyData || period === 'all') {
      return yearData;
    }

    let filteredMonths = [];
    const monthlyData = yearData?.monthlyData;

    switch (period) {
      case 'q1':
        filteredMonths = monthlyData?.slice(0, 3);
        break;
      case 'q2':
        filteredMonths = monthlyData?.slice(3, 6);
        break;
      case 'q3':
        filteredMonths = monthlyData?.slice(6, 9);
        break;
      case 'q4':
        filteredMonths = monthlyData?.slice(9, 12);
        break;
      case 'jan':
        filteredMonths = [monthlyData?.[0]];
        break;
      case 'feb':
        filteredMonths = [monthlyData?.[1]];
        break;
      case 'mar':
        filteredMonths = [monthlyData?.[2]];
        break;
      case 'apr':
        filteredMonths = [monthlyData?.[3]];
        break;
      case 'may':
        filteredMonths = [monthlyData?.[4]];
        break;
      case 'jun':
        filteredMonths = [monthlyData?.[5]];
        break;
      case 'jul':
        filteredMonths = [monthlyData?.[6]];
        break;
      case 'aug':
        filteredMonths = [monthlyData?.[7]];
        break;
      case 'sep':
        filteredMonths = [monthlyData?.[8]];
        break;
      case 'oct':
        filteredMonths = [monthlyData?.[9]];
        break;
      case 'nov':
        filteredMonths = [monthlyData?.[10]];
        break;
      case 'dec':
        filteredMonths = [monthlyData?.[11]];
        break;
      default:
        filteredMonths = monthlyData;
    }

    // Calculate summary for filtered period
    const summary = {
      totalIncome: filteredMonths?.reduce((sum, month) => sum + month?.income, 0),
      totalExpenses: filteredMonths?.reduce((sum, month) => sum + month?.expenses, 0),
      totalSavings: filteredMonths?.reduce((sum, month) => sum + month?.savings, 0),
      netChange: filteredMonths?.reduce((sum, month) => sum + month?.netBalance, 0),
      incomeBySource: yearData?.summary?.incomeBySource,
      expensesByCategory: yearData?.summary?.expensesByCategory
    };

    return {
      ...yearData,
      monthlyData: filteredMonths,
      summary
    };
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleCategoryChange = (category, checked) => {
    if (category === 'all') {
      setSelectedCategories(categories);
    } else if (category === 'none') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        checked 
          ? [...prev, category]
          : prev?.filter(cat => cat !== category)
      );
    }
  };

  const handleExport = (type) => {
    const currentData = actualData?.[selectedYear];
    const filename = `jaaroverzicht-${selectedYear}`;
    
    switch (type) {
      case 'excel':
        console.log(`Exporting to Excel: ${filename}.xlsx`);
        alert(`Excel export gestart voor ${selectedYear}`);
        break;
      case 'csv':
        console.log(`Exporting to CSV: ${filename}.csv`);
        alert(`CSV export gestart voor ${selectedYear}`);
        break;
      case 'pdf':
        console.log(`Exporting to PDF: ${filename}.pdf`);
        alert(`PDF export gestart voor ${selectedYear}`);
        break;
      default:
        break;
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const currentYearData = getFilteredData(actualData?.[selectedYear] || { monthlyData: [], summary: { totalIncome: 0, totalExpenses: 0, totalSavings: 0, netChange: 0, incomeBySource: {}, expensesByCategory: {} }}, selectedPeriod);
  const previousYearData = actualData?.[selectedYear - 1];

  // Check if there's any data
  const hasData = Object.keys(actualData)?.length > 0 && currentYearData?.summary?.totalIncome > 0;

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-16">
          {/* Modern Header */}
          <div className="bg-white border-b border-gray-100 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jaaroverzicht</h1>
                <p className="text-gray-600">Uitgebreide financiële analyse en trends voor het geselecteerde jaar</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <NavigationBreadcrumb />
            
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <Icon name="BarChart3" size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Geen financiële gegevens beschikbaar
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Er zijn nog geen inkomsten of uitgaven geregistreerd. Begin met het toevoegen van je financiële gegevens om een jaaroverzicht te zien.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => window.location.href = '/income-management'}
                    iconName="TrendingUp"
                    iconPosition="left"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Inkomsten toevoegen
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/fixed-expenses-management'}
                    iconName="CreditCard"
                    iconPosition="left"
                  >
                    Uitgaven toevoegen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jaaroverzicht</h1>
              <p className="text-gray-600">Uitgebreide financiële analyse en trends voor het geselecteerde jaar</p>
            </div>
            <ExportMenu onExport={handleExport} />
          </div>
        </div>

        <div className="p-8">
          <NavigationBreadcrumb />
          
          {/* Controls Header */}
          <div className="sticky top-16 z-30 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 mb-8 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <YearSelector
                  selectedYear={selectedYear}
                  onYearChange={handleYearChange}
                  availableYears={availableYears}
                />
                <ChartTypeToggle
                  chartType={chartType}
                  onChartTypeChange={handleChartTypeChange}
                />
              </div>
            </div>
          </div>

          {/* Annual Summary Cards */}
          <AnnualSummaryCards
            summaryData={currentYearData?.summary}
            previousYearData={previousYearData?.summary}
          />

          {/* Charts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Charts Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Monthly Income Chart */}
              <MonthlyIncomeChart
                data={currentYearData?.monthlyData}
                chartType={chartType}
              />

              {/* Expense Trend Chart */}
              <ExpenseTrendChart
                data={currentYearData?.monthlyData}
                chartType={chartType}
              />

              {/* Net Balance Chart */}
              <NetBalanceChart
                data={currentYearData?.monthlyData}
                chartType={chartType}
              />

              {/* Category Breakdown Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryBreakdownChart
                  data={currentYearData?.summary?.expensesByCategory}
                  title="Uitgaven per Categorie"
                  type="expenses"
                />
                <IncomeSourceChart
                  data={currentYearData?.summary?.incomeBySource}
                  title="Inkomsten per Bron"
                />
              </div>

              {/* Savings Contribution Chart */}
              <SavingsContributionChart
                data={currentYearData?.monthlyData}
                chartType={chartType}
              />
            </div>

            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Period Filter */}
                <PeriodFilter
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={handlePeriodChange}
                  selectedYear={selectedYear}
                />

                <CategoryFilter
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                />
                
                {/* Quick Stats */}
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Snelle Statistieken
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Gemiddeld inkomen</span>
                      <span className="text-xs font-medium text-gray-900">
                        €{Math.round(currentYearData?.summary?.totalIncome / (currentYearData?.monthlyData?.length || 12))?.toLocaleString('nl-NL')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Gemiddelde uitgaven</span>
                      <span className="text-xs font-medium text-gray-900">
                        €{Math.round(currentYearData?.summary?.totalExpenses / (currentYearData?.monthlyData?.length || 12))?.toLocaleString('nl-NL')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Spaarpercentage</span>
                      <span className="text-xs font-medium text-green-600">
                        {currentYearData?.summary?.totalIncome > 0 ? ((currentYearData?.summary?.totalSavings / currentYearData?.summary?.totalIncome) * 100)?.toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Geselecteerde periode</span>
                      <span className="text-xs font-medium text-indigo-600">
                        {selectedPeriod === 'all' ? 'Hele jaar' : selectedPeriod?.startsWith('q') ? `Q${selectedPeriod?.slice(1)}` : 
                         selectedPeriod?.charAt(0)?.toUpperCase() + selectedPeriod?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default YearlyFinancialOverview;