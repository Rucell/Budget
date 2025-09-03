import React, { useState } from 'react';
import Button from './Button';

import Icon from '../AppIcon';
import { formatMonth, getCurrentMonth, getPreviousMonth, getNextMonth, getMonthKey } from '../../utils/dateUtils';

const MonthYearPicker = ({ 
  selectedMonth, 
  onMonthChange, 
  availableMonths = [], 
  className = '',
  showNavigation = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentDate = selectedMonth || getCurrentMonth();
  const currentMonthKey = getMonthKey(currentDate);
  
  const handlePreviousMonth = () => {
    const prevMonth = getPreviousMonth(currentDate);
    onMonthChange?.(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = getNextMonth(currentDate);
    onMonthChange?.(nextMonth);
  };

  const handleMonthSelect = (monthKey) => {
    const [year, month] = monthKey?.split('-');
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    onMonthChange?.(selectedDate);
    setIsOpen(false);
  };

  // Create dropdown options from available months
  const monthOptions = availableMonths?.map(monthKey => {
    const [year, month] = monthKey?.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return {
      value: monthKey,
      label: formatMonth(date)
    };
  });

  // If no available months provided, create a basic current month option
  if (!monthOptions?.length) {
    monthOptions?.push({
      value: currentMonthKey,
      label: formatMonth(currentDate)
    });
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Previous Month Button */}
      {showNavigation && (
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousMonth}
          className="px-2"
        >
          <Icon name="ChevronLeft" size={16} />
        </Button>
      )}
      {/* Month/Year Display with Dropdown */}
      <div className="relative">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="text-lg font-semibold px-3 py-2 hover:bg-accent"
        >
          {formatMonth(currentDate)}
          <Icon name="ChevronDown" size={16} className="ml-2" />
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 z-20 bg-popover border border-border rounded-lg shadow-card min-w-[200px]">
            <div className="py-2 max-h-60 overflow-y-auto">
              {monthOptions?.map(option => (
                <button
                  key={option?.value}
                  onClick={() => handleMonthSelect(option?.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-accent nav-transition ${
                    option?.value === currentMonthKey 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-popover-foreground'
                  }`}
                >
                  {option?.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Next Month Button */}
      {showNavigation && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          className="px-2"
        >
          <Icon name="ChevronRight" size={16} />
        </Button>
      )}
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MonthYearPicker;