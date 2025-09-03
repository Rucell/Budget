import React from 'react';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import ExportSection from './components/ExportSection';
import SettingsSection from './components/SettingsSection';
import PrivacySection from './components/PrivacySection';

const DataExportSettings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gegevens Export & Instellingen</h1>
              <p className="text-gray-600">Exporteer uw financiële gegevens en pas uw applicatie-instellingen aan voor een gepersonaliseerde ervaring.</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <NavigationBreadcrumb />

          {/* Main Content */}
          <div className="space-y-8">
            {/* Export Section */}
            <ExportSection />

            {/* Settings Section */}
            <SettingsSection />

            {/* Privacy Section */}
            <PrivacySection />
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg flex-shrink-0">
                  <span className="text-indigo-600 font-semibold text-sm">i</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong className="text-gray-900">Gegevensbeveiliging:</strong> Al uw financiële informatie wordt 
                    veilig opgeslagen in de lokale opslag van uw browser. Er worden geen gegevens naar externe servers verzonden.
                  </p>
                  <p>
                    <strong className="text-gray-900">Export tip:</strong> We raden aan om regelmatig een backup van uw 
                    gegevens te maken door deze te exporteren naar Excel of CSV formaat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataExportSettings;