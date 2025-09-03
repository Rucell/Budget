import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PrivacySection = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: false,
    analyticsTracking: false,
    crashReporting: true,
    performanceData: true,
    localStorageOnly: true
  });

  const [showDataInfo, setShowDataInfo] = useState(false);

  const handlePrivacyChange = (key, checked) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const dataStorageInfo = [
    {
      category: "Financiële Gegevens",
      description: "Uitgaven, inkomsten en spaardoelen worden lokaal opgeslagen",
      location: "Browser lokale opslag",
      retention: "Tot handmatige verwijdering"
    },
    {
      category: "Applicatie Instellingen",
      description: "Voorkeuren voor valuta, taal en thema",
      location: "Browser lokale opslag",
      retention: "Tot handmatige verwijdering"
    },
    {
      category: "Export Geschiedenis",
      description: "Tijdstempels van geëxporteerde bestanden",
      location: "Browser lokale opslag",
      retention: "30 dagen"
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
          <Icon name="Shield" size={20} className="text-success" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Privacy & Beveiliging</h2>
          <p className="text-sm text-muted-foreground">Beheer uw privacy-instellingen en gegevensbeveiliging</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Privacy Controls */}
        <div className="space-y-4">
          <Checkbox
            label="Alleen lokale gegevensopslag"
            description="Alle gegevens blijven op uw apparaat, geen cloud synchronisatie"
            checked={privacySettings?.localStorageOnly}
            onChange={(e) => handlePrivacyChange('localStorageOnly', e?.target?.checked)}
          />

          <Checkbox
            label="Crash rapportage"
            description="Help ons de app te verbeteren door anonieme crash rapporten te delen"
            checked={privacySettings?.crashReporting}
            onChange={(e) => handlePrivacyChange('crashReporting', e?.target?.checked)}
          />

          <Checkbox
            label="Prestatie gegevens"
            description="Deel anonieme prestatie statistieken voor app optimalisatie"
            checked={privacySettings?.performanceData}
            onChange={(e) => handlePrivacyChange('performanceData', e?.target?.checked)}
          />

          <Checkbox
            label="Analytics tracking"
            description="Sta anonieme gebruiksanalyse toe voor functie verbetering"
            checked={privacySettings?.analyticsTracking}
            onChange={(e) => handlePrivacyChange('analyticsTracking', e?.target?.checked)}
          />

          <Checkbox
            label="Gegevensverzameling"
            description="Toestaan dat anonieme gebruiksgegevens worden verzameld"
            checked={privacySettings?.dataCollection}
            onChange={(e) => handlePrivacyChange('dataCollection', e?.target?.checked)}
          />
        </div>

        {/* Data Storage Information */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Gegevensopslag Informatie</h3>
            <Button
              variant="ghost"
              size="sm"
              iconName={showDataInfo ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
              onClick={() => setShowDataInfo(!showDataInfo)}
            >
              {showDataInfo ? 'Verbergen' : 'Tonen'}
            </Button>
          </div>

          {showDataInfo && (
            <div className="space-y-4">
              {dataStorageInfo?.map((item, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{item?.category}</h4>
                      <p className="text-sm text-muted-foreground">{item?.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Locatie:</span>
                        <p className="text-sm text-foreground">{item?.location}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Bewaarperiode:</span>
                        <p className="text-sm text-foreground">{item?.retention}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Features */}
        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Lock" size={20} className="text-success mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground mb-2">Beveiligingskenmerken</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Alle gegevens worden lokaal op uw apparaat opgeslagen</li>
                <li>• Geen account registratie of persoonlijke informatie vereist</li>
                <li>• Gegevens worden niet gedeeld met externe diensten</li>
                <li>• Export functionaliteit voor volledige gegevenscontrole</li>
                <li>• Mogelijkheid tot complete gegevensverwijdering</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySection;