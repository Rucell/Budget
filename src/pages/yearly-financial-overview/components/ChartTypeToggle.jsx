import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ChartTypeToggle = ({ chartType, onChartTypeChange }) => {
  const chartTypes = [
    { value: 'bar', label: 'Staafdiagram', icon: 'BarChart3' },
    { value: 'line', label: 'Lijndiagram', icon: 'TrendingUp' },
    { value: 'area', label: 'Vlakdiagram', icon: 'Activity' }
  ];

  return (
    <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
      {chartTypes?.map((type) => (
        <Button
          key={type?.value}
          variant={chartType === type?.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChartTypeChange(type?.value)}
          className="h-8 px-3"
        >
          <Icon name={type?.icon} size={16} />
          <span className="ml-2 hidden sm:inline">{type?.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ChartTypeToggle;