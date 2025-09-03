import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActionCard = ({ title, description, icon, route, variant = 'default' }) => {
  const getCardStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary/5 border-primary/20 hover:bg-primary/10';
      case 'secondary':
        return 'bg-secondary/5 border-secondary/20 hover:bg-secondary/10';
      case 'success':
        return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
      case 'warning':
        return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
      default:
        return 'bg-card border-border hover:bg-accent';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-secondary';
      case 'success':
        return 'text-emerald-600';
      case 'warning':
        return 'text-amber-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Link to={route} className="block">
      <div className={`p-6 rounded-lg border shadow-card transition-all duration-200 ${getCardStyles()}`}>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <Icon name={icon} size={24} className={getIconColor()} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
};

export default QuickActionCard;