import React from 'react';
import Icon from '../AppIcon';

const TransactionList = ({ transactions = [] }) => {
  const getTransactionIcon = (category) => {
    const iconMap = {
      'Housing': 'Home',
      'Transportation': 'Car',
      'Food': 'UtensilsCrossed',
      'Entertainment': 'Music',
      'Shopping': 'ShoppingBag',
      'Workspace': 'Briefcase',
      default: 'Receipt'
    };
    return iconMap?.[category] || iconMap?.default;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {transactions?.slice(0, 5)?.map((transaction, index) => (
          <div key={transaction?.id || index} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon 
                    name={getTransactionIcon(transaction?.category)} 
                    size={16} 
                    className="text-gray-600" 
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction?.description || 'Unknown Transaction'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction?.createdAt)?.toLocaleDateString('nl-NL')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">
                  -€{parseFloat(transaction?.amount || 0)?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {transactions?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="Receipt" size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Geen transacties gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;