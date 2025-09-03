import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { exportToCSV, exportToJSON, importFromJSON, importFromCSV } from '../../../utils/exportUtils';

const ExportSection = () => {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [dateRange, setDateRange] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const formatOptions = [
    { value: 'json', label: 'JSON Backup (.json)' },
    { value: 'csv', label: 'CSV Export (.csv)' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Alle gegevens' },
    { value: 'current-year', label: 'Huidig jaar' },
    { value: 'last-year', label: 'Vorig jaar' },
    { value: 'last-6-months', label: 'Laatste 6 maanden' },
    { value: 'last-3-months', label: 'Laatste 3 maanden' },
    { value: 'custom', label: 'Aangepaste periode' }
  ];

  const categoryOptions = [
    { value: 'housing', label: 'Huisvesting' },
    { value: 'energy', label: 'Energie & Nutsvoorzieningen' },
    { value: 'insurance', label: 'Verzekeringen' },
    { value: 'transportation', label: 'Vervoer' },
    { value: 'subscriptions', label: 'Abonnementen & Media' },
    { value: 'variable', label: 'Variabele Kosten' },
    { value: 'income', label: 'Inkomsten' },
    { value: 'savings', label: 'Spaardoelen' },
    { value: 'other', label: 'Overig' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (selectedFormat === 'json') {
        exportToJSON();
      } else {
        exportToCSV();
      }
      
      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    } catch (error) {
      console.error('Export error:', error);
      alert('Er ging iets mis bij het exporteren. Probeer het opnieuw.');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    
    input.onchange = async (e) => {
      const file = e?.target?.files?.[0];
      if (!file) return;
      
      setIsImporting(true);
      
      try {
        const fileType = file?.name?.split('.')?.pop()?.toLowerCase();
        
        if (fileType === 'json') {
          await importFromJSON(file);
          alert('JSON backup succesvol geïmporteerd!');
          // Reload page to reflect imported data
          window.location?.reload();
        } else if (fileType === 'csv') {
          await importFromCSV(file);
          alert('CSV bestand geüploaded. Let op: CSV import vereist handmatige controle van de gegevens.');
        } else {
          throw new Error('Unsupported file type');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert(`Import mislukt: ${error?.message}`);
      } finally {
        setIsImporting(false);
      }
    };
    
    input?.click();
  };

  const getEstimatedSize = () => {
    const baseSize = selectedFormat === 'json' ? 0.5 : 0.3;
    const categoryMultiplier = selectedCategories?.length === 0 ? 1 : selectedCategories?.length / 8;
    return (baseSize * categoryMultiplier)?.toFixed(1);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Download" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Gegevens Export & Import</h2>
          <p className="text-sm text-muted-foreground">Exporteer je gegevens of importeer een backup</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <Select
            label="Export/Import formaat"
            options={formatOptions}
            value={selectedFormat}
            onChange={setSelectedFormat}
            className="mb-4"
          />
          {selectedFormat === 'json' && (
            <p className="text-sm text-muted-foreground">
              JSON backup bevat alle gegevens en instellingen - aanbevolen voor complete backup
            </p>
          )}
          {selectedFormat === 'csv' && (
            <p className="text-sm text-muted-foreground">
              CSV export is alleen voor gegevensanalyse - gebruik JSON voor backup
            </p>
          )}
        </div>

        {/* Date Range Selection - Only for CSV */}
        {selectedFormat === 'csv' && (
          <div>
            <Select
              label="Datumbereik"
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
              className="mb-4"
            />
            
            {dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Startdatum"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e?.target?.value)}
                />
                <Input
                  label="Einddatum"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e?.target?.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* Export Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Geschatte bestandsgrootte:</p>
              <p className="font-medium text-foreground">{getEstimatedSize()} MB</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-muted-foreground">Gegevens worden lokaal opgeslagen</p>
              <p className="font-medium text-foreground">Veilig & Privé</p>
            </div>
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exporteren...</span>
              <span className="text-foreground font-medium">{exportProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="default"
            size="lg"
            fullWidth
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            onClick={handleExport}
            disabled={dateRange === 'custom' && (!customStartDate || !customEndDate)}
          >
            {isExporting ? 'Exporteren...' : `Exporteren`}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            fullWidth
            loading={isImporting}
            iconName="Upload"
            iconPosition="left"
            onClick={handleImport}
          >
            {isImporting ? 'Importeren...' : 'Backup Importeren'}
          </Button>
        </div>
        
        {/* Import Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">Import instructies:</p>
              <ul className="text-blue-700 space-y-1">
                <li>• JSON bestanden: Volledige backup die alle gegevens herstelt</li>
                <li>• CSV bestanden: Alleen voor gegevensoverzicht</li>
                <li>• Bestaande gegevens worden overschreven bij JSON import</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSection;