import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ExportMenu = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    { type: 'excel', label: 'Excel (.xlsx)', icon: 'FileSpreadsheet' },
    { type: 'csv', label: 'CSV (.csv)', icon: 'FileText' },
    { type: 'pdf', label: 'PDF (.pdf)', icon: 'FileDown' }
  ];

  const handleExport = (type) => {
    onExport(type);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8"
      >
        <Icon name="Download" size={16} />
        <span className="ml-2 hidden sm:inline">Exporteren</span>
        <Icon name="ChevronDown" size={14} className="ml-1" />
      </Button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-card z-20">
            {exportOptions?.map((option) => (
              <button
                key={option?.type}
                onClick={() => handleExport(option?.type)}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent nav-transition first:rounded-t-lg last:rounded-b-lg"
              >
                <Icon name={option?.icon} size={16} />
                <span>{option?.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportMenu;