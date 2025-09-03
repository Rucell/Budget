import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasFilters, onAddIncome, onClearFilters }) => {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-muted rounded-full">
            <Icon name="Search" size={32} className="text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Geen inkomsten gevonden
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Er zijn geen inkomstenbronnen die overeenkomen met uw huidige filters. 
          Probeer uw zoekcriteria aan te passen.
        </p>
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Filters wissen
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-primary/10 rounded-full">
          <Icon name="TrendingUp" size={32} color="var(--color-primary)" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Nog geen inkomsten toegevoegd
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Begin met het toevoegen van uw inkomstenbronnen om uw financiële overzicht 
        compleet te maken. Voeg zowel salaris als extra inkomsten toe.
      </p>
      <Button
        variant="default"
        onClick={onAddIncome}
        iconName="Plus"
        iconPosition="left"
      >
        Eerste inkomsten toevoegen
      </Button>
    </div>
  );
};

export default EmptyState;