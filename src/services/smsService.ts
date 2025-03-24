import { supabase } from './supabase';
import { Customer } from '../types/database.types';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Import Twilio for SMS functionality - handle import dynamically to avoid build issues
let twilio: any = null;
let twilioClient: any = null;

// This would typically be stored in environment variables
const TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.REACT_APP_TWILIO_PHONE_NUMBER;

// Try to initialize Twilio client without relying on Buffer check
try {
  // This approach prevents build errors if twilio isn't installed
  if (typeof require !== 'undefined') {
    twilio = require('twilio');
    
    // Initialize Twilio client if credentials are available
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && twilio) {
      try {
        twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        console.log('Twilio client initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Twilio client:', error);
      }
    } else {
      console.warn('Twilio credentials not found or twilio package not available');
    }
  }
} catch (error) {
  console.warn('Twilio package not available or not compatible with this environment:', error);
}

// Message templates for different notification types
export const SMS_TEMPLATES = {
  BOOKING_CONFIRMATION: 'Hi {{customerName}}, your booking for {{eventName}} on {{eventDate}} has been confirmed. We look forward to seeing you!',
  EVENT_REMINDER: 'Hi {{customerName}}, this is a reminder that {{eventName}} is scheduled for tomorrow at {{eventTime}}. We look forward to seeing you!',
  BOOKING_CANCELLATION: 'Hi {{customerName}}, your booking for {{eventName}} on {{eventDate}} has been cancelled. Please contact us if you have any questions.',
  CUSTOM_MESSAGE: '{{customMessage}}'
};

// Define the data structure for message templates
export interface MessageData {
  customerName?: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  customMessage?: string;
  [key: string]: string | undefined;
}

// Format UK phone number to E.164 format (required by Twilio)
const formatPhoneNumber = (phoneNumber: string): string => {
  // If the phone number already starts with +, return it as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Handle UK numbers (stored as 07XXXXXXXXX)
  if (digitsOnly.startsWith('07') && (digitsOnly.length === 11)) {
    // Convert UK mobile format (07XXXXXXXXX) to international format (+44XXXXXXXXX)
    return `+44${digitsOnly.substring(1)}`;
  } 
  
  // If for some reason we get a different format, use it as is with + prefix
  return `+${digitsOnly}`;
};

// Replace placeholders in templates with actual data
const replacePlaceholders = (template: string, data: MessageData): string => {
  let result = template;
  
  // Replace each placeholder with its corresponding value
  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
  });
  
  return result;
};

// Log SMS messages to the database
const logSMSMessage = async (
  phoneNumber: string, 
  messageBody: string, 
  success: boolean,
  errorMessage?: string
): Promise<void> => {
  try {
    await supabase.from('sms_logs').insert([{
      phone_number: phoneNumber,
      message_body: messageBody,
      success,
      error_message: errorMessage || null
    }]);
  } catch (error) {
    console.error('Error logging SMS message:', error);
  }
};

export const smsService = {
  // Check if Twilio is properly configured
  isTwilioConfigured: (): boolean => {
    // Check both environment variables and client
    return !!TWILIO_ACCOUNT_SID && !!TWILIO_AUTH_TOKEN && !!TWILIO_PHONE_NUMBER;
  },
  
  // Force SMS to be sent in production mode (no simulation)
  forceSMSProductionMode: (): Promise<boolean> => {
    return new Promise(async (resolve) => {
      try {
        // Use the server-side API to check Twilio connectivity
        const response = await fetch('/api/check-twilio');
        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log('Twilio API connection verified via server-side API');
          resolve(true);
        } else {
          console.error('Failed to verify Twilio API connection:', data.message);
          resolve(false);
        }
      } catch (error) {
        console.error('Error checking Twilio API connection:', error);
        resolve(false);
      }
    });
  },
  
  // Send an SMS using Twilio API
  sendSMS: async (
    phoneNumber: string, 
    template: string, 
    data: MessageData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Check for required Twilio credentials
      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.error('Missing Twilio credentials');
        return { 
          success: false, 
          message: 'SMS service is not configured. Please set up Twilio credentials.' 
        };
      }
      
      // Format phone number to E.164 format (required by Twilio)
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      
      // Replace template placeholders with actual data
      const messageBody = replacePlaceholders(template, data);
      
      console.log(`[SMS Service] Attempting to send SMS to: ${formattedPhoneNumber}, Message: ${messageBody}`);
      
      // Use the server-side API endpoint instead of direct Twilio API call
      try {
        console.log('[SMS Service] Using server-side API endpoint');
        
        const response = await fetch('/api/send-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: formattedPhoneNumber,
            body: messageBody
          })
        });
        
        const responseData = await response.json();
        
        // Log response status for debugging
        console.log(`[SMS Service] API response status: ${response.status}`, responseData);
        
        if (response.ok && responseData.success) {
          console.log(`[SMS Service] Message sent successfully via API. SID: ${responseData.sid}`);
          await logSMSMessage(phoneNumber, messageBody, true);
          return { 
            success: true, 
            message: `SMS sent successfully. Message SID: ${responseData.sid}` 
          };
        } else {
          throw new Error(responseData.message || 'API error');
        }
      } catch (apiError) {
        console.error('API call failed:', apiError);
        
        // Log the failed message
        await logSMSMessage(phoneNumber, messageBody, false, String(apiError));
        
        return { 
          success: false, 
          message: `Failed to send SMS: ${apiError}` 
        };
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      
      // Log the failed message
      await logSMSMessage(phoneNumber, template, false, String(error));
      
      return { 
        success: false, 
        message: `Failed to send SMS: ${error}` 
      };
    }
  },
  
  // Send a booking confirmation SMS
  sendBookingConfirmation: async (customer: Customer, eventName: string, eventDate: string): Promise<{ success: boolean; message: string }> => {
    return smsService.sendSMS(
      customer.mobile_number,
      SMS_TEMPLATES.BOOKING_CONFIRMATION,
      {
        customerName: `${customer.first_name} ${customer.last_name}`,
        eventName,
        eventDate
      }
    );
  },
  
  // Send an event reminder SMS
  sendEventReminder: async (customer: Customer, eventName: string, eventTime: string): Promise<{ success: boolean; message: string }> => {
    return smsService.sendSMS(
      customer.mobile_number,
      SMS_TEMPLATES.EVENT_REMINDER,
      {
        customerName: `${customer.first_name} ${customer.last_name}`,
        eventName,
        eventTime
      }
    );
  },
  
  // Send a booking cancellation SMS
  sendBookingCancellation: async (customer: Customer, eventName: string, eventDate: string): Promise<{ success: boolean; message: string }> => {
    return smsService.sendSMS(
      customer.mobile_number,
      SMS_TEMPLATES.BOOKING_CANCELLATION,
      {
        customerName: `${customer.first_name} ${customer.last_name}`,
        eventName,
        eventDate
      }
    );
  },
  
  // Send a custom SMS message
  sendCustomMessage: async (customer: Customer, customMessage: string): Promise<{ success: boolean; message: string }> => {
    return smsService.sendSMS(
      customer.mobile_number,
      SMS_TEMPLATES.CUSTOM_MESSAGE,
      {
        customerName: `${customer.first_name} ${customer.last_name}`,
        customMessage
      }
    );
  },
  
  // Get all SMS logs
  getSMSLogs: async () => {
    const { data, error } = await supabase
      .from('sms_logs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching SMS logs:', error);
      throw error;
    }
    
    return data || [];
  }
}; 