# SMS Notification System

This document outlines the SMS notification system used in the Event Management System.

## Overview

The application uses SMS notifications to communicate with customers about bookings, event reminders, and other important information. The system is built on top of the Twilio API, with a fallback mechanism to simulate SMS functionality when Twilio is not available or configured.

## SMS Service

The SMS service is implemented in `src/services/smsService.ts` and provides the following functionality:

- Send booking confirmations to customers
- Send event reminders to customers
- Send booking cancellation notifications
- Send custom messages to specific customers

### UK Phone Number Format

The application is designed specifically for UK users and follows these phone number conventions:

#### Storage Format
- Phone numbers are stored in the database in UK format: `07XXX XXX XXX`
- This format is enforced through form validation in the CustomerForm component

#### International Format for Twilio
- When sending SMS messages, the phone numbers are automatically converted to international format (`+44XXXXXXXXX`) as required by Twilio
- The conversion is handled by the `formatPhoneNumber` function:

```typescript
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
```

### Validation Rules
- Valid UK mobile numbers must start with `07` and contain 11 digits total
- The validation regex is: `/^(07\d{9}|\+447\d{9})$/`
- This validation is applied in the CustomerForm component

## Message Templates

The system uses pre-defined templates for different types of notifications:

```typescript
export const SMS_TEMPLATES = {
  BOOKING_CONFIRMATION: 'Hi {{customerName}}, your booking for {{eventName}} on {{eventDate}} has been confirmed. We look forward to seeing you!',
  EVENT_REMINDER: 'Hi {{customerName}}, this is a reminder that {{eventName}} is scheduled for tomorrow at {{eventTime}}. We look forward to seeing you!',
  BOOKING_CANCELLATION: 'Hi {{customerName}}, your booking for {{eventName}} on {{eventDate}} has been cancelled. Please contact us if you have any questions.',
  CUSTOM_MESSAGE: '{{customMessage}}'
};
```

Each template supports placeholders (enclosed in double curly braces) that are replaced with actual data when the message is sent.

## SMS Logging

All SMS messages (both successful and failed) are logged in the `sms_logs` table in Supabase with the following information:

- Recipient phone number
- Message content
- Success/failure status
- Error message (if applicable)
- Timestamp

## Implementation Details

### Twilio Integration

The service uses dynamic imports to handle Twilio integration:

```typescript
// Only try to load Twilio if we're in a browser-compatible environment
if (!isBrowser || (isBrowser && window.Buffer)) {
  try {
    // This approach prevents build errors if twilio isn't installed
    twilio = require('twilio');
    
    // Initialize Twilio client if credentials are available
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && twilio) {
      try {
        twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        console.log('Twilio client initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Twilio client:', error);
      }
    }
  } catch (error) {
    console.warn('Twilio package not available or not compatible with this environment:', error);
  }
}
```

### Simulation Mode

When Twilio is not available or configured, the service falls back to simulation mode:

```typescript
if (!twilioClient) {
  // In deployment or if Twilio isn't available, simulate success for preview/testing
  console.warn('Twilio client not available - simulating SMS sending in browser environment');
  
  // Log the simulated message
  await logSMSMessage(phoneNumber, messageBody, true);
  
  return { 
    success: true, 
    message: `SMS simulated successfully in browser environment. Message would be sent to ${formattedPhoneNumber}` 
  };
}
```

## Configuration

To use the SMS service with Twilio, set the following environment variables:

```
REACT_APP_TWILIO_ACCOUNT_SID=your-account-sid
REACT_APP_TWILIO_AUTH_TOKEN=your-auth-token
REACT_APP_TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

These variables can be set in your `.env.local` file for local development or in the Vercel environment variables for production.

## Debugging

You can check if Twilio is properly configured by using the `isTwilioConfigured` method:

```typescript
const isTwilioConfigured = smsService.isTwilioConfigured();
```

This method returns `true` if all required Twilio environment variables are set. 