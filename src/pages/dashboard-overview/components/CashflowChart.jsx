import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CashflowChart = ({ data = [], title = "Cashflow Overzicht" }) => {
  const [chartType, setChartType] = useState('bar');

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '€0';
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-xs text-gray-600">{entry?.name}:</span>
              </div>
              <span className="text-xs font-medium" style={{ color: entry?.color }}>
                {formatCurrency(entry?.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Ensure data is valid and has default structure
  const chartData = Array.isArray(data) && data?.length > 0 
    ? data?.map(item => ({
        period: item?.period || 'Unknown',
        income: parseFloat(item?.income || 0),
        expenses: parseFloat(item?.expenses || 0),
        netBalance: parseFloat(item?.netBalance || 0)
      }))
    : [
        { period: 'Week 1', income: 0, expenses: 0, netBalance: 0 },
        { period: 'Week 2', income: 0, expenses: 0, netBalance: 0 },
        { period: 'Week 3', income: 0, expenses: 0, netBalance: 0 },
        { period: 'Week 4', income: 0, expenses: 0, netBalance: 0 }
      ];

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981"
            strokeWidth={2}
            name="Inkomsten"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#ef4444"
            strokeWidth={2}
            name="Uitgaven"
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="netBalance" 
            stroke="#3b82f6"
            strokeWidth={2}
            name="Netto Saldo"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
            connectNulls={false}
          />
        </LineChart>
      );
    }

    return (
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="period" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={formatCurrency}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="income" 
          fill="#10b981"
          name="Inkomsten"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="expenses" 
          fill="#ef4444"
          name="Uitgaven"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="netBalance" 
          fill="#3b82f6"
          name="Netto Saldo"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={chartType === 'bar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('bar')}
            className={chartType === 'bar' ? 'bg-white shadow-sm' : ''}
          >
            <Icon name="BarChart3" size={16} />
          </Button>
          <Button
            variant={chartType === 'line' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('line')}
            className={chartType === 'line' ? 'bg-white shadow-sm' : ''}
          >
            <Icon name="TrendingUp" size={16} />
          </Button>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-gray-600">Inkomsten</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-gray-600">Uitgaven</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-gray-600">Netto Saldo</span>
        </div>
      </div>

      {/* Show message when no data */}
      {(!data || data?.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
          <div className="text-center">
            <Icon name="BarChart3" size={48} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">Geen gegevens beschikbaar</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashflowChart;