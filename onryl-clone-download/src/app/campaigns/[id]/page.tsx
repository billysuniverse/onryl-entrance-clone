'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { sendBulkSMSSafe } from '@/lib/twilio';
import { getCampaignSafe, updateCampaignSafe, runCampaignSafe, deleteCampaignSafe } from '@/lib/campaign';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Edit,
  ExternalLink,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Trash,
  Users
} from 'lucide-react';

// Mock campaigns data (same as in the campaigns list page)
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
    tags: ['new-leads', 'may-2023'],
    description: 'Morning reminder for new leads in May 2023.',
    audience: 'New May 2023 leads',
    schedule: {
      type: 'one-time',
      time: '2023-05-15T09:00:00Z',
      timezone: 'America/New_York'
    },
    statistics: {
      delivered: 1230,
      failed: 20,
      responded: 32,
      responseRate: '2.56%',
      optOut: 5,
      optOutRate: '0.4%'
    },
    history: [
      { date: '2023-05-15T09:00:00Z', action: 'campaign_started', user: 'John Doe' },
      { date: '2023-05-15T09:05:12Z', action: 'sent_batch', count: 500 },
      { date: '2023-05-15T09:08:45Z', action: 'sent_batch', count: 500 },
      { date: '2023-05-15T09:12:18Z', action: 'sent_batch', count: 250 },
      { date: '2023-05-15T09:15:00Z', action: 'campaign_completed' }
    ],
    responses: [
      {
        id: 'resp1',
        phone: '+15551234567',
        body: 'Yes, I need information about rates',
        timestamp: '2023-05-15T10:23:45Z',
        status: 'unread'
      },
      {
        id: 'resp2',
        phone: '+15552345678',
        body: 'Please call me back',
        timestamp: '2023-05-15T11:05:12Z',
        status: 'read'
      },
      {
        id: 'resp3',
        phone: '+15553456789',
        body: 'STOP',
        timestamp: '2023-05-15T09:45:22Z',
        status: 'opted_out'
      },
    ]
  },
  {
    id: 2,
    name: 'April Follow-ups',
    status: 'completed',
    channels: 890,
    responseCount: 103,
    responseRate: '11.57%',
    lastRun: '2023-04-20',
    createdAt: '2023-04-05',
    owner: 'Jane Smith',
    template: 'Hi there, checking in on your application. Do you need any assistance?',
    phonePool: ['+12025550144', '+12025550145', '+12025550146'],
    tags: ['follow-up', 'april-2023'],
    description: 'Following up with leads who started applications in April.',
    audience: 'April incomplete applications',
    schedule: {
      type: 'one-time',
      time: '2023-04-20T10:00:00Z',
      timezone: 'America/New_York'
    },
    statistics: {
      delivered: 875,
      failed: 15,
      responded: 103,
      responseRate: '11.57%',
      optOut: 12,
      optOutRate: '1.35%'
    },
    history: [
      { date: '2023-04-20T10:00:00Z', action: 'campaign_started', user: 'Jane Smith' },
      { date: '2023-04-20T10:03:22Z', action: 'sent_batch', count: 500 },
      { date: '2023-04-20T10:07:45Z', action: 'sent_batch', count: 390 },
      { date: '2023-04-20T10:10:18Z', action: 'campaign_completed' }
    ],
    responses: []
  },
  {
    id: 3,
    name: 'March Re-engagement',
    status: 'paused',
    channels: 1780,
    responseCount: 215,
    responseRate: '12.08%',
    lastRun: '2023-03-25',
    createdAt: '2023-03-10',
    owner: 'Mike Johnson',
    template: 'We noticed you didn\'t complete your application. Need help? Reply YES to get assistance.',
    phonePool: ['+12025550147', '+12025550148'],
    tags: ['re-engagement', 'march-2023'],
    description: 'Re-engaging with leads who abandoned their applications.',
    audience: 'March abandoned applications',
    schedule: {
      type: 'one-time',
      time: '2023-03-25T14:00:00Z',
      timezone: 'America/New_York'
    },
    statistics: {
      delivered: 1750,
      failed: 30,
      responded: 215,
      responseRate: '12.08%',
      optOut: 18,
      optOutRate: '1.01%'
    },
    history: [
      { date: '2023-03-25T14:00:00Z', action: 'campaign_started', user: 'Mike Johnson' },
      { date: '2023-03-25T14:05:12Z', action: 'sent_batch', count: 500 },
      { date: '2023-03-25T14:10:45Z', action: 'sent_batch', count: 500 },
      { date: '2023-03-25T14:15:18Z', action: 'sent_batch', count: 500 },
      { date: '2023-03-25T14:20:00Z', action: 'sent_batch', count: 280 },
      { date: '2023-03-25T14:25:33Z', action: 'campaign_paused', user: 'Mike Johnson' }
    ],
    responses: []
  },
  {
    id: 4,
    name: 'February New Product',
    status: 'draft',
    channels: 0,
    responseCount: 0,
    responseRate: '0%',
    lastRun: 'Not run yet',
    createdAt: '2023-02-15',
    owner: 'Sarah Wilson',
    template: 'We\'ve launched a new product that might interest you! Reply INFO to learn more.',
    phonePool: [],
    tags: ['new-product', 'february-2023'],
    description: 'Announcing new product features to existing customers.',
    audience: 'Existing customers',
    schedule: {
      type: 'not_scheduled',
      time: null,
      timezone: 'America/New_York'
    },
    statistics: {
      delivered: 0,
      failed: 0,
      responded: 0,
      responseRate: '0%',
      optOut: 0,
      optOutRate: '0%'
    },
    history: [
      { date: '2023-02-15T11:45:00Z', action: 'campaign_created', user: 'Sarah Wilson' },
    ],
    responses: []
  },
  {
    id: 5,
    name: 'January Welcome',
    status: 'completed',
    channels: 2500,
    responseCount: 304,
    responseRate: '12.16%',
    lastRun: '2023-01-20',
    createdAt: '2023-01-05',
    owner: 'Robert Brown',
    template: 'Welcome to our service! We\'re excited to have you onboard. Reply HELP if you need assistance.',
    phonePool: ['+12025550149', '+12025550150'],
    tags: ['welcome', 'january-2023'],
    description: 'Welcome message for new January customers.',
    audience: 'New January customers',
    schedule: {
      type: 'one-time',
      time: '2023-01-20T09:00:00Z',
      timezone: 'America/New_York'
    },
    statistics: {
      delivered: 2450,
      failed: 50,
      responded: 304,
      responseRate: '12.16%',
      optOut: 22,
      optOutRate: '0.88%'
    },
    history: [
      { date: '2023-01-20T09:00:00Z', action: 'campaign_started', user: 'Robert Brown' },
      { date: '2023-01-20T09:05:12Z', action: 'sent_batch', count: 500 },
      { date: '2023-01-20T09:10:45Z', action: 'sent_batch', count: 500 },
      { date: '2023-01-20T09:15:18Z', action: 'sent_batch', count: 500 },
      { date: '2023-01-20T09:20:00Z', action: 'sent_batch', count: 500 },
      { date: '2023-01-20T09:25:33Z', action: 'sent_batch', count: 500 },
      { date: '2023-01-20T09:30:00Z', action: 'campaign_completed' }
    ],
    responses: []
  }
];

