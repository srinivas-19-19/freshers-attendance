// dateUtils.js

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a YYYY-MM-DD string into a readable format (e.g. 27 August 2026, Thursday)
 */
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  
  const d = new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
  
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return d.toLocaleDateString('en-US', options);
};

/**
 * Adds or subtracts days from a YYYY-MM-DD string
 */
export const addDaysToDate = (dateString, days) => {
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const d = new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
  d.setDate(d.getDate() + days);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
