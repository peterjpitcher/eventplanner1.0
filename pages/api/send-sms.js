// Next.js API Route for sending SMS messages via Twilio API

// Enable CORS
export const config = {
  runtime: 'edge',
  regions: ['lhr1'],
};

export default async function handler(req) {
  console.log('[API] send-sms.js handler called with method:', req.method);
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    // Get Twilio credentials from environment variables
    const accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER;

    console.log('[API] Checking Twilio credentials');
    console.log(`[API] Account SID present: ${!!accountSid}`);
    console.log(`[API] Auth Token present: ${!!authToken}`);
    console.log(`[API] Phone Number present: ${!!twilioPhoneNumber}`);

    // Parse request body
    const body = await req.json();
    const { to, message } = body;
    console.log(`[API] Request params - to: ${to ? 'provided' : 'missing'}, message: ${message ? 'provided' : 'missing'}`);

    // Make sure we have all required parameters
    if (!to || !message) {
      console.error('[API] Missing required parameters in request body');
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: to and message are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Make sure we have all required credentials
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error('[API] Missing Twilio credentials in environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Twilio credentials' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Format the phone number to E.164 format for Twilio
    let formattedPhone = to;
    if (!to.startsWith('+')) {
      // If the phone number already starts with +, leave it as is
      // Otherwise, handle UK numbers (starting with 07...)
      if (to.startsWith('07') && to.replace(/\D/g, '').length === 11) {
        // Convert UK mobile format (07XXXXXXXXX) to international format (+44XXXXXXXXX)
        formattedPhone = `+44${to.substring(1).replace(/\D/g, '')}`;
      } else {
        // If it's not a recognizable UK format, just add + at the beginning
        formattedPhone = `+${to.replace(/\D/g, '')}`;
      }
    }

    console.log(`[API] Sending SMS to ${formattedPhone} (original: ${to})`);
    
    // Create Basic auth header
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    try {
      // Call Twilio API to send message
      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            To: formattedPhone,
            From: twilioPhoneNumber,
            Body: message
          }).toString()
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
        console.log(`[API] SMS sent successfully. SID: ${data.sid}`);
        
        // Return success response
        return new Response(
          JSON.stringify({
            success: true,
            message: 'SMS sent successfully',
            messageId: data.sid
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
        console.error(`[API] Twilio API error:`, data);
        
        return new Response(
          JSON.stringify({
            success: false,
            message: `Failed to send SMS: ${data.message || data.code || 'Unknown error'}`,
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
    console.error('[API] Error sending SMS:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Server error sending SMS: ${error.message}`
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