import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const IncomeFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedPeriod, 
  onPeriodChange, 
  selectedType, 
  onTypeChange,
  totalCount 
}) => {
  const periodOptions = [
    { value: 'all', label: 'Alle periodes' },
    { value: 'current-month', label: 'Deze maand' },
    { value: 'last-month', label: 'Vorige maand' },
    { value: 'current-year', label: 'Dit jaar' },
    { value: 'last-year', label: 'Vorig jaar' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Alle types' },
    { value: 'salary', label: 'Salaris' },
    { value: 'additional', label: 'Extra inkomsten' }
  ];

  const clearFilters = () => {
    onSearchChange('');
    onPeriodChange('all');
    onTypeChange('all');
  };

  const hasActiveFilters = searchTerm || selectedPeriod !== 'all' || selectedType !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft mb-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
        {/* Search */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            Zoeken
          </label>
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Zoek op bron of notities..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* Period Filter */}
        <div className="min-w-[200px]">
          <Select
            label="Periode"
            options={periodOptions}
            value={selectedPeriod}
            onChange={onPeriodChange}
          />
        </div>

        {/* Type Filter */}
        <div className="min-w-[180px]">
          <Select
            label="Type"
            options={typeOptions}
            value={selectedType}
            onChange={onTypeChange}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} className="mr-2" />
              Wissen
            </Button>
          </div>
        )}
      </div>
      {/* Results Count */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? 'inkomstenbron' : 'inkomstenbronnen'} gevonden
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={14} />
            <span>Filters actief</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeFilters;