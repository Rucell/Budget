import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard-overview', icon: 'LayoutDashboard' },
    { label: 'Vaste Uitgaven', path: '/fixed-expenses-management', icon: 'CreditCard' },
    { label: 'Variabele Uitgaven', path: '/variable-expenses-management', icon: 'Receipt' },
    { label: 'Inkomsten', path: '/income-management', icon: 'TrendingUp' },
    { label: 'Spaardoelen', path: '/savings-goals-tracking', icon: 'Target' },
    { label: 'Jaaroverzicht', path: '/yearly-financial-overview', icon: 'BarChart3' },
  ];

  const secondaryItems = [
    { label: 'Instellingen', path: '/data-export-settings', icon: 'Settings' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <Link to="/dashboard-overview" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Wallet" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">FamilyBudget</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`nav-transition px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span className="hidden xl:block">{item?.label}</span>
              </Link>
            ))}
            
            {/* More Menu */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="MoreHorizontal" size={16} />
                <span className="ml-2 hidden xl:block">Meer</span>
              </Button>
              
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible nav-transition">
                {secondaryItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm nav-transition first:rounded-t-lg last:rounded-b-lg ${
                      isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-popover-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Desktop Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <ThemeToggle className="hidden md:flex" />
            
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 animation-smooth"
            onClick={closeMobileMenu}
          />
          <div className="fixed top-16 left-0 right-0 bg-card border-b border-border shadow-card animate-slide-down">
            <nav className="px-4 py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
              {[...navigationItems, ...secondaryItems]?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium nav-transition ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}
              
              {/* Mobile Theme Toggle */}
              <div className="px-4 py-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-foreground">Thema</span>
                  <ThemeToggle showLabel={false} />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;