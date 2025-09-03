import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const NetBalanceChart = ({ data, chartType }) => {
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
      const netBalance = payload?.[0]?.value;
      const isNegative = netBalance < 0;
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-card">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className={`text-sm font-medium ${isNegative ? 'text-destructive' : 'text-success'}`}>
              Netto Saldo: {formatCurrency(netBalance)}
            </p>
            {isNegative && (
              <div className="flex items-center space-x-1 text-xs text-destructive mt-2">
                <Icon name="AlertTriangle" size={12} />
                <span>Negatief saldo</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBar = (props) => {
    const { fill, ...rest } = props;
    const isNegative = props?.payload?.netBalance < 0;
    return (
      <Bar 
        {...rest} 
        fill={isNegative ? "var(--color-destructive)" : "var(--color-success)"}
        radius={[4, 4, 0, 0]}
      />
    );
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
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
            <ReferenceLine y={0} stroke="var(--color-border)" strokeDasharray="2 2" />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="netBalance" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              dot={(props) => {
                const isNegative = props?.payload?.netBalance < 0;
                return (
                  <circle
                    cx={props?.cx}
                    cy={props?.cy}
                    r={isNegative ? 6 : 4}
                    fill={isNegative ? "var(--color-destructive)" : "var(--color-success)"}
                    stroke={isNegative ? "var(--color-destructive)" : "var(--color-success)"}
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </LineChart>
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
            <ReferenceLine y={0} stroke="var(--color-border)" strokeDasharray="2 2" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="netBalance" 
              stroke="var(--color-primary)" 
              fill="var(--color-primary)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        );
      
      default:
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
            <ReferenceLine y={0} stroke="var(--color-border)" strokeDasharray="2 2" />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="netBalance" 
              shape={<CustomBar />}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Netto Saldo per Maand
        </h3>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Positief</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <span>Negatief</span>
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

export default NetBalanceChart;