import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { storage } from '../../utils/localStorage';

const DataHistoryVersionControl = () => {
  const [changeHistory, setChangeHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [changeTypeFilter, setChangeTypeFilter] = useState('all');
  const [selectedChanges, setSelectedChanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load change history from localStorage - start completely empty
  useEffect(() => {
    const savedHistory = localStorage.getItem('familybudget-change-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChangeHistory(parsedHistory);
      } catch (error) {
        console.error('Error parsing change history:', error);
        setChangeHistory([]);
      }
    } else {
      // Start with completely empty history - no demo data
      setChangeHistory([]);
    }
    setIsLoading(false);
  }, []);

  // Filter history based on search and filters
  useEffect(() => {
    let filtered = changeHistory;

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(change =>
        change?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        change?.changeType?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        change?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate?.setHours(0, 0, 0, 0);
          filtered = filtered?.filter(change => new Date(change?.timestamp) >= filterDate);
          break;
        case 'week':
          filterDate?.setDate(now?.getDate() - 7);
          filtered = filtered?.filter(change => new Date(change?.timestamp) >= filterDate);
          break;
        case 'month':
          filterDate?.setMonth(now?.getMonth() - 1);
          filtered = filtered?.filter(change => new Date(change?.timestamp) >= filterDate);
          break;
      }
    }

    // Change type filter
    if (changeTypeFilter !== 'all') {
      filtered = filtered?.filter(change => change?.changeType === changeTypeFilter);
    }

    // Sort by timestamp (newest first)
    filtered?.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp));

    setFilteredHistory(filtered);
  }, [changeHistory, searchTerm, dateFilter, changeTypeFilter]);

  const handleUndoChange = (changeId) => {
    if (window.confirm('Weet je zeker dat je deze wijziging ongedaan wilt maken?')) {
      const change = changeHistory?.find(c => c?.id === changeId);
      if (change && change?.previousData) {
        // Restore previous data based on change type
        try {
          switch (change?.dataType) {
            case 'expenses':
              storage?.setExpenses(change?.previousData);
              break;
            case 'variableExpenses':
              storage?.setVariableExpenses(change?.previousData);
              break;
            case 'income':
              storage?.setIncome(change?.previousData);
              break;
            case 'savingsGoals':
              storage?.setSavingsGoals(change?.previousData);
              break;
          }
          
          // Create undo entry
          const undoChange = {
            id: Date.now() + Math.random(),
            timestamp: new Date()?.toISOString(),
            changeType: 'undo',
            description: `Ongedaan gemaakt: ${change?.description}`,
            dataType: change?.dataType,
            category: change?.category,
            previousData: null,
            currentData: change?.previousData
          };

          const updatedHistory = [undoChange, ...changeHistory];
          setChangeHistory(updatedHistory);
          localStorage.setItem('familybudget-change-history', JSON.stringify(updatedHistory));

          // Trigger page refresh to reflect changes
          window.location?.reload();
          
        } catch (error) {
          console.error('Error undoing change:', error);
          alert('Er ging iets mis bij het ongedaan maken van de wijziging.');
        }
      }
    }
  };

  const handleBatchUndo = () => {
    if (selectedChanges?.length === 0) return;
    
    if (window.confirm(`Weet je zeker dat je ${selectedChanges?.length} wijzigingen ongedaan wilt maken?`)) {
      selectedChanges?.forEach(changeId => {
        handleUndoChange(changeId);
      });
      setSelectedChanges([]);
    }
  };

  const handleSelectChange = (changeId) => {
    setSelectedChanges(prev => 
      prev?.includes(changeId)
        ? prev?.filter(id => id !== changeId)
        : [...prev, changeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedChanges?.length === filteredHistory?.length) {
      setSelectedChanges([]);
    } else {
      setSelectedChanges(filteredHistory?.map(change => change?.id));
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'add': return 'Plus';
      case 'edit': return 'Edit';
      case 'delete': return 'Trash2';
      case 'undo': return 'RotateCcw';
      default: return 'Activity';
    }
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'add': return 'text-green-600 bg-green-100';
      case 'edit': return 'text-blue-600 bg-blue-100';
      case 'delete': return 'text-red-600 bg-red-100';
      case 'undo': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Zojuist';
    } else if (diffInHours < 24) {
      return `${diffInHours} uur geleden`;
    } else {
      return date?.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const exportChangeHistory = () => {
    const csvContent = [
      ['Tijdstempel', 'Wijzigingstype', 'Beschrijving', 'Categorie', 'Datatype']?.join(','),
      ...changeHistory?.map(change => [
        new Date(change?.timestamp)?.toLocaleString('nl-NL'),
        change?.changeType,
        `"${change?.description}"`,
        change?.category || '',
        change?.dataType
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `wijzigingsgeschiedenis-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (changeHistory?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-16">
          {/* Modern Header */}
          <div className="bg-white border-b border-gray-100 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Geschiedenis & Versiebeheer</h1>
                <p className="text-gray-600">Volg wijzigingen en herstel eerdere versies van je financiële gegevens</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <NavigationBreadcrumb />
            
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <Icon name="Clock" size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Geen wijzigingsgeschiedenis beschikbaar
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Er zijn nog geen wijzigingen in je financiële gegevens geregistreerd. Zodra je data toevoegt, bewerkt of verwijdert, wordt dit hier bijgehouden.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => window.location.href = '/dashboard-overview'}
                    iconName="ArrowLeft"
                    iconPosition="left"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Terug naar Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/income-management'}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Begin met data toevoegen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Geschiedenis & Versiebeheer</h1>
              <p className="text-gray-600">Volg wijzigingen en herstel eerdere versies van je financiële gegevens</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedChanges?.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBatchUndo}
                  iconName="RotateCcw"
                  iconPosition="left"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  {selectedChanges?.length} ongedaan maken
                </Button>
              )}
              <Button
                variant="outline"
                onClick={exportChangeHistory}
                iconName="Download"
                iconPosition="left"
              >
                Exporteren
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <NavigationBreadcrumb />
          
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek wijzigingen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e?.target?.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                <option value="all">Alle periodes</option>
                <option value="today">Vandaag</option>
                <option value="week">Afgelopen week</option>
                <option value="month">Afgelopen maand</option>
              </select>
              
              <select
                value={changeTypeFilter}
                onChange={(e) => setChangeTypeFilter(e?.target?.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                <option value="all">Alle wijzigingen</option>
                <option value="add">Toegevoegd</option>
                <option value="edit">Bewerkt</option>
                <option value="delete">Verwijderd</option>
                <option value="undo">Ongedaan gemaakt</option>
              </select>
              
              <Button
                variant="outline"
                onClick={handleSelectAll}
                iconName={selectedChanges?.length === filteredHistory?.length ? 'CheckSquare' : 'Square'}
                iconPosition="left"
                size="sm"
              >
                {selectedChanges?.length === filteredHistory?.length ? 'Deselecteer alles' : 'Selecteer alles'}
              </Button>
            </div>
          </div>

          {/* History Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Wijzigingsgeschiedenis</h3>
            
            {filteredHistory?.length > 0 ? (
              <div className="space-y-4">
                {filteredHistory?.map((change, index) => (
                  <div
                    key={change?.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                      selectedChanges?.includes(change?.id) ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedChanges?.includes(change?.id)}
                      onChange={() => handleSelectChange(change?.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    
                    <div className={`p-2 rounded-lg ${getChangeColor(change?.changeType)}`}>
                      <Icon name={getChangeIcon(change?.changeType)} size={16} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{change?.description}</h4>
                          <p className="text-sm text-gray-600">
                            {change?.category && `${change?.category} • `}
                            {change?.dataType} • {formatTimestamp(change?.timestamp)}
                          </p>
                        </div>
                        
                        {change?.changeType !== 'undo' && change?.previousData && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUndoChange(change?.id)}
                            iconName="RotateCcw"
                            iconPosition="left"
                            className="border-orange-200 text-orange-600 hover:bg-orange-50"
                          >
                            Ongedaan maken
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="Search" size={48} className="mx-auto text-gray-300 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Geen wijzigingen gevonden</h4>
                <p className="text-gray-600">Probeer je zoek- of filtercriteria aan te passen.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataHistoryVersionControl;