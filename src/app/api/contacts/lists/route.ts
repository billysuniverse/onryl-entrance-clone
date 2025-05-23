export const dynamic = "force-static";
import { type NextRequest, NextResponse } from 'next/server';
import { generateMockLists } from '@/lib/contacts';

export async function GET() {
  try {
    const lists = generateMockLists();
    return NextResponse.json({ lists });
  } catch (error) {
    console.error('Error fetching contact lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact lists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();

    // In a real app, you would validate the data and save to a database
    // For now, we'll just return a success response with a mock ID
    return NextResponse.json({
      id: `list-${Date.now()}`,
      name,
      description,
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact list:', error);
    return NextResponse.json(
      { error: 'Failed to create contact list' },
      { status: 500 }
    );
  }
}
