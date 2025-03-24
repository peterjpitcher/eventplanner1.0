// Serverless function for checking Twilio API connectivity
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get Twilio credentials from environment variables
    const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;

    // Make sure we have all required credentials
    if (!accountSid || !authToken) {
      console.error('Missing Twilio credentials in environment variables');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error: Missing Twilio credentials' 
      });
    }

    // Create Basic auth header
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    // Call Twilio API to check connectivity (just get the first page of messages)
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json?PageSize=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`
        }
      }
    );

    // Check if the request was successful
    if (twilioResponse.ok) {
      const data = await twilioResponse.json();
      console.log(`[API] Twilio connectivity verified. Found ${data.messages.length} messages.`);
      
      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Twilio API connection verified successfully.',
        count: data.messages.length
      });
    } else {
      // Try to parse the error response
      let errorData = {};
      try {
        errorData = await twilioResponse.json();
      } catch (e) {
        // If we can't parse the response, just use the status text
        errorData = { message: twilioResponse.statusText };
      }
      
      console.error(`[API] Twilio API connection error:`, errorData);
      
      return res.status(twilioResponse.status).json({
        success: false,
        message: `Twilio API connection error: ${errorData.message || 'Unknown error'}`,
        status: twilioResponse.status,
        twilioError: errorData
      });
    }
  } catch (error) {
    console.error('Error checking Twilio API connectivity:', error);
    
    return res.status(500).json({
      success: false,
      message: `Server error checking Twilio API connectivity: ${error.message}`
    });
  }
} 