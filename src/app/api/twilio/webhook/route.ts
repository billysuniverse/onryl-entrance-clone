export const dynamic = "force-static";
import { type NextRequest, NextResponse } from 'next/server';

/**
 * This API route handles Twilio webhooks for message status updates
 * In a real app, this would update a database with the message status
 * For now, we'll just log the status update
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the form data from Twilio
    const formData = await request.formData();

    // Extract the message SID and status
    const messageSid = formData.get('MessageSid') as string;
    const messageStatus = formData.get('MessageStatus') as string;
    const to = formData.get('To') as string;
    const from = formData.get('From') as string;

    console.log(`Message ${messageSid} to ${to} from ${from} status updated to: ${messageStatus}`);

    // In a real app, you would:
    // 1. Verify the request is from Twilio using their validation
    // 2. Update your database with the new message status
    // 3. Emit a server-sent event or use a WebSocket to notify the client

    // Return a 200 response to Twilio
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling Twilio webhook:', error);

    // Return a 500 error response
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

export function GET(request: NextRequest) {
  // Return a basic response for testing
  return NextResponse.json({
    status: 'ready',
    message: 'Twilio webhook endpoint is active. Send POST requests to this URL.'
  });
}
