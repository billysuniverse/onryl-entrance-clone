export const dynamic = "force-static";
import { type NextRequest, NextResponse } from 'next/server';

// Mock database
const campaigns: any[] = [];

export async function GET(req: NextRequest) {
  // List all campaigns
  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  // Create a new campaign
  const data = await req.json();
  const newCampaign = { id: Date.now(), ...data };
  campaigns.push(newCampaign);
  return NextResponse.json({ campaign: newCampaign }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  // Update an existing campaign
  const data = await req.json();
  const { id, ...rest } = data;
  const idx = campaigns.findIndex(c => c.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }
  campaigns[idx] = { ...campaigns[idx], ...rest };
  return NextResponse.json({ campaign: campaigns[idx] });
}
