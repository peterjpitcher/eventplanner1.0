// Serverless function for securely sending SMS via Twilio
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get Twilio credentials from environment variables - these are securely stored on the server
    const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER;

    // Make sure we have all required credentials
    if (!accountSid || !authToken || !fromNumber) {
      console.error('Missing Twilio credentials in environment variables');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error: Missing Twilio credentials' 
      });
    }

    // Get parameters from request body
    const { to, body } = req.body;

    if (!to || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters: to and body are required' 
      });
    }

    // Format phone number to E.164 format if needed
    const formattedPhoneNumber = formatPhoneNumber(to);

    console.log(`[API] Sending SMS to: ${formattedPhoneNumber}`);

    // Create Basic auth header
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    // Call Twilio API to send the message
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`
        },
        body: new URLSearchParams({
          To: formattedPhoneNumber,
          From: fromNumber,
          Body: body
        })
      }
    );

    // Parse the Twilio response
    const responseData = await twilioResponse.json();

    // Check if the request was successful
    if (twilioResponse.ok) {
      console.log(`[API] SMS sent successfully. SID: ${responseData.sid}`);
      
      // Return success response
      return res.status(200).json({
        success: true,
        message: `SMS sent successfully. Message SID: ${responseData.sid}`,
        sid: responseData.sid
      });
    } else {
      // Log and return the error
      console.error(`[API] Twilio API error:`, responseData);
      
      return res.status(twilioResponse.status).json({
        success: false,
        message: `Twilio API error: ${responseData.message || 'Unknown error'}`,
        code: responseData.code,
        twilioError: responseData
      });
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    
    return res.status(500).json({
      success: false,
      message: `Server error sending SMS: ${error.message}`
    });
  }
}

// Format UK phone number to E.164 format (required by Twilio)
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