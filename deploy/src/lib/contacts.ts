// Server-side code
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  tags: string[];
  lists: string[];
  lastContactedAt?: Date;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
  // Additional fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  customFields?: Record<string, string>;
  // Campaign and message stats
  campaignsSent?: number;
  messagesSent?: number;
  messagesReceived?: number;
  lastReplyAt?: Date;
  optOutStatus?: boolean;
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactTag {
  id: string;
  name: string;
  color: string;
  count: number;
}

// Generate mock data for testing
export function generateMockContacts(count = 50): Contact[] {
  const tags = ['Customer', 'Lead', 'VIP', 'New', 'Returning', 'Subscriber', 'Prospect'];
  const lists = ['Main List', 'Newsletter', 'Promotions', 'Updates', 'Product Announcements'];
  const statuses = ['active', 'inactive', 'blocked'] as const;

  return Array.from({ length: count }).map((_, index) => {
    const id = `contact-${index + 1}`;
    const firstName = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona'][Math.floor(Math.random() * 8)];
    const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][Math.floor(Math.random() * 8)];
    const phoneNumber = `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    const randomTags = tags
      .filter(() => Math.random() > 0.7)
      .slice(0, Math.floor(Math.random() * 4));

    const randomLists = lists
      .filter(() => Math.random() > 0.6)
      .slice(0, Math.floor(Math.random() * 3));

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 365));

    const updatedAt = new Date(createdAt);
    updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * (new Date().getDate() - createdAt.getDate())));

    const lastContactedAt = Math.random() > 0.3 ? new Date(updatedAt) : undefined;
    if (lastContactedAt) {
      lastContactedAt.setDate(lastContactedAt.getDate() + Math.floor(Math.random() * 30));
    }

    return {
      id,
      firstName,
      lastName,
      phoneNumber,
      email,
      tags: randomTags,
      lists: randomLists,
      lastContactedAt,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt,
      updatedAt,
      campaignsSent: Math.floor(Math.random() * 10),
      messagesSent: Math.floor(Math.random() * 50),
      messagesReceived: Math.floor(Math.random() * 30),
      lastReplyAt: Math.random() > 0.5 ? new Date() : undefined,
      optOutStatus: Math.random() > 0.9
    };
  });
}

export function generateMockLists(): ContactList[] {
  return [
    { id: '1', name: 'Main List', description: 'Primary contact list', count: 1245, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Newsletter', description: 'Weekly newsletter subscribers', count: 876, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Promotions', description: 'Special offers and promotions', count: 543, createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: 'Updates', description: 'Product updates and announcements', count: 321, createdAt: new Date(), updatedAt: new Date() },
    { id: '5', name: 'Product Announcements', description: 'New product launches', count: 98, createdAt: new Date(), updatedAt: new Date() },
  ];
}

export function generateMockTags(): ContactTag[] {
  return [
    { id: '1', name: 'Customer', color: '#4CAF50', count: 850 },
    { id: '2', name: 'Lead', color: '#2196F3', count: 425 },
    { id: '3', name: 'VIP', color: '#FFC107', count: 120 },
    { id: '4', name: 'New', color: '#9C27B0', count: 310 },
    { id: '5', name: 'Returning', color: '#F44336', count: 275 },
    { id: '6', name: 'Subscriber', color: '#795548', count: 520 },
    { id: '7', name: 'Prospect', color: '#607D8B', count: 190 },
  ];
}

// Server-side function for API routes
export async function getContacts(query?: string, tags?: string[], lists?: string[], status?: string) {
  const contacts = generateMockContacts(100);

  return contacts.filter(contact => {
    const matchesQuery = !query ||
      contact.firstName.toLowerCase().includes(query.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(query.toLowerCase()) ||
      contact.phoneNumber.includes(query) ||
      (contact.email && contact.email.toLowerCase().includes(query.toLowerCase()));

    const matchesTags = !tags?.length || tags.some(tag => contact.tags.includes(tag));
    const matchesLists = !lists?.length || lists.some(list => contact.lists.includes(list));
    const matchesStatus = !status || contact.status === status;

    return matchesQuery && matchesTags && matchesLists && matchesStatus;
  });
}
