import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasSearch, onAddCategory, onClearSearch }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="Tag" size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasSearch ? 'Geen categorieën gevonden' : 'Geen categorieën'}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {hasSearch
          ? 'We konden geen categorieën vinden die overeenkomen met je zoekopdracht. Probeer andere zoektermen.' :'Je hebt nog geen aangepaste categorieën aangemaakt. Voeg je eerste categorie toe om te beginnen.'
        }
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {hasSearch ? (
          <>
            <Button
              onClick={onClearSearch}
              variant="outline"
              iconName="X"
              iconPosition="left"
            >
              Zoekfilter Wissen
            </Button>
            <Button
              onClick={onAddCategory}
              iconName="Plus"
              iconPosition="left"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Nieuwe Categorie
            </Button>
          </>
        ) : (
          <Button
            onClick={onAddCategory}
            iconName="Plus"
            iconPosition="left"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Eerste Categorie Toevoegen
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;