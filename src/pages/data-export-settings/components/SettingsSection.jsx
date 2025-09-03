import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import ThemeToggle from '../../../components/ui/ThemeToggle';
import Icon from '../../../components/AppIcon';
import { storage } from '../../../utils/localStorage';
import { useTheme } from '../../../hooks/useTheme';

const SettingsSection = () => {
  const [currency, setCurrency] = useState('eur');
  const [dateFormat, setDateFormat] = useState('dd-mm-yyyy');
  const [language, setLanguage] = useState('nl');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    monthlyReports: true,
    goalReminders: false,
    backupReminders: true
  });
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const { theme, setThemeMode } = useTheme();

  const currencyOptions = [
    { value: 'eur', label: '€ Euro (EUR)' },
    { value: 'usd', label: '$ US Dollar (USD)' },
    { value: 'gbp', label: '£ British Pound (GBP)' }
  ];

  const dateFormatOptions = [
    { value: 'dd-mm-yyyy', label: 'DD/MM/YYYY' },
    { value: 'mm-dd-yyyy', label: 'MM/DD/YYYY' },
    { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' }
  ];

  const languageOptions = [
    { value: 'nl', label: 'Nederlands' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' }
  ];

  // Load settings on mount
  useEffect(() => {
    const savedSettings = storage?.getSettings();
    setCurrency(savedSettings?.currency || 'eur');
    setDateFormat(savedSettings?.dateFormat || 'dd-mm-yyyy');
    setLanguage(savedSettings?.language || 'nl');
    setNotifications(savedSettings?.notifications || {
      budgetAlerts: true,
      monthlyReports: true,
      goalReminders: false,
      backupReminders: true
    });
  }, []);

  // Auto-save settings
  useEffect(() => {
    const settings = {
      currency,
      dateFormat,
      language,
      theme,
      notifications
    };
    storage?.setSettings(settings);
  }, [currency, dateFormat, language, theme, notifications]);

  const handleNotificationChange = (key, checked) => {
    setNotifications(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleDataReset = async () => {
    setIsResetting(true);
    
    // Simulate reset process
    setTimeout(() => {
      // Clear all data from localStorage
      storage?.clear();
      
      // Also clear any specific keys that might not be in the main clear function
      localStorage.removeItem('familybudget-expense-categories');
      localStorage.removeItem('familybudget-savings-goals');
      
      setIsResetting(false);
      setShowResetDialog(false);
      alert('Alle gegevens zijn succesvol gewist. De applicatie wordt nu opnieuw geladen.');
      
      // Reload to reset all state - this will show empty state instead of dummy data
      window.location?.reload();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Application Preferences */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg">
            <Icon name="Settings" size={20} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Applicatie Voorkeuren</h2>
            <p className="text-sm text-muted-foreground">Pas uw persoonlijke instellingen aan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Valuta"
            options={currencyOptions}
            value={currency}
            onChange={setCurrency}
          />

          <Select
            label="Datumformaat"
            options={dateFormatOptions}
            value={dateFormat}
            onChange={setDateFormat}
          />

          <Select
            label="Taal"
            options={languageOptions}
            value={language}
            onChange={setLanguage}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Thema
            </label>
            <ThemeToggle 
              showLabel={true} 
              variant="outline" 
              className="w-full justify-start"
            />
          </div>
        </div>
      </div>
      {/* Notification Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
            <Icon name="Bell" size={20} className="text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Meldingen</h2>
            <p className="text-sm text-muted-foreground">Beheer uw meldingsvoorkeuren</p>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Budget waarschuwingen"
            description="Ontvang meldingen wanneer uitgaven het budget overschrijden"
            checked={notifications?.budgetAlerts}
            onChange={(e) => handleNotificationChange('budgetAlerts', e?.target?.checked)}
          />

          <Checkbox
            label="Maandelijkse rapporten"
            description="Automatische maandoverzichten van uw financiën"
            checked={notifications?.monthlyReports}
            onChange={(e) => handleNotificationChange('monthlyReports', e?.target?.checked)}
          />

          <Checkbox
            label="Spaardoel herinneringen"
            description="Herinneringen voor het bijdragen aan uw spaardoelen"
            checked={notifications?.goalReminders}
            onChange={(e) => handleNotificationChange('goalReminders', e?.target?.checked)}
          />

          <Checkbox
            label="Backup herinneringen"
            description="Periodieke herinneringen om uw gegevens te exporteren"
            checked={notifications?.backupReminders}
            onChange={(e) => handleNotificationChange('backupReminders', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Data Management */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-lg">
            <Icon name="Database" size={20} className="text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Gegevensbeheer</h2>
            <p className="text-sm text-muted-foreground">Beheer uw opgeslagen gegevens</p>
          </div>
        </div>

        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-destructive mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">Alle gegevens wissen</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Dit zal alle uitgaven, inkomsten, spaardoelen en instellingen permanent verwijderen. 
                Deze actie kan niet ongedaan worden gemaakt.
              </p>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={() => setShowResetDialog(true)}
              >
                Alle gegevens wissen
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-destructive" />
              <h3 className="text-lg font-semibold text-foreground">Bevestig gegevens wissen</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Weet u zeker dat u alle gegevens wilt wissen? Deze actie kan niet ongedaan worden gemaakt 
              en alle uitgaven, inkomsten en spaardoelen zullen permanent verloren gaan.
            </p>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowResetDialog(false)}
                disabled={isResetting}
              >
                Annuleren
              </Button>
              <Button
                variant="destructive"
                fullWidth
                loading={isResetting}
                onClick={handleDataReset}
              >
                {isResetting ? 'Wissen...' : 'Ja, wis alles'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSection;