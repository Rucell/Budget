import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const YearSelector = ({ selectedYear, onYearChange, availableYears }) => {
  const yearOptions = availableYears?.map(year => ({
    value: year?.toString(),
    label: year?.toString()
  }));

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Icon name="Calendar" size={20} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Jaar:</span>
      </div>
      <div className="min-w-[120px]">
        <Select
          options={yearOptions}
          value={selectedYear?.toString()}
          onChange={(value) => onYearChange(parseInt(value))}
          placeholder="Selecteer jaar"
        />
      </div>
    </div>
  );
};

export default YearSelector;