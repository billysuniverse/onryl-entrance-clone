export const dynamic = "force-static";
import { type NextRequest, NextResponse } from 'next/server';
import { getContacts, generateMockContacts, generateMockLists, generateMockTags } from '@/lib/contacts';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const tags = searchParams.getAll('tag');
  const lists = searchParams.getAll('list');
  const status = searchParams.get('status') || '';
  const page = Number.parseInt(searchParams.get('page') || '1');
  const pageSize = Number.parseInt(searchParams.get('pageSize') || '20');

  try {
    const allContacts = await getContacts(query, tags, lists, status);

    // Paginate contacts
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedContacts = allContacts.slice(startIndex, endIndex);

    return NextResponse.json({
      contacts: paginatedContacts,
      pagination: {
        total: allContacts.length,
        page,
        pageSize,
        totalPages: Math.ceil(allContacts.length / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // In a real app, you would validate the data and save to a database
    // For now, we'll just return a success response with a mock ID
    const newContactId = `contact-${Date.now()}`;

    return NextResponse.json({
      id: newContactId,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

// These functions need to be moved to their respective route.ts files
// instead of being exported from here
