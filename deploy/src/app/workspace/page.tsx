"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WorkspacePage() {
  const workspaceCards = [
    {
      id: 'users',
      title: 'USERS',
      description: 'Add, edit, and remove your workspace users here. Update their numbers, permissions, and settings.',
      color: 'blue',
    },
    {
      id: 'flags',
      title: 'WORKSPACE FLAGS',
      description: 'Manage your message flags. Add, delete, and set flag name. Use these flags to help manage your channels.',
      color: 'blue',
    },
    {
      id: 'numbers',
      title: 'NUMBERS',
      description: 'Manage your workspace\'s numbers. Subscribe to and unrent your numbers. Cycle numbers for new ones.',
      color: 'green',
    },
    {
      id: 'blocked',
      title: 'BLOCKED NUMBERS',
      description: 'Manage your workspace\'s blocked numbers to better control and prevent messages from unwanted numbers.',
      color: 'red',
    },
    {
      id: 'billing',
      title: 'BILLING',
      description: 'Review your monthly billing summary, manage your subscriptions, or purchase additional credits.',
      color: 'purple',
    },
    {
      id: 'settings',
      title: 'SETTINGS',
      description: 'Adjust various settings of your users, campaigns, and claims here for more control over your workspace.',
      color: 'yellow',
    },
    {
      id: 'message',
      title: 'MESSAGE MANAGEMENT',
      description: 'Manage things like blacklisted words and phrases in your campaign messages before they\'re sent out.',
      color: 'blue',
    },
    {
      id: 'api',
      title: 'API',
      description: 'View and manage your api keys, retrieve your current api key or regenerate a new one if needed.',
      color: 'yellow',
    },
    {
      id: 'webhooks',
      title: 'WEBHOOKS',
      description: 'View and manage your workspace\'s webhooks. Create, edit, and delete webhooks as needed.',
      color: 'purple',
    },
    {
      id: 'tenDLC',
      title: '10DLC',
      description: 'Register your company for 10DLC to increase the volume and rate of sending messages to customers.',
      color: 'green',
    },
    {
      id: 'integrations',
      title: 'INTEGRATIONS',
      description: 'Integrate a third-party apps into your workspace with our easy to use integrations system.',
      color: 'blue',
    },
    {
      id: 'logs',
      title: 'LOGS',
      description: 'View the activity in your workspace such as users creating campaigns, claiming, sending and so forth.',
      color: 'blue',
    },
    {
      id: 'crm',
      title: 'CRM MANAGEMENT',
      description: 'Easy management for your CRM profile. Add and update your webhooks and authentication for your CRM.',
      color: 'blue',
    },
  ];

  const getButtonColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      case 'red':
        return 'bg-red-500 hover:bg-red-600';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'yellow':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <DashboardLayout title="Workspace" subtitle="Manage your workspace settings">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaceCards.map((card) => (
          <Card key={card.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <CardDescription className="text-gray-400 text-xs mt-1">
                {card.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button
                className={`w-full ${getButtonColor(card.color)} text-white font-medium`}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
