// Next.js API Route for checking Twilio API connectivity

// Enable CORS
export const config = {
  runtime: 'edge',
  regions: ['lhr1'],
};

export default async function handler(req) {
  console.log('[API] check-twilio.js handler called with method:', req.method);

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
        },
      }
    );
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
      console.error('[API] Missing Twilio credentials in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Server configuration error: Missing Twilio credentials' 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Create Basic auth header
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    try {
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
        console.error('[API] Failed to parse Twilio response as JSON:', responseText.substring(0, 100));
        return new Response(
          JSON.stringify({
            success: false,
            message: `Failed to parse Twilio response: ${responseText.substring(0, 100)}...`,
            status: twilioResponse.status
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          }
        );
      }

      // Check if the request was successful
      if (twilioResponse.ok) {
        console.log(`[API] Twilio connectivity verified. Found ${data.messages?.length || 0} messages.`);
        
        // Return success response
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Twilio API connection verified successfully.',
            count: data.messages?.length || 0
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          }
        );
      } else {
        console.error(`[API] Twilio API connection error:`, data);
        
        return new Response(
          JSON.stringify({
            success: false,
            message: `Twilio API connection error: ${data.message || data.code || 'Unknown error'}`,
            status: twilioResponse.status,
            twilioError: data
          }),
          {
            status: twilioResponse.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          }
        );
      }
    } catch (fetchError) {
      console.error('[API] Fetch error calling Twilio:', fetchError);
      return new Response(
        JSON.stringify({
          success: false, 
          message: `Error calling Twilio API: ${fetchError.message}`
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
  } catch (error) {
    console.error('[API] Error checking Twilio API connectivity:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Server error checking Twilio API connectivity: ${error.message}`
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
} 