// Status badge color mapping
const statusColorMap: {[key: string]: string} = {
  active: 'bg-green-500',
  completed: 'bg-blue-500',
  paused: 'bg-yellow-500',
  draft: 'bg-gray-500'
};

// History action icon mapping
const actionIconMap = {
  campaign_started: <Play className="h-4 w-4 text-green-500" />,
  campaign_completed: <CheckCircle className="h-4 w-4 text-blue-500" />,
  campaign_paused: <Pause className="h-4 w-4 text-yellow-500" />,
  campaign_created: <Plus className="h-4 w-4 text-gray-500" />,
  sent_batch: <MessageSquare className="h-4 w-4 text-purple-500" />
};

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const campaignId = Number(params.id);

  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch campaign data
  useEffect(() => {
    // In a real app, this would be an API call
    const foundCampaign = mockCampaigns.find(c => c.id === campaignId);

    if (foundCampaign) {
      setCampaign(foundCampaign);
      setEditedCampaign({...foundCampaign});
    } else {
      toast({
        title: "Campaign not found",
        description: "The requested campaign could not be found",
        variant: "destructive",
      });
      router.push('/campaigns');
    }

    setIsLoading(false);
  }, [campaignId, router, toast]);

  // Handle saving edited campaign
  const handleSaveCampaign = async () => {
    if (!editedCampaign.name || !editedCampaign.template) {
      toast({
        title: "Missing information",
        description: "Please provide a campaign name and message template",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the API to update the campaign
      const result = await updateCampaignSafe(campaignId, editedCampaign);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save campaign');
      }

      // Update the local state with the saved campaign
      setCampaign(editedCampaign);
      setIsEditing(false);

      toast({
        title: "Campaign saved",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle running campaign
  const handleRunCampaign = async () => {
    setIsRunning(true);

    try {
      // Call the API to run the campaign
      const response = await fetch('/api/campaigns/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: campaign.id
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to run campaign');
      }

      // Update the campaign with the new status
      const now = new Date().toISOString();
      const updatedCampaign = {
        ...campaign,
        status: 'active',
        lastRun: new Date().toISOString().split('T')[0],
        history: [
          {
            date: now,
            action: 'campaign_started',
            user: 'Current User',
            details: `Sending to ${result.sending?.total || 'unknown'} recipients`
          },
          ...campaign.history
        ]
      };

      setCampaign(updatedCampaign);
      setEditedCampaign(updatedCampaign);
      setIsRunDialogOpen(false);

      toast({
        title: "Campaign started",
        description: `Sending to ${result.sending?.total || 0} recipients (${result.sending?.sent || 0} sent, ${result.sending?.failed || 0} failed)`,
      });
    } catch (error) {
      console.error('Error running campaign:', error);
      toast({
        title: "Failed to run campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Handle pausing campaign
  const handlePauseCampaign = async () => {
    try {
      // Create the updated campaign with paused status
      const now = new Date().toISOString();
      const updatedCampaign = {
        ...campaign,
        status: 'paused',
        history: [
          { date: now, action: 'campaign_paused', user: 'Current User' },
          ...campaign.history
        ]
      };

      // Call the API to update the campaign
      const result = await updateCampaignSafe(campaignId, {
        status: 'paused',
        history: updatedCampaign.history
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to pause campaign');
      }

      // Update local state
      setCampaign(updatedCampaign);
      setEditedCampaign(updatedCampaign);

      toast({
        title: "Campaign paused",
        description: "The campaign has been paused successfully",
      });
    } catch (error) {
      console.error('Error pausing campaign:', error);
      toast({
        title: "Failed to pause campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle deleting campaign
  const handleDeleteCampaign = async () => {
    setIsDeleting(true);

    try {
      // Call the API to delete the campaign
      const result = await deleteCampaignSafe(campaignId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete campaign');
      }

      toast({
        title: "Campaign deleted",
        description: "The campaign has been deleted successfully",
      });

      // Navigate back to campaigns list
      router.push('/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Failed to delete campaign",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Campaign Details">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout title="Campaign Details">
        <div className="p-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6 text-center">
              <p>Campaign not found. The requested campaign may have been deleted.</p>
              <Button
                className="mt-4"
                onClick={() => router.push('/campaigns')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Campaigns
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Campaign: ${campaign.name}`}>
      <div className="p-4">
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => router.push('/campaigns')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">
              {campaign.name}
            </h1>
            <Badge className={`ml-3 ${statusColorMap[campaign.status]} text-white`}>
              {campaign.status}
            </Badge>
          </div>
          <div className="flex space-x-2">
            {campaign.status === 'active' ? (
              <Button
                variant="outline"
                className="border-gray-600"
                onClick={handlePauseCampaign}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : campaign.status !== 'completed' ? (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsRunDialogOpen(true)}
              >
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
            ) : null}

            {!isEditing ? (
              <Button
                variant="outline"
                className="border-gray-600"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSaveCampaign}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}

            <Button
              variant="outline"
              className="border-gray-600 text-red-500 hover:text-red-400"
              onClick={handleDeleteCampaign}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Campaign statistics cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaign.channels.toLocaleString()}</div>
              <p className="text-xs text-gray-400 mt-1">Recipients</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaign.statistics.delivered.toLocaleString()}</div>
              <p className="text-xs text-gray-400 mt-1">
                {campaign.channels > 0 ?
                  `${((campaign.statistics.delivered / campaign.channels) * 100).toFixed(1)}%` :
                  '0%'} delivery rate
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaign.statistics.responded.toLocaleString()}</div>
              <p className="text-xs text-gray-400 mt-1">{campaign.statistics.responseRate} response rate</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Opt-outs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaign.statistics.optOut.toLocaleString()}</div>
              <p className="text-xs text-gray-400 mt-1">{campaign.statistics.optOutRate} opt-out rate</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Last Run</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaign.lastRun}</div>
              <p className="text-xs text-gray-400 mt-1">Created on {campaign.createdAt}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messages">Message Template</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-900 border-gray-800 md:col-span-2">
                <CardHeader>
                  <CardTitle>Campaign Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Campaign Name</label>
                        <Input
                          value={editedCampaign.name}
                          onChange={(e) => setEditedCampaign({...editedCampaign, name: e.target.value})}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <Textarea
                          value={editedCampaign.description}
                          onChange={(e) => setEditedCampaign({...editedCampaign, description: e.target.value})}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Tags (comma separated)</label>
                        <Input
                          value={editedCampaign.tags.join(', ')}
                          onChange={(e) => setEditedCampaign({
                            ...editedCampaign,
                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                          })}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Description</h3>
                        <p className="mt-1">{campaign.description}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Tags</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {campaign.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="border-gray-700">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Created By</h3>
                        <p className="mt-1">{campaign.owner} on {campaign.createdAt}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Schedule Type</label>
                        <select
                          value={editedCampaign.schedule.type}
                          onChange={(e) => setEditedCampaign({
                            ...editedCampaign,
                            schedule: {...editedCampaign.schedule, type: e.target.value}
                          })}
                          className="w-full rounded-md bg-gray-800 border-gray-700 p-2"
                        >
                          <option value="one-time">One-time Send</option>
                          <option value="recurring">Recurring</option>
                          <option value="not_scheduled">Not Scheduled</option>
                        </select>
                      </div>
                      {editedCampaign.schedule.type !== 'not_scheduled' && (
                        <div>
                          <label className="text-sm font-medium mb-1 block">Date & Time</label>
                          <Input
                            type="datetime-local"
                            value={editedCampaign.schedule.time ? new Date(editedCampaign.schedule.time).toISOString().slice(0, 16) : ''}
                            onChange={(e) => setEditedCampaign({
                              ...editedCampaign,
                              schedule: {...editedCampaign.schedule, time: e.target.value}
                            })}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium mb-1 block">Timezone</label>
                        <select
                          value={editedCampaign.schedule.timezone}
                          onChange={(e) => setEditedCampaign({
                            ...editedCampaign,
                            schedule: {...editedCampaign.schedule, timezone: e.target.value}
                          })}
                          className="w-full rounded-md bg-gray-800 border-gray-700 p-2"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium">Send Date</h3>
                          <p className="text-sm text-gray-400">
                            {campaign.schedule.type === 'not_scheduled' ?
                              'Not scheduled' :
                              new Date(campaign.schedule.time).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium">Send Time</h3>
                          <p className="text-sm text-gray-400">
                            {campaign.schedule.type === 'not_scheduled' ?
                              'Not scheduled' :
                              new Date(campaign.schedule.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <RefreshCw className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium">Type</h3>
                          <p className="text-sm text-gray-400">
                            {campaign.schedule.type === 'one-time' ? 'One-time send' :
                             campaign.schedule.type === 'recurring' ? 'Recurring' : 'Not scheduled'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Message Template tab */}
          <TabsContent value="messages" className="mt-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Message Template</CardTitle>
                <CardDescription>
                  The message that will be sent to all recipients in this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      className="h-40 bg-gray-800 border-gray-700"
                      placeholder="Enter your message template"
                      value={editedCampaign.template}
                      onChange={(e) => setEditedCampaign({...editedCampaign, template: e.target.value})}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Characters: {editedCampaign.template.length}</span>
                      <span>Segments: {Math.ceil(editedCampaign.template.length / 160)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                      {campaign.template}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Characters: {campaign.template.length}</span>
                      <span>Segments: {Math.ceil(campaign.template.length / 160)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4">
                <div className="w-full">
                  <h3 className="text-sm font-medium mb-2">Phone Numbers in Pool</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.phonePool.length > 0 ? (
                      campaign.phonePool.map((phone: string) => (
                        <Badge key={phone} className="bg-gray-800 text-gray-300">
                          <Phone className="h-3 w-3 mr-1" />
                          {phone}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No phone numbers assigned to this campaign</p>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Audience tab */}
          <TabsContent value="audience" className="mt-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Audience</CardTitle>
                <CardDescription>
                  Recipients for this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Audience Name</label>
                      <Input
                        value={editedCampaign.audience}
                        onChange={(e) => setEditedCampaign({...editedCampaign, audience: e.target.value})}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Number of Recipients</label>
                      <Input
                        type="number"
                        value={editedCampaign.channels}
                        onChange={(e) => setEditedCampaign({
                          ...editedCampaign,
                          channels: Number.parseInt(e.target.value) || 0
                        })}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium">Audience</h3>
                        <p className="text-sm text-gray-400">{campaign.audience}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium">Recipients</h3>
                        <p className="text-sm text-gray-400">{campaign.channels.toLocaleString()} phone numbers</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {!isEditing && (
                  <Button variant="outline" className="border-gray-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage Recipients
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Responses tab */}
          <TabsContent value="responses" className="mt-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Campaign Responses</CardTitle>
                <CardDescription>
                  Replies received from campaign recipients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">Phone Number</TableHead>
                      <TableHead className="text-gray-400">Message</TableHead>
                      <TableHead className="text-gray-400">Time</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.responses && campaign.responses.length > 0 ? (
                      campaign.responses.map((response: any) => (
                        <TableRow key={response.id} className="border-gray-800">
                          <TableCell>{response.phone}</TableCell>
                          <TableCell className="max-w-md truncate">{response.body}</TableCell>
                          <TableCell>{new Date(response.timestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={
                              response.status === 'unread' ? 'bg-blue-500 text-white' :
                              response.status === 'opted_out' ? 'bg-red-500 text-white' :
                              'bg-green-500 text-white'
                            }>
                              {response.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                          No responses received for this campaign yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History tab */}
          <TabsContent value="history" className="mt-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Campaign History</CardTitle>
                <CardDescription>
                  Timeline of campaign events and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.history.map((event: any, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="rounded-full p-1 bg-gray-800">
                          {actionIconMap[event.action] || <div className="h-4 w-4" />}
                        </div>
                        {index < campaign.history.length - 1 && (
                          <div className="w-px h-full bg-gray-800 my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center">
                          <p className="font-medium">
                            {event.action === 'campaign_started' ? 'Campaign Started' :
                            event.action === 'campaign_completed' ? 'Campaign Completed' :
                            event.action === 'campaign_paused' ? 'Campaign Paused' :
                            event.action === 'campaign_created' ? 'Campaign Created' :
                            event.action === 'sent_batch' ? `Sent ${event.count} Messages` :
                            event.action}
                          </p>
                          {event.user && (
                            <span className="ml-2 text-sm text-gray-400">by {event.user}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(event.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings tab */}
          <TabsContent value="settings" className="mt-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Campaign Settings</CardTitle>
                <CardDescription>
                  Advanced settings for this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isEditing ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Phone Number Pool</h3>
                        <Textarea
                          className="h-24 bg-gray-800 border-gray-700"
                          placeholder="Add phone numbers, one per line"
                          value={editedCampaign.phonePool.join('\n')}
                          onChange={(e) => setEditedCampaign({
                            ...editedCampaign,
                            phonePool: e.target.value.split('\n').map(phone => phone.trim()).filter(phone => phone)
                          })}
                        />
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Scheduling Options</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox id="respect-quiet-hours" defaultChecked />
                          <label htmlFor="respect-quiet-hours" className="text-sm">
                            Respect quiet hours (10pm - 9am recipient local time)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox id="optimize-send-time" />
                          <label htmlFor="optimize-send-time" className="text-sm">
                            Optimize send time for each recipient
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Message Options</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox id="include-opt-out" defaultChecked />
                          <label htmlFor="include-opt-out" className="text-sm">
                            Include opt-out instructions
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox id="track-clicks" defaultChecked />
                          <label htmlFor="track-clicks" className="text-sm">
                            Track link clicks
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Phone Number Pool</h3>
                        <div className="flex flex-wrap gap-2">
                          {campaign.phonePool.length > 0 ? (
                            campaign.phonePool.map((phone: string) => (
                              <Badge key={phone} className="bg-gray-800 text-gray-300">
                                <Phone className="h-3 w-3 mr-1" />
                                {phone}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">No phone numbers assigned to this campaign</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Scheduling Options</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox id="respect-quiet-hours" defaultChecked disabled />
                          <label htmlFor="respect-quiet-hours" className="text-sm text-gray-400">
                            Respect quiet hours (10pm - 9am recipient local time)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox id="optimize-send-time" disabled />
                          <label htmlFor="optimize-send-time" className="text-sm text-gray-400">
                            Optimize send time for each recipient
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Message Options</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox id="include-opt-out" defaultChecked disabled />
                          <label htmlFor="include-opt-out" className="text-sm text-gray-400">
                            Include opt-out instructions
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox id="track-clicks" defaultChecked disabled />
                          <label htmlFor="track-clicks" className="text-sm text-gray-400">
                            Track link clicks
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
                    <div className="bg-red-950/20 border border-red-700/20 rounded-md p-3 mb-3">
                      <h4 className="text-sm font-medium text-red-400">Delete Campaign</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Once deleted, this campaign cannot be recovered.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-700 hover:bg-red-800"
                        onClick={handleDeleteCampaign}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="mr-2 h-4 w-4" />
                        )}
                        Delete Campaign
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Run Campaign Dialog */}
      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Run Campaign</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-lg">{campaign.name}</h3>
              <div className="mt-2 text-sm text-gray-300">
                <p className="mb-2">Template:</p>
                <div className="bg-gray-700 p-3 rounded">{campaign.template}</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Channels:</p>
                  <p>{campaign.channels.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Created:</p>
                  <p>{campaign.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Confirmation</label>
              <div className="flex items-center space-x-2">
                <Checkbox id="confirm-run" />
                <label htmlFor="confirm-run" className="text-sm">
                  I confirm that I want to run this campaign and send messages to {campaign.channels} channels
                </label>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 p-3 rounded-lg text-sm">
              <p className="text-yellow-500">
                <strong>Note:</strong> Running a campaign will send messages to all channels assigned to this campaign.
                This action cannot be undone once messages are sent.
              </p>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                className="border-gray-600"
                onClick={() => setIsRunDialogOpen(false)}
                disabled={isRunning}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleRunCampaign}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  "Run Campaign"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// Missing component definition
function CheckCircle(props) {
  return <div {...props}>✓</div>;
}
