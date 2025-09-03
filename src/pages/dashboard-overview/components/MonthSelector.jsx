import React from 'react';
import MonthYearPicker from '../../../components/ui/MonthYearPicker';
import { getAvailableMonths } from '../../../utils/dateUtils';
import { storage } from '../../../utils/localStorage';

const MonthSelector = ({ currentMonth, onMonthChange }) => {
  // Get available months from all data sources
  const getAllData = () => {
    return [
      ...storage?.getExpenses(),
      ...storage?.getVariableExpenses(),
      ...storage?.getIncome(),
    ];
  };

  const availableMonths = getAvailableMonths(getAllData());

  return (
    <div className="flex justify-center mb-6">
      <MonthYearPicker
        selectedMonth={currentMonth}
        onMonthChange={onMonthChange}
        availableMonths={availableMonths}
        className="bg-card border border-border rounded-lg px-6 py-3 shadow-soft"
      />
    </div>
  );
};

export default MonthSelector;