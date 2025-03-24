# Serverless API Implementation

This document provides detailed information about the serverless API implementation used for secure integration with external services.

## Overview

The Event Management System uses serverless functions to securely interact with third-party APIs that require authentication credentials, such as Twilio. This approach protects sensitive credentials from being exposed in client-side code while avoiding CORS issues.

## Architecture

```
Frontend App → Serverless API Functions → External APIs (Twilio)
```

This pattern keeps credentials secure on the server side and provides a consistent interface for the frontend.

## Serverless Functions

### `/api/send-sms.js`

This endpoint securely sends SMS messages through Twilio:

- **Method**: POST
- **Parameters**:
  - `to`: Recipient phone number (UK format: 07XXX XXX XXX)
  - `body`: SMS message content
- **Response**: JSON with success status and message details

Implementation notes:
- Credentials are stored as environment variables on the server
- Phone numbers are automatically formatted to international E.164 format
- Errors are properly handled and returned in a consistent format

### `/api/check-twilio.js`

This endpoint verifies Twilio API connectivity:

- **Method**: GET
- **Parameters**: None
- **Response**: JSON with connection status information

## Phone Number Formatting

Both client and server implementations use the same phone number formatting logic:

```javascript
function formatPhoneNumber(phoneNumber) {
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
}
```

## Vercel Configuration

The `vercel.json` file includes specific configuration for API routes:

```json
"functions": {
  "api/*.js": {
    "memory": 1024,
    "maxDuration": 10
  }
},
"routes": [
  { "handle": "filesystem" },
  { "src": "/api/(.*)", "dest": "/api/$1" },
  { "src": "/(.*)", "dest": "/index.html" }
]
```

## Client Integration

The frontend services are designed to use these API endpoints instead of calling external APIs directly:

```typescript
// Send SMS via server-side API
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
```

## Environment Variables

The following environment variables must be configured in the Vercel project:

- `REACT_APP_TWILIO_ACCOUNT_SID`: Twilio account SID
- `REACT_APP_TWILIO_AUTH_TOKEN`: Twilio authentication token
- `REACT_APP_TWILIO_PHONE_NUMBER`: Twilio phone number for sending SMS

## Troubleshooting

If issues occur with the SMS functionality:

1. **Check Vercel Logs**: Examine function logs for detailed error information
2. **Verify Credentials**: Ensure Twilio credentials are still valid and properly set
3. **Test Direct API**: Try calling the Twilio API directly using Postman to verify account status
4. **Check Phone Formatting**: Ensure phone numbers are properly formatted for UK numbers

## Security Considerations

This architecture provides several security benefits:

- Sensitive credentials are never exposed to the client
- Authentication is handled securely on the server
- API requests are properly authenticated with appropriate headers
- Response data is validated before returning to the client

## Implementation Notes for Developers

When creating new serverless functions for Vercel deployment:

1. Use the correct export format: `module.exports = async (req, res) => {...}`
2. Handle request validation appropriately (check HTTP methods, required parameters)
3. Use proper error handling and response formatting
4. Test thoroughly with different input scenarios 