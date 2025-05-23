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

// Function to send a single SMS
async function sendSMS(to: string, body: string, from: string, isDevelopment: boolean) {
  try {
    if (isDevelopment) {
      // Mock sending in development
      console.log(`[MOCK] Sending SMS to ${to} from ${from}: ${body}`);

      // Create a mock message ID
      const mockMessageId = 'SM' + Math.random().toString(36).substring(2, 15);

      // Simulate a small chance of failure for testing
      const randomSuccess = Math.random() > 0.05; // 5% chance of failure

      if (randomSuccess) {
        return {
          success: true,
          messageId: mockMessageId,
          from,
          to,
          body,
          status: 'queued',
        };
      } else {
        throw new Error('Random mock failure');
      }
    } else {
      // Get Twilio credentials from environment variables
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;

      if (!accountSid || !authToken) {
        throw new Error('Missing Twilio credentials');
      }

      // Initialize Twilio client with credentials
      const client = twilio(accountSid, authToken);

      // Send message using Twilio API
      const message = await client.messages.create({
        body,
        from,
        to,
        statusCallback: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}/api/twilio/webhook`,
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
    }
  } catch (error: any) {
    console.error(`Error sending SMS to ${to}:`, error);

    // Return error response
    return {
      success: false,
      to,
      error: error.message,
    };
  }
}

// Function to send bulk SMS
async function sendBulkSMS(recipients: string[], body: string, options: any = {}) {
  const results: any[] = [];
  const promises: Promise<any>[] = [];

  // Check if we're in development mode (mock) or production
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Distribute messages across multiple numbers in the pool
  for (let i = 0; i < recipients.length; i++) {
    // Rotate through phone numbers for load balancing
    const fromIndex = i % phoneNumberPool.length;
    const from = options.from || phoneNumberPool[fromIndex];

    // Queue up the send operation
    const promise = sendSMS(recipients[i], body, from, isDevelopment)
      .then(result => {
        results.push(result);
        return result;
      })
      .catch(error => {
        results.push({
          success: false,
          to: recipients[i],
          error: error.message,
        });
        return error;
      });

    promises.push(promise);
  }

  // Wait for all sending operations to complete
  await Promise.all(promises);

  return {
    total: recipients.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.recipients || !body.body || !Array.isArray(body.recipients)) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: recipients (array), body' },
        { status: 400 }
      );
    }

    // Format the phone numbers (ensure E.164 format)
    const formattedRecipients = body.recipients.map((recipient: string) => {
      let to = recipient.replace(/\D/g, '');
      if (to.length === 10) {
        to = '1' + to;
      }
      return '+' + to;
    });

    // Send the bulk SMS
    const result = await sendBulkSMS(formattedRecipients, body.body, body.options || {});

    // Return the result
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in bulk SMS API route:', error);

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
    message: 'This endpoint accepts POST requests to send bulk SMS messages.'
  });
}
