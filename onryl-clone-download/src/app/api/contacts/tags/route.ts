export const dynamic = "force-static";
import { type NextRequest, NextResponse } from 'next/server';
import { generateMockTags } from '@/lib/contacts';

export async function GET() {
  try {
    const tags = generateMockTags();
    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching contact tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, color } = await request.json();

    // In a real app, you would validate the data and save to a database
    // For now, we'll just return a success response with a mock ID
    return NextResponse.json({
      id: `tag-${Date.now()}`,
      name,
      color,
      count: 0
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact tag:', error);
    return NextResponse.json(
      { error: 'Failed to create contact tag' },
      { status: 500 }
    );
  }
}
