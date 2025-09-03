import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DashboardOverview from './pages/dashboard-overview';
import IncomeManagement from './pages/income-management';
import DataExportSettings from './pages/data-export-settings';
import YearlyFinancialOverview from './pages/yearly-financial-overview';
import FixedExpensesManagement from './pages/fixed-expenses-management';
import FixedExpenseCategoriesManagement from './pages/fixed-expense-categories-management';
import VariableExpensesManagement from './pages/variable-expenses-management';
import SavingsGoalsTracking from './pages/savings-goals-tracking';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/income-management" element={<IncomeManagement />} />
        <Route path="/data-export-settings" element={<DataExportSettings />} />
        <Route path="/yearly-financial-overview" element={<YearlyFinancialOverview />} />
        <Route path="/fixed-expenses-management" element={<FixedExpensesManagement />} />
        <Route path="/fixed-expense-categories-management" element={<FixedExpenseCategoriesManagement />} />
        <Route path="/variable-expenses-management" element={<VariableExpensesManagement />} />
        <Route path="/savings-goals-tracking" element={<SavingsGoalsTracking />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;