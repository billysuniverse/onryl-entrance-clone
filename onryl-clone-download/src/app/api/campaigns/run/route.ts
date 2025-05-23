export const dynamic = "force-static";
import { type NextRequest, NextResponse } from 'next/server';

// Mock database of campaigns
const mockCampaigns = [
  {
    id: 1,
    name: 'May 2023 New Leads',
    status: 'active',
    channels: 1250,
    responseCount: 32,
    responseRate: '2.56%',
    lastRun: '2023-05-15',
    createdAt: '2023-05-01',
    owner: 'John Doe',
    template: 'Good morning! All apps submitted before 9 am are guaranteed to make this morning\'s 11 am wire.',
    phonePool: ['+12025550142', '+12025550143'],
    recipients: ['+15551234567', '+15552345678', '+15553456789'],
    tags: ['new-leads', 'may-2023']
  },
  // More campaigns...
];

// Function to get mock recipients for a campaign
// In a real app, this would fetch from a database
function getMockRecipients(campaignId: number, limit = 50) {
  // Generate random phone numbers
  const recipients = [];
  for (let i = 0; i < limit; i++) {
    recipients.push(`+1555${Math.floor(1000000 + Math.random() * 9000000)}`);
  }
  return recipients;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { campaignId } = body;

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Fetch the campaign from your database
    // 2. Get the list of recipients
    // 3. Update the campaign status
    // 4. Queue a job to send messages to all recipients

    // For our demo, let's just call the Twilio bulk API directly
    const campaign = mockCampaigns.find(c => c.id === campaignId);

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Get recipients (mock for demo)
    const recipients = getMockRecipients(campaignId, 10);

    // Call the Twilio bulk API endpoint
    const response = await fetch('/api/twilio/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients,
        body: campaign.template,
        options: {
          // Optionally specify a subset of the phone pool to use
          from: campaign.phonePool,
          campaignId: campaignId,
        },
      }),
    });

    const result = await response.json();

    // Update the campaign status (in a real app, this would update the database)
    // Update last run date, mark as active, etc.

    // Return the result
    return NextResponse.json({
      success: true,
      campaign: {
        id: campaignId,
        status: 'active',
        lastRun: new Date().toISOString().split('T')[0]
      },
      sending: {
        total: result.total,
        sent: result.sent,
        failed: result.failed
      }
    });
  } catch (error: any) {
    console.error('Error running campaign:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
