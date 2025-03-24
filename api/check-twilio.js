// Serverless function for checking Twilio API connectivity
// For Vercel serverless functions
module.exports = async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get Twilio credentials from environment variables
    const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;

    console.log('[API] Checking Twilio credentials');
    console.log(`[API] Account SID present: ${!!accountSid}`);
    console.log(`[API] Auth Token present: ${!!authToken}`);

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

    // Get the raw response text for debugging
    const responseText = await twilioResponse.text();
    console.log(`[API] Twilio API response status: ${twilioResponse.status}`);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('[API] Failed to parse Twilio response as JSON:', responseText);
      return res.status(500).json({
        success: false,
        message: `Failed to parse Twilio response: ${responseText.substring(0, 100)}...`,
        status: twilioResponse.status
      });
    }

    // Check if the request was successful
    if (twilioResponse.ok) {
      console.log(`[API] Twilio connectivity verified. Found ${data.messages?.length || 0} messages.`);
      
      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Twilio API connection verified successfully.',
        count: data.messages?.length || 0
      });
    } else {
      console.error(`[API] Twilio API connection error:`, data);
      
      return res.status(twilioResponse.status).json({
        success: false,
        message: `Twilio API connection error: ${data.message || data.code || 'Unknown error'}`,
        status: twilioResponse.status,
        twilioError: data
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