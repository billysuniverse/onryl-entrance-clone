"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  UserCircle,
  MessageCircle,
  PhoneOutgoing,
  Calendar,
  Trash2
} from 'lucide-react';

export default function ClaimsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);

  // Mock data for incoming responses
  const responses = [
    {
      id: 'resp-1',
      phoneNumber: '+15551234567',
      message: "I'd like to learn more about your service.",
      campaign: 'Summer Promotion',
      status: 'unclaimed',
      receivedAt: '2023-06-15 09:32 AM',
      assignedTo: null,
    },
    {
      id: 'resp-2',
      phoneNumber: '+15552345678',
      message: 'Please send me pricing information.',
      campaign: 'Product Launch',
      status: 'claimed',
      receivedAt: '2023-06-15 10:15 AM',
      assignedTo: 'John Doe',
    },
    {
      id: 'resp-3',
      phoneNumber: '+15553456789',
      message: 'When will you have the new model in stock?',
      campaign: 'Summer Promotion',
      status: 'unclaimed',
      receivedAt: '2023-06-15 11:24 AM',
      assignedTo: null,
    },
    {
      id: 'resp-4',
      phoneNumber: '+15554567890',
      message: 'Can I schedule a demo next week?',
      campaign: 'Product Launch',
      status: 'claimed',
      receivedAt: '2023-06-14 02:45 PM',
      assignedTo: 'Jane Smith',
    },
    {
      id: 'resp-5',
      phoneNumber: '+15555678901',
      message: 'I have a question about my previous order.',
      campaign: 'Customer Support',
      status: 'completed',
      receivedAt: '2023-06-14 01:20 PM',
      assignedTo: 'John Doe',
    },
  ];

  // Status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'claimed':
        return <Badge className="bg-blue-500/20 text-blue-500"><UserCircle className="h-3 w-3 mr-1" /> Claimed</Badge>;
      case 'unclaimed':
        return <Badge className="bg-yellow-500/20 text-yellow-500"><Clock className="h-3 w-3 mr-1" /> Unclaimed</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">{status}</Badge>;
    }
  };

  const handleClaim = (responseId: string) => {
    setSelectedResponse(responseId);
    setShowClaimDialog(true);
  };

  return (
    <DashboardLayout title="Claims" subtitle="Manage incoming campaign responses">
      <div className="mb-6 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 w-1/3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search responses..."
                className="pl-8 bg-gray-900 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              All Responses
            </Button>
            <Button variant="outline" size="sm">
              My Claims
            </Button>
            <Button variant="outline" size="sm">
              Unclaimed
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unclaimed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">42</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">My Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">18</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">64</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Campaign Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id} className="border-gray-700">
                  <TableCell className="font-medium">{response.phoneNumber}</TableCell>
                  <TableCell className="max-w-xs truncate">{response.message}</TableCell>
                  <TableCell>{response.campaign}</TableCell>
                  <TableCell>{getStatusBadge(response.status)}</TableCell>
                  <TableCell>{response.receivedAt}</TableCell>
                  <TableCell>{response.assignedTo || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <PhoneOutgoing className="h-4 w-4" />
                      </Button>
                      {response.status === 'unclaimed' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClaim(response.id)}
                        >
                          Claim
                        </Button>
                      ) : response.status === 'claimed' && response.assignedTo === 'John Doe' ? (
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Claim Response</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              You're about to claim this response. You'll be responsible for following up with this contact.
            </p>

            <div className="space-y-4 bg-gray-900 p-4 rounded-md">
              {selectedResponse && (
                <div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>From: {responses.find(r => r.id === selectedResponse)?.phoneNumber}</span>
                    <span>{responses.find(r => r.id === selectedResponse)?.receivedAt}</span>
                  </div>
                  <div className="mt-2 p-3 bg-gray-800 rounded-md">
                    {responses.find(r => r.id === selectedResponse)?.message}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Set follow-up reminder</label>
                  <div className="flex mt-1">
                    <div className="relative">
                      <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input type="date" className="pl-8 bg-gray-900 border-gray-700" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Add notes</label>
                  <Input placeholder="Optional notes" className="mt-1 bg-gray-900 border-gray-700" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowClaimDialog(false)}>
              Claim Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
