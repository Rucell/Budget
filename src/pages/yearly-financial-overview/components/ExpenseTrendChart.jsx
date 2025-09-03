import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';

const ExpenseTrendChart = ({ data, chartType }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      const isNegative = data?.expenses > data?.income;
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-card">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-destructive">
              Uitgaven: {formatCurrency(data?.expenses)}
            </p>
            <p className="text-sm text-primary">
              Inkomen: {formatCurrency(data?.income)}
            </p>
            {isNegative && (
              <div className="flex items-center space-x-1 text-xs text-destructive mt-2">
                <Icon name="AlertTriangle" size={12} />
                <span>Uitgaven overtreffen inkomen</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="expenses" 
              fill="var(--color-destructive)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="var(--color-destructive)" 
              fill="var(--color-destructive)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        );
      
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="var(--color-destructive)" 
              strokeWidth={3}
              dot={(props) => {
                const isWarning = props?.payload?.expenses > props?.payload?.income;
                return (
                  <circle
                    cx={props?.cx}
                    cy={props?.cy}
                    r={isWarning ? 6 : 4}
                    fill={isWarning ? "var(--color-warning)" : "var(--color-destructive)"}
                    stroke={isWarning ? "var(--color-warning)" : "var(--color-destructive)"}
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 6, stroke: 'var(--color-destructive)', strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Uitgaven Trend
        </h3>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span>Waarschuwing</span>
          </div>
        </div>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseTrendChart;