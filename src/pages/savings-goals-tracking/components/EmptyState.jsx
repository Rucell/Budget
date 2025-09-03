import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onCreateGoal, hasFilters = false }) => {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Geen doelen gevonden
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Er zijn geen spaardoelen die voldoen aan je huidige filters. Probeer andere filterinstellingen.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-primary bg-opacity-10 rounded-full mb-6">
        <Icon name="Target" size={40} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Nog geen spaardoelen
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Begin met het creëren van je eerste spaardoel om je financiële doelstellingen bij te houden en te bereiken.
      </p>
      <Button
        variant="default"
        onClick={onCreateGoal}
        iconName="Plus"
        iconPosition="left"
        size="lg"
      >
        Eerste doel aanmaken
      </Button>
    </div>
  );
};

export default EmptyState;