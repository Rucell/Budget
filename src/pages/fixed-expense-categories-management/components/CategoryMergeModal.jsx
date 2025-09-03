import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryMergeModal = ({ 
  isOpen, 
  categories = [], 
  onSubmit, 
  onClose 
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState('');

  const handleSubmit = () => {
    if (!selectedTargetId) {
      alert('Selecteer een doelcategorie');
      return;
    }

    const categoriesToMerge = categories?.map(cat => cat?.id);
    onSubmit?.(selectedTargetId, categoriesToMerge);
  };

  const handleClose = () => {
    setSelectedTargetId('');
    onClose?.();
  };

  if (!isOpen || categories?.length < 2) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Categorieën Samenvoegen
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Icon name="AlertTriangle" size={20} />
              <span className="font-medium">Let op</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Alle uitgaven in de geselecteerde categorieën worden verplaatst naar de doelcategorie. 
              De andere categorieën worden verwijderd.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Te samenvoegen categorieën ({categories?.length}):
            </h3>
            <div className="space-y-2">
              {categories?.map((category) => (
                <div 
                  key={category?.id}
                  className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category?.color}20` }}
                  >
                    <Icon 
                      name={category?.icon || 'Tag'} 
                      size={16} 
                      style={{ color: category?.color }}
                    />
                  </div>
                  <span className="text-sm font-medium">{category?.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selecteer doelcategorie:
            </label>
            <div className="space-y-2">
              {categories?.map((category) => (
                <label 
                  key={category?.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="targetCategory"
                    value={category?.id}
                    checked={selectedTargetId === category?.id}
                    onChange={(e) => setSelectedTargetId(e?.target?.value)}
                    className="text-indigo-600"
                  />
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category?.color}20` }}
                  >
                    <Icon 
                      name={category?.icon || 'Tag'} 
                      size={16} 
                      style={{ color: category?.color }}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{category?.name}</div>
                    {category?.description && (
                      <div className="text-sm text-gray-600">{category?.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} fullWidth>
              Annuleren
            </Button>
            <Button 
              onClick={handleSubmit} 
              fullWidth 
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!selectedTargetId}
            >
              Samenvoegen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMergeModal;