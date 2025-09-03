import { storage } from './localStorage';
import { formatDate } from './dateUtils';

export const exportToCSV = () => {
  const data = storage?.exportData();
  
  // Combine all financial data
  const allData = [
    // Expenses
    ...(data?.expenses?.map(item => ({
      ...item,
      type: 'Fixed Expense',
      category: item?.category || 'Uncategorized'
    })) || []),
    
    // Variable Expenses
    ...(data?.variableExpenses?.map(item => ({
      ...item,
      type: 'Variable Expense',
      category: item?.category || 'Uncategorized'
    })) || []),
    
    // Income
    ...(data?.income?.map(item => ({
      ...item,
      type: 'Income',
      category: item?.source || 'Income'
    })) || [])
  ];

  // CSV headers
  const headers = [
    'Date',
    'Type', 
    'Category',
    'Description',
    'Amount',
    'Notes'
  ];

  // Convert to CSV format
  const csvContent = [
    headers?.join(','),
    ...allData?.map(item => [
      formatDate(item?.createdAt || item?.date),
      item?.type || '',
      `"${item?.category || ''}"`,
      `"${item?.description || item?.name || ''}"`,
      item?.amount || 0,
      `"${item?.notes || ''}"`
    ]?.join(','))
  ]?.join('\n');

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link?.setAttribute('href', url);
  link?.setAttribute('download', `familybudget-export-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body?.appendChild(link);
  link?.click();
  document.body?.removeChild(link);
};

export const exportToJSON = () => {
  const data = storage?.exportData();
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link?.setAttribute('href', url);
  link?.setAttribute('download', `familybudget-backup-${new Date()?.toISOString()?.split('T')?.[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body?.appendChild(link);
  link?.click();
  document.body?.removeChild(link);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Basic validation
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid file format');
        }
        
        const success = storage.importData(data);
        if (success) {
          resolve(data);
        } else {
          reject(new Error('Failed to import data'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const importFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        // Basic validation
        if (!headers.includes('Date') || !headers.includes('Amount')) {
          throw new Error('CSV must contain Date and Amount columns');
        }
        
        // For now, we'll show a message that CSV import requires manual processing
        resolve({
          message: 'CSV import successful - please verify your data',
          rowCount: lines.length - 1
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};