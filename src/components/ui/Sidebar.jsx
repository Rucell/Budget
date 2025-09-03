import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard-overview', icon: 'LayoutDashboard' },
    { label: 'Jaaroverzicht', path: '/yearly-financial-overview', icon: 'BarChart3' },
    { label: 'Vaste Kosten', path: '/fixed-expenses-management', icon: 'CreditCard' },
    { label: 'Kostencategorieën', path: '/fixed-expense-categories-management', icon: 'FolderOpen' },
    { label: 'Variabele Uitgaven', path: '/variable-expenses-management', icon: 'Receipt' },
    { label: 'Instellingen', path: '/data-export-settings', icon: 'Settings' },
    { label: 'Inkomsten', path: '/income-management', icon: 'TrendingUp' },
    { label: 'Spaardoelen', path: '/savings-goals-tracking', icon: 'Target' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-100 z-40">
      <div className="flex flex-col items-center py-6 space-y-6">
        {/* Logo */}
        <Link to="/dashboard-overview" className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl">
          <Icon name="Home" size={20} color="white" />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                isActivePath(item?.path)
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title={item?.label}
            >
              <Icon name={item?.icon} size={20} />
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;