import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Security & PIN Management Helper Functions  
const PIN_STORAGE_KEY = 'familybudget-security-pin';
const BIOMETRIC_STORAGE_KEY = 'familybudget-biometric-enabled';
const AUTO_LOCK_STORAGE_KEY = 'familybudget-auto-lock-setting';

const SecurityPinManagement = () => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoLockTimer, setAutoLockTimer] = useState('5min');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [hasExistingPin, setHasExistingPin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load security settings from localStorage - start completely empty
    const savedPin = localStorage.getItem(PIN_STORAGE_KEY);
    const savedBiometric = localStorage.getItem(BIOMETRIC_STORAGE_KEY);
    const savedAutoLock = localStorage.getItem(AUTO_LOCK_STORAGE_KEY);
    
    // Only load if they actually exist - no default values
    setHasExistingPin(!!savedPin);
    setBiometricEnabled(savedBiometric === 'true');
    setAutoLockTimer(savedAutoLock || '5min'); // Keep default for auto-lock as it's a setting, not demo data
  }, []);

  const handlePinSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate PIN length
      if (newPin?.length < 4 || newPin?.length > 6) {
        setError('PIN moet tussen 4 en 6 cijfers zijn');
        return;
      }

      // Validate PIN contains only numbers
      if (!/^\d+$/?.test(newPin)) {
        setError('PIN mag alleen cijfers bevatten');
        return;
      }

      // Check if new PIN and confirmation match
      if (newPin !== confirmPin) {
        setError('Nieuwe PIN en bevestiging komen niet overeen');
        return;
      }

      // If changing existing PIN, verify current PIN
      if (hasExistingPin && isChangingPin) {
        const existingPin = localStorage.getItem(PIN_STORAGE_KEY);
        if (currentPin !== existingPin) {
          setError('Huidige PIN is onjuist');
          return;
        }
      }

      // Save new PIN (in real app, this would be encrypted)
      localStorage.setItem(PIN_STORAGE_KEY, newPin);
      
      setSuccess(hasExistingPin ? 'PIN succesvol gewijzigd' : 'PIN succesvol ingesteld');
      setHasExistingPin(true);
      setIsChangingPin(false);
      
      // Reset form
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      
    } catch (error) {
      setError('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricToggle = () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    localStorage.setItem(BIOMETRIC_STORAGE_KEY, newValue?.toString());
    setSuccess(newValue ? 'Biometrische authenticatie ingeschakeld' : 'Biometrische authenticatie uitgeschakeld');
  };

  const handleAutoLockChange = (value) => {
    setAutoLockTimer(value);
    localStorage.setItem(AUTO_LOCK_STORAGE_KEY, value);
    setSuccess('Auto-lock instelling bijgewerkt');
  };

  const resetSecurity = () => {
    if (window.confirm('Weet je zeker dat je alle beveiligingsinstellingen wilt resetten?')) {
      localStorage.removeItem(PIN_STORAGE_KEY);
      localStorage.removeItem(BIOMETRIC_STORAGE_KEY);
      localStorage.removeItem(AUTO_LOCK_STORAGE_KEY);
      
      setHasExistingPin(false);
      setBiometricEnabled(false);
      setAutoLockTimer('5min');
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setIsChangingPin(false);
      setSuccess('Alle beveiligingsinstellingen zijn gereset');
    }
  };

  const securityLevel = useMemo(() => {
    let level = 0;
    let features = [];
    
    if (hasExistingPin) {
      level += 3;
      features?.push('PIN ingesteld');
    }
    if (biometricEnabled) {
      level += 2;
      features?.push('Biometrie');
    }
    if (autoLockTimer !== 'never') {
      level += 1;
      features?.push('Auto-lock');
    }
    
    return { level, features };
  }, [hasExistingPin, biometricEnabled, autoLockTimer]);

  const getSecurityLevelColor = (level) => {
    if (level >= 5) return 'text-green-600 bg-green-100';
    if (level >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSecurityLevelText = (level) => {
    if (level >= 5) return 'Hoog';
    if (level >= 3) return 'Gemiddeld';
    return 'Laag';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-16">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Beveiliging & PIN Beheer</h1>
              <p className="text-gray-600">Beheer je app-beveiliging, PIN-code en privacy-instellingen</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSecurityLevelColor(securityLevel?.level)}`}>
                Beveiligingsniveau: {getSecurityLevelText(securityLevel?.level)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <NavigationBreadcrumb />
          
          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Icon name="AlertCircle" size={20} className="text-red-600 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Icon name="CheckCircle" size={20} className="text-green-600 mr-3" />
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* PIN Configuration */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                      <Icon name="Lock" size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {hasExistingPin ? 'PIN-code wijzigen' : 'PIN-code instellen'}
                      </h3>
                      <p className="text-gray-600">
                        {hasExistingPin ? 'Wijzig je huidige beveiligings-PIN' : 'Stel een 4-6 cijferige PIN in voor extra beveiliging'}
                      </p>
                    </div>
                  </div>
                  
                  {hasExistingPin && !isChangingPin && (
                    <Button
                      variant="outline"
                      onClick={() => setIsChangingPin(true)}
                      iconName="Edit"
                      iconPosition="left"
                    >
                      PIN wijzigen
                    </Button>
                  )}
                </div>

                {(!hasExistingPin || isChangingPin) && (
                  <form onSubmit={handlePinSubmit} className="space-y-6">
                    {hasExistingPin && isChangingPin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Huidige PIN
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPin ? 'text' : 'password'}
                            value={currentPin}
                            onChange={(e) => setCurrentPin(e?.target?.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-center text-2xl tracking-widest"
                            placeholder="••••"
                            maxLength="6"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPin(!showCurrentPin)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <Icon name={showCurrentPin ? 'EyeOff' : 'Eye'} size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nieuwe PIN
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPin ? 'text' : 'password'}
                          value={newPin}
                          onChange={(e) => setNewPin(e?.target?.value?.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-center text-2xl tracking-widest"
                          placeholder="••••"
                          maxLength="6"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPin(!showNewPin)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <Icon name={showNewPin ? 'EyeOff' : 'Eye'} size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bevestig nieuwe PIN
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPin ? 'text' : 'password'}
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e?.target?.value?.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-center text-2xl tracking-widest"
                          placeholder="••••"
                          maxLength="6"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPin(!showConfirmPin)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <Icon name={showConfirmPin ? 'EyeOff' : 'Eye'} size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        type="submit"
                        loading={loading}
                        iconName="Save"
                        iconPosition="left"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {hasExistingPin ? 'PIN wijzigen' : 'PIN instellen'}
                      </Button>
                      
                      {isChangingPin && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsChangingPin(false);
                            setCurrentPin('');
                            setNewPin('');
                            setConfirmPin('');
                            setError('');
                          }}
                        >
                          Annuleren
                        </Button>
                      )}
                    </div>
                  </form>
                )}

                {hasExistingPin && !isChangingPin && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Shield" size={32} className="text-green-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">PIN-beveiliging actief</h4>
                      <p className="text-gray-600">Je account is beveiligd met een PIN-code</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ... rest of existing code remains unchanged ... */}
              {/* Biometric Authentication */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <Icon name="Fingerprint" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Biometrische authenticatie</h3>
                      <p className="text-gray-600">Gebruik vingerafdruk of gezichtsherkenning voor snelle toegang</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleBiometricToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      biometricEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Auto-lock Timer */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <Icon name="Timer" size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Auto-lock timer</h3>
                    <p className="text-gray-600">Tijd voordat de app automatisch vergrendelt</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'immediate', label: 'Onmiddellijk' },
                    { value: '1min', label: '1 minuut' },
                    { value: '5min', label: '5 minuten' },
                    { value: '15min', label: '15 minuten' },
                    { value: '30min', label: '30 minuten' },
                    { value: 'never', label: 'Nooit' }
                  ]?.map((option) => (
                    <button
                      key={option?.value}
                      onClick={() => handleAutoLockChange(option?.value)}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                        autoLockTimer === option?.value
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' :'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Status & Actions */}
            <div className="space-y-6">
              {/* Security Level */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Beveiligingsstatus</h3>
                
                <div className={`p-4 rounded-lg mb-4 ${getSecurityLevelColor(securityLevel?.level)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Beveiligingsniveau</span>
                    <span className="text-lg font-bold">{getSecurityLevelText(securityLevel?.level)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Actieve beveiligingsmaatregelen:</h4>
                  {securityLevel?.features?.length > 0 ? (
                    <ul className="space-y-2">
                      {securityLevel?.features?.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Geen beveiligingsmaatregelen actief</p>
                  )}
                </div>
              </div>

              {/* Security Recommendations */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aanbevelingen</h3>
                
                <div className="space-y-3">
                  {!hasExistingPin && (
                    <div className="flex items-start">
                      <Icon name="AlertTriangle" size={16} className="text-orange-500 mr-2 mt-1" />
                      <p className="text-sm text-gray-600">Stel een PIN-code in voor extra beveiliging</p>
                    </div>
                  )}
                  
                  {!biometricEnabled && (
                    <div className="flex items-start">
                      <Icon name="Info" size={16} className="text-blue-500 mr-2 mt-1" />
                      <p className="text-sm text-gray-600">Schakel biometrische authenticatie in voor snellere toegang</p>
                    </div>
                  )}
                  
                  {autoLockTimer === 'never' && (
                    <div className="flex items-start">
                      <Icon name="AlertTriangle" size={16} className="text-orange-500 mr-2 mt-1" />
                      <p className="text-sm text-gray-600">Overweeg auto-lock in te schakelen voor betere beveiliging</p>
                    </div>
                  )}
                  
                  {securityLevel?.level >= 5 && (
                    <div className="flex items-start">
                      <Icon name="Shield" size={16} className="text-green-500 mr-2 mt-1" />
                      <p className="text-sm text-gray-600">Uitstekend! Je beveiligingsinstellingen zijn optimaal.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Noodopties</h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={resetSecurity}
                    iconName="RotateCcw"
                    iconPosition="left"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Alle beveiliging resetten
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    Dit verwijdert alle beveiligingsinstellingen en reset de app naar de standaardinstellingen.
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

export default SecurityPinManagement;