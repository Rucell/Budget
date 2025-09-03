import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PeriodFilter = ({ selectedPeriod, onPeriodChange, selectedYear }) => {
  const periodOptions = [
    { value: 'all', label: 'Hele jaar' },
    { value: 'q1', label: 'Q1 (Jan-Mrt)' },
    { value: 'q2', label: 'Q2 (Apr-Jun)' },
    { value: 'q3', label: 'Q3 (Jul-Sep)' },
    { value: 'q4', label: 'Q4 (Okt-Dec)' },
    { value: 'jan', label: 'Januari' },
    { value: 'feb', label: 'Februari' },
    { value: 'mar', label: 'Maart' },
    { value: 'apr', label: 'April' },
    { value: 'may', label: 'Mei' },
    { value: 'jun', label: 'Juni' },
    { value: 'jul', label: 'Juli' },
    { value: 'aug', label: 'Augustus' },
    { value: 'sep', label: 'September' },
    { value: 'oct', label: 'Oktober' },
    { value: 'nov', label: 'November' },
    { value: 'dec', label: 'December' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Calendar" size={18} className="text-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">Periode Filter</h4>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Selecteer periode voor {selectedYear}:
          </label>
          <Select
            options={periodOptions}
            value={selectedPeriod}
            onChange={onPeriodChange}
            placeholder="Selecteer periode"
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>Filter gegevens per kwartaal of per maand om gedetailleerde inzichten te krijgen.</p>
        </div>
      </div>
    </div>
  );
};

export default PeriodFilter;