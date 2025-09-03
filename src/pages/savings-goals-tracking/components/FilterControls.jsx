import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  statusFilter, 
  onStatusFilterChange, 
  sortBy, 
  onSortByChange, 
  onExportData 
}) => {
  const statusOptions = [
    { value: 'all', label: 'Alle doelen' },
    { value: 'active', label: 'Actieve doelen' },
    { value: 'completed', label: 'Voltooide doelen' },
    { value: 'paused', label: 'Gepauzeerde doelen' }
  ];

  const sortOptions = [
    { value: 'progress', label: 'Voortgang (hoog naar laag)' },
    { value: 'progress-asc', label: 'Voortgang (laag naar hoog)' },
    { value: 'target-date', label: 'Streefdatum (vroeg naar laat)' },
    { value: 'target-date-desc', label: 'Streefdatum (laat naar vroeg)' },
    { value: 'target-amount', label: 'Streefbedrag (hoog naar laag)' },
    { value: 'target-amount-asc', label: 'Streefbedrag (laag naar hoog)' },
    { value: 'created', label: 'Aangemaakt (nieuw naar oud)' },
    { value: 'created-asc', label: 'Aangemaakt (oud naar nieuw)' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
          <div className="flex-1">
            <Select
              label="Filter op status"
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              className="w-full"
            />
          </div>
          
          <div className="flex-1">
            <Select
              label="Sorteren op"
              options={sortOptions}
              value={sortBy}
              onChange={onSortByChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onExportData}
            iconName="Download"
            iconPosition="left"
            className="whitespace-nowrap"
          >
            Exporteren
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;