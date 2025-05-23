export const dynamic = "force-static";
import { type NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Phone number pool for 10DLC management
const phoneNumberPool = [
  '+12025550142',
  '+12025550143',
  '+12025550144',
  '+12025550145',
  '+12025550146',
  '+12025550147',
  '+12025550148',
  '+12025550149',
  '+12025550150',
];

// Function to send SMS
async function sendSMS(to: string, body: string, options: any = {}) {
  try {
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_YOUR_ACCOUNT_SID';
    const authToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_AUTH_TOKEN';

    // Check if we're in development mode (mock) or production
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (isDevelopment) {
      // Mock sending in development
      console.log(`[MOCK] Sending SMS to ${to}: ${body}`);

      // Simple round-robin selection from the pool
      const fromIndex = Math.floor(Math.random() * phoneNumberPool.length);
      const from = options.from || phoneNumberPool[fromIndex];

      // Create a mock message ID
      const mockMessageId = 'SM' + Math.random().toString(36).substring(2, 15);

      // Return success response with mock data
      return {
        success: true,
        messageId: mockMessageId,
        from,
        to,
        body,
        status: 'queued',
      };
    }

    // Initialize Twilio client with credentials
    const client = twilio(accountSid, authToken);

    // Simple round-robin selection from the pool if no 'from' specified
    const fromIndex = Math.floor(Math.random() * phoneNumberPool.length);
    const from = options.from || phoneNumberPool[fromIndex];

    // Send message using Twilio API
    const message = await client.messages.create({
      body,
      from,
      to,
      statusCallback: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/api/twilio/webhook`,
      ...options,
    });

    // Return success response
    return {
      success: true,
      messageId: message.sid,
      from,
      to,
      body,
      status: message.status,
    };
  } catch (error: any) {
    console.error('Error sending SMS:', error);

    // Return error response
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.to || !body.body) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: to, body' },
        { status: 400 }
      );
    }

    // Format the phone number (ensure E.164 format)
    let to = body.to.replace(/\D/g, '');
    if (to.length === 10) {
      to = '1' + to;
    }
    to = '+' + to;

    // Send the SMS
    const result = await sendSMS(to, body.body, body.options || {});

    // Return the result
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in SMS API route:', error);

    // Return error response
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export function GET(request: NextRequest) {
  // Return a basic response for testing
  return NextResponse.json({
    status: 'ready',
    message: 'This endpoint accepts POST requests to send SMS messages.'
  });
}
