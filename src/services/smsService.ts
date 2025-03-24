import { supabase } from './supabase';
import { Customer } from '../types/database.types';
// Import Twilio for SMS functionality
import twilio from 'twilio';

// This would typically be stored in environment variables
const TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.REACT_APP_TWILIO_PHONE_NUMBER;

// Initialize Twilio client if credentials are available
let twilioClient: any = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    console.log('Twilio client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error);
  }
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

// Format phone number to E.164 format (required by Twilio)
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Ensure it has the + prefix and country code (assuming US/Canada if not specified)
  if (digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  } else {
    return `+1${digitsOnly}`;
  }
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
      
      // Use the Twilio API to send the message
      if (!twilioClient) {
        throw new Error('Twilio client is not initialized');
      }
      
      const message = await twilioClient.messages.create({
        body: messageBody,
        from: TWILIO_PHONE_NUMBER,
        to: formattedPhoneNumber
      });
      
      console.log(`[SMS Service] Message sent successfully. SID: ${message.sid}`);
      
      // Log the message to the SMS logs table
      await logSMSMessage(phoneNumber, messageBody, true);
      
      return { 
        success: true, 
        message: `SMS sent successfully. Message SID: ${message.sid}` 
      };
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