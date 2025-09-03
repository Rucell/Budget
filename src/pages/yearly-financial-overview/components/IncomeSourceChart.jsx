import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IncomeSourceChart = ({ data, title = "Inkomsten per Bron" }) => {
  const [chartType, setChartType] = useState('pie');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  // Color palette for income sources
  const COLORS = [
    'var(--color-success)', 
    'var(--color-primary)',
    'var(--color-warning)',
    'var(--color-info)',
    '#10B981', // emerald
    '#8B5CF6'  // purple
  ];

  const chartData = data ? Object.entries(data)?.map(([source, value], index) => ({
    name: source === 'salary' ? 'Salaris' : source === 'freelance' ? 'Freelance' : 'Overig',
    value: value,
    color: COLORS?.[index % COLORS?.length]
  })) : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      const percentage = ((data?.value / chartData?.reduce((sum, item) => sum + item?.value, 0)) * 100)?.toFixed(1);
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-card">
          <p className="text-sm font-medium text-popover-foreground mb-1">{data?.payload?.name}</p>
          <p className="text-sm text-success">
            Bedrag: {formatCurrency(data?.value)}
          </p>
          <p className="text-xs text-muted-foreground">
            Percentage: {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'pie') {
      return (
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={40}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry?.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      );
    }

    return (
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="name" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={formatCurrency}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry?.color} />
          ))}
        </Bar>
      </BarChart>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          <Button
            variant={chartType === 'pie' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('pie')}
          >
            <Icon name="PieChart" size={16} />
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <Icon name="BarChart3" size={16} />
          </Button>
        </div>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      {/* Legend for pie chart */}
      {chartType === 'pie' && (
        <div className="mt-4 flex items-center justify-center space-x-6">
          {chartData?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-xs text-muted-foreground">
                {entry?.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomeSourceChart;