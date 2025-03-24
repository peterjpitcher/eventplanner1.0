import { supabase } from './supabase';
import { Customer } from '../types/database.types';

// This would typically be stored in environment variables
const TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.REACT_APP_TWILIO_PHONE_NUMBER;

// Message templates for different notification types
export const SMS_TEMPLATES = {
  BOOKING_CONFIRMATION: 'Hi {{customerName}}, your booking for {{eventName}} on {{eventDate}} has been confirmed. We look forward to seeing you!',
  EVENT_REMINDER: 'Hi {{customerName}}, this is a reminder that {{eventName}} is scheduled for tomorrow at {{eventTime}}. We look forward to seeing you!',
  BOOKING_CANCELLATION: 'Hi {{customerName}}, your booking for {{eventName}} on {{eventDate}} has been cancelled. Please contact us if you have any questions.',
  CUSTOM_MESSAGE: '{{customMessage}}'
};

// Interface for message data
interface MessageData {
  customerName: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  customMessage?: string;
}

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
      
      // In a real implementation, we would call Twilio API here
      // For now, we'll just log the message and simulate a successful call
      console.log(`[SMS Service] To: ${formattedPhoneNumber}, Message: ${messageBody}`);
      
      // In production, you would use the Twilio API like this:
      /*
      const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const message = await twilio.messages.create({
        body: messageBody,
        from: TWILIO_PHONE_NUMBER,
        to: formattedPhoneNumber
      });
      */
      
      // Log the message to the SMS logs table
      await logSMSMessage(phoneNumber, messageBody, true);
      
      return { 
        success: true, 
        message: 'SMS sent successfully.' 
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

// Helper function to format phone number to E.164 format
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the number already has a country code
  if (cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  // Assume US number and add +1 prefix if not present
  return `+1${cleaned}`;
};

// Helper function to replace placeholders in templates
const replacePlaceholders = (template: string, data: MessageData): string => {
  let message = template;
  
  // Replace all placeholders with corresponding data
  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(regex, value);
    }
  });
  
  return message;
};

// Log SMS messages to the database
const logSMSMessage = async (
  phoneNumber: string, 
  message: string, 
  success: boolean,
  error?: string
) => {
  try {
    const { error: dbError } = await supabase
      .from('sms_logs')
      .insert({
        phone_number: phoneNumber,
        message_body: message,
        success,
        error_message: error || null
      });
    
    if (dbError) {
      console.error('Error logging SMS message:', dbError);
    }
  } catch (err) {
    console.error('Error logging SMS message:', err);
  }
}; 