/**
 * Utility functions for standardizing date and time formats across the application
 */

/**
 * Format date as "Month d, yyyy" (e.g. "March 28, 2024")
 * 
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return 'Unknown';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  // Format as "Month d, yyyy"
  return dateObj.toLocaleDateString('en-GB', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format time as "9pm" or "6:30pm"
 * 
 * @param time - Time string or Date object
 * @returns Formatted time string
 */
export const formatTime = (time: string | Date): string => {
  if (!time) return 'Unknown';
  
  const timeObj = typeof time === 'string' ? new Date(time) : time;
  
  // Check if time is valid
  if (isNaN(timeObj.getTime())) return 'Invalid time';
  
  const hours = timeObj.getHours();
  const minutes = timeObj.getMinutes();
  
  // Get period (am/pm)
  const period = hours >= 12 ? 'pm' : 'am';
  
  // Convert 24-hour time to 12-hour time
  const hours12 = hours % 12 || 12;
  
  // Format as "9pm" or "6:30pm"
  return minutes === 0 
    ? `${hours12}${period}` 
    : `${hours12}:${minutes.toString().padStart(2, '0')}${period}`;
};

/**
 * Format date and time together
 * 
 * @param dateTime - Date string or Date object
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateTime: string | Date): string => {
  if (!dateTime) return 'Unknown';
  
  const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date/time';
  
  return `${formatDate(dateObj)} at ${formatTime(dateObj)}`;
}; 