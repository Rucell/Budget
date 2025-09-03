import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SavingsGoalCard from './components/SavingsGoalCard';
import CreateGoalModal from './components/CreateGoalModal';
import EditGoalModal from './components/EditGoalModal';
import FilterControls from './components/FilterControls';
import EmptyState from './components/EmptyState';
import SummaryStats from './components/SummaryStats';

const SavingsGoalsTracking = () => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState(null);

  // Remove all mock data - app should start completely empty
  useEffect(() => {
    // Load goals from localStorage - completely empty start
    const savedGoals = localStorage.getItem('familybudget-savings-goals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals(parsedGoals);
      } catch (error) {
        console.error('Error parsing saved goals:', error);
        setGoals([]);
      }
    } else {
      // Start with completely empty goals - no demo data
      setGoals([]);
    }
  }, []);

  useEffect(() => {
    // Save goals to localStorage whenever goals change
    if (goals?.length > 0) {
      localStorage.setItem('familybudget-savings-goals', JSON.stringify(goals));
    }
  }, [goals]);

  useEffect(() => {
    // Filter and sort goals
    let filtered = [...goals];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered?.filter(goal => goal?.status === statusFilter);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      const aProgress = (a?.currentBalance / a?.targetAmount) * 100;
      const bProgress = (b?.currentBalance / b?.targetAmount) * 100;

      switch (sortBy) {
        case 'progress':
          return bProgress - aProgress;
        case 'progress-asc':
          return aProgress - bProgress;
        case 'target-date':
          return new Date(a.targetDate) - new Date(b.targetDate);
        case 'target-date-desc':
          return new Date(b.targetDate) - new Date(a.targetDate);
        case 'target-amount':
          return b?.targetAmount - a?.targetAmount;
        case 'target-amount-asc':
          return a?.targetAmount - b?.targetAmount;
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'created-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setFilteredGoals(filtered);
  }, [goals, statusFilter, sortBy]);

  const handleCreateGoal = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(prev => prev?.map(goal => 
      goal?.id === updatedGoal?.id ? updatedGoal : goal
    ));
  };

  const handleDeleteGoal = (goalId) => {
    setDeletingGoalId(goalId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteGoal = () => {
    setGoals(prev => prev?.filter(goal => goal?.id !== deletingGoalId));
    setShowDeleteConfirm(false);
    setDeletingGoalId(null);
  };

  const handleContribute = (goalId, amount) => {
    setGoals(prev => prev?.map(goal => 
      goal?.id === goalId 
        ? { ...goal, currentBalance: goal?.currentBalance + amount }
        : goal
    ));
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowEditModal(true);
  };

  const handleExportData = () => {
    const csvContent = [
      ['Doelnaam', 'Streefbedrag', 'Huidig saldo', 'Voortgang %', 'Streefdatum', 'Maandelijkse bijdrage', 'Status', 'Beschrijving']?.join(','),
      ...goals?.map(goal => [
        `"${goal?.name}"`,
        goal?.targetAmount,
        goal?.currentBalance,
        ((goal?.currentBalance / goal?.targetAmount) * 100)?.toFixed(2),
        goal?.targetDate,
        goal?.monthlyContribution,
        goal?.status,
        `"${goal?.description}"`
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `spaardoelen-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const hasActiveFilters = statusFilter !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Spaardoelen</h1>
              <p className="text-gray-600">Beheer en volg je financiële doelstellingen</p>
            </div>
            
            <Button
              variant="default"
              onClick={() => setShowCreateModal(true)}
              iconName="Plus"
              iconPosition="left"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Nieuw doel
            </Button>
          </div>
        </div>

        <div className="p-8">
          <NavigationBreadcrumb />
          
          {goals?.length > 0 && (
            <>
              <SummaryStats goals={goals} />
              
              <FilterControls
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                onExportData={handleExportData}
              />
            </>
          )}

          {/* Goals Grid */}
          {filteredGoals?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGoals?.map(goal => (
                <SavingsGoalCard
                  key={goal?.id}
                  goal={goal}
                  onContribute={handleContribute}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              onCreateGoal={() => setShowCreateModal(true)}
              hasFilters={hasActiveFilters}
            />
          )}
        </div>
      </main>
      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          variant="default"
          size="icon"
          onClick={() => setShowCreateModal(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
        >
          <Icon name="Plus" size={24} />
        </Button>
      </div>
      {/* Modals */}
      <CreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGoal={handleCreateGoal}
      />
      <EditGoalModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdateGoal={handleUpdateGoal}
        goal={editingGoal}
      />
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white border border-gray-100 rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-red-100">
                <Icon name="AlertTriangle" size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Doel verwijderen</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Weet je zeker dat je dit spaardoel wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </p>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annuleren
              </Button>
              <Button
                variant="destructive"
                fullWidth
                onClick={confirmDeleteGoal}
                iconName="Trash2"
                iconPosition="left"
              >
                Verwijderen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalsTracking;