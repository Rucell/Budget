import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumb = () => {
  const location = useLocation();

  const breadcrumbMap = {
    '/dashboard-overview': 'Dashboard',
    '/fixed-expenses-management': 'Uitgaven',
    '/income-management': 'Inkomsten',
    '/savings-goals-tracking': 'Spaardoelen',
    '/yearly-financial-overview': 'Jaaroverzicht',
    '/data-export-settings': 'Instellingen',
  };

  const currentPath = location?.pathname;
  const currentPageName = breadcrumbMap?.[currentPath];

  // Don't show breadcrumb on dashboard
  if (currentPath === '/dashboard-overview') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Link
        to="/dashboard-overview"
        className="nav-transition hover:text-foreground flex items-center space-x-1"
      >
        <Icon name="Home" size={14} />
        <span>Dashboard</span>
      </Link>
      
      <Icon name="ChevronRight" size={14} className="text-border" />
      
      <span className="text-foreground font-medium" aria-current="page">
        {currentPageName}
      </span>
    </nav>
  );
};

export default NavigationBreadcrumb;