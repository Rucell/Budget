const STORAGE_KEYS = {
  EXPENSES: 'familybudget-expenses',
  VARIABLE_EXPENSES: 'familybudget-variable-expenses',
  INCOME: 'familybudget-income', 
  SAVINGS_GOALS: 'familybudget-savings-goals',
  SETTINGS: 'familybudget-settings',
  THEME: 'familybudget-theme'
};

export const storage = {
  // Generic storage methods
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS)?.forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Specific data methods
  getExpenses: () => storage?.get(STORAGE_KEYS?.EXPENSES, []),
  setExpenses: (expenses) => storage?.set(STORAGE_KEYS?.EXPENSES, expenses),

  getVariableExpenses: () => storage?.get(STORAGE_KEYS?.VARIABLE_EXPENSES, []),
  setVariableExpenses: (expenses) => storage?.set(STORAGE_KEYS?.VARIABLE_EXPENSES, expenses),

  getIncome: () => storage?.get(STORAGE_KEYS?.INCOME, []),
  setIncome: (income) => storage?.set(STORAGE_KEYS?.INCOME, income),

  getSavingsGoals: () => storage?.get(STORAGE_KEYS?.SAVINGS_GOALS, []),
  setSavingsGoals: (goals) => storage?.set(STORAGE_KEYS?.SAVINGS_GOALS, goals),

  getSettings: () => storage?.get(STORAGE_KEYS?.SETTINGS, {
    currency: 'eur',
    dateFormat: 'dd-mm-yyyy',
    language: 'nl',
    theme: 'light',
    notifications: {
      budgetAlerts: true,
      monthlyReports: true,
      goalReminders: false,
      backupReminders: true
    }
  }),
  setSettings: (settings) => storage?.set(STORAGE_KEYS?.SETTINGS, settings),

  getTheme: () => storage?.get(STORAGE_KEYS?.THEME, 'light'),
  setTheme: (theme) => storage?.set(STORAGE_KEYS?.THEME, theme),

  // Export/Import functionality
  exportData: () => {
    return {
      expenses: storage?.getExpenses(),
      variableExpenses: storage?.getVariableExpenses(), 
      income: storage?.getIncome(),
      savingsGoals: storage?.getSavingsGoals(),
      settings: storage?.getSettings(),
      exportDate: new Date()?.toISOString(),
      version: '1.0'
    };
  },

  importData: (data) => {
    try {
      if (data?.expenses) storage?.setExpenses(data?.expenses);
      if (data?.variableExpenses) storage?.setVariableExpenses(data?.variableExpenses);
      if (data?.income) storage?.setIncome(data?.income);
      if (data?.savingsGoals) storage?.setSavingsGoals(data?.savingsGoals);
      if (data?.settings) storage?.setSettings(data?.settings);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
};

export const STORAGE_KEYS_EXPORT = STORAGE_KEYS;