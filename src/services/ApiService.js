// API Service for making HTTP requests to backend services
import { formatPhoneNumber } from '../utils/formatters';

/**
 * Send SMS notification via the API
 * @param {string} phoneNumber - The recipient's phone number (in UK format)
 * @param {string} message - The message content
 * @returns {Promise<Object>} Response data from the API
 */
export const sendSmsNotification = async (phoneNumber, message) => {
  try {
    console.log(`Sending SMS to ${phoneNumber}`);
    
    // Format phone number for API
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    
    // Use relative URL to ensure it works in all environments
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: formattedPhoneNumber,
        message: message
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('SMS API error:', data);
      throw new Error(data.message || 'Failed to send SMS');
    }
    
    return data;
  } catch (error) {
    console.error('Error in sendSmsNotification:', error);
    throw error;
  }
};

/**
 * Check Twilio API connection
 * @returns {Promise<Object>} Connection status
 */
export const checkTwilioConnection = async () => {
  try {
    console.log('Checking Twilio connection');
    
    const response = await fetch('/api/check-twilio');
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Twilio check API error:', data);
      throw new Error(data.message || 'Failed to check Twilio connection');
    }
    
    return data;
  } catch (error) {
    console.error('Error in checkTwilioConnection:', error);
    throw error;
  }
}; 