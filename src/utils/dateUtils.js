import { format, parseISO, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { nl } from 'date-fns/locale';

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: nl });
  } catch (error) {
    console.warn('Error formatting date:', date, error);
    return '';
  }
};

export const formatMonth = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMMM yyyy', { locale: nl });
  } catch (error) {
    console.warn('Error formatting month:', date, error);
    return '';
  }
};

export const getMonthKey = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM');
  } catch (error) {
    console.warn('Error getting month key:', date, error);
    return '';
  }
};

export const getCurrentMonth = () => {
  return new Date();
};

export const getPreviousMonth = (date) => {
  try {
    return subMonths(date, 1);
  } catch (error) {
    console.warn('Error getting previous month:', date, error);
    return new Date();
  }
};

export const getNextMonth = (date) => {
  try {
    return addMonths(date, 1);
  } catch (error) {
    console.warn('Error getting next month:', date, error);
    return new Date();
  }
};

export const getMonthRange = (date) => {
  try {
    return {
      start: startOfMonth(date),
      end: endOfMonth(date)
    };
  } catch (error) {
    console.warn('Error getting month range:', date, error);
    return {
      start: new Date(),
      end: new Date()
    };
  }
};

export const getAvailableMonths = (data = []) => {
  const months = new Set();
  
  if (!Array.isArray(data)) {
    console.warn('getAvailableMonths: data is not an array:', data);
    return [];
  }
  
  data?.forEach(item => {
    try {
      // Check multiple possible date fields
      const dateField = item?.createdAt || item?.date || item?.processedDate;
      if (dateField) {
        const monthKey = getMonthKey(dateField);
        if (monthKey) {
          months?.add(monthKey);
        }
      }
    } catch (error) {
      console.warn('Error processing date for item:', item, error);
    }
  });
  
  // Add current month if not present
  try {
    const currentMonthKey = getMonthKey(new Date());
    if (currentMonthKey) {
      months?.add(currentMonthKey);
    }
  } catch (error) {
    console.warn('Error adding current month:', error);
  }
  
  return Array.from(months)?.sort()?.reverse();
};

export const filterDataByMonth = (data = [], selectedMonth) => {
  if (!selectedMonth || !Array.isArray(data)) {
    return Array.isArray(data) ? data : [];
  }
  
  return data?.filter(item => {
    try {
      // Check multiple possible date fields
      const dateField = item?.createdAt || item?.date || item?.processedDate;
      if (!dateField) return false;
      
      const itemMonthKey = getMonthKey(dateField);
      return itemMonthKey === selectedMonth;
    } catch (error) {
      console.warn('Error filtering item by month:', item, error);
      return false;
    }
  });
};

export const isToday = (date) => {
  if (!date) return false;
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return dateObj?.toDateString() === today?.toDateString();
  } catch (error) {
    console.warn('Error checking if date is today:', date, error);
    return false;
  }
};

export const getDaysInMonth = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return new Date(dateObj?.getFullYear(), dateObj?.getMonth() + 1, 0)?.getDate();
  } catch (error) {
    console.warn('Error getting days in month:', date, error);
    return 30;
  }
};

export const getMonthNumber = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj?.getMonth() + 1; // getMonth() returns 0-11, so add 1
  } catch (error) {
    console.warn('Error getting month number:', date, error);
    return 1;
  }
};

export const getYear = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj?.getFullYear();
  } catch (error) {
    console.warn('Error getting year:', date, error);
    return new Date()?.getFullYear();
  }
};

// Helper function to validate date strings
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return !isNaN(date?.getTime());
  } catch (error) {
    return false;
  }
};

// Helper function to safely parse dates
export const safeParseDate = (dateInput, fallback = new Date()) => {
  try {
    if (!dateInput) return fallback;
    const parsed = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return isNaN(parsed?.getTime()) ? fallback : parsed;
  } catch (error) {
    console.warn('Error parsing date, using fallback:', dateInput, error);
    return fallback;
  }
};