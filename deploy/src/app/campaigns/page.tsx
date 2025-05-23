'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Search, Filter, Plus, MoreHorizontal, ChevronRight, Clock, Calendar, Users, BarChart3, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendBulkSMSSafe } from '@/lib/twilio';
import { createCampaignSafe, runCampaignSafe } from '@/lib/campaign';

// Mock campaigns data
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
    tags: ['new-leads', 'may-2023']
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
    tags: ['follow-up', 'april-2023']
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
    tags: ['re-engagement', 'march-2023']
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
    tags: ['new-product', 'february-2023']
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
    tags: ['welcome', 'january-2023']
  }
];

// Status badge color mapping
const statusColorMap = {
  active: 'bg-green-500',
  completed: 'bg-blue-500',
  paused: 'bg-yellow-500',
  draft: 'bg-gray-500'
};

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    template: '',
    phonePool: [],
    tags: []
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(campaign => {
    if (!searchTerm) return true;
    return (
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.template) {
      toast({
        title: "Missing information",
        description: "Please provide a campaign name and message template",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Prepare the campaign data
      const campaignData = {
        name: newCampaign.name,
        status: 'draft',
        channels: 0,
        responseCount: 0,
        responseRate: '0%',
        lastRun: 'Not run yet',
        createdAt: new Date().toISOString().split('T')[0],
        owner: 'Current User',
        template: newCampaign.template,
        phonePool: [],
        tags: newCampaign.tags.length > 0 ? newCampaign.tags.split(',').map(tag => tag.trim()) : [],
        description: '',
        audience: 'Not set',
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
          { date: new Date().toISOString(), action: 'campaign_created', user: 'Current User' }
        ],
        responses: []
      };

      // Call the API to create the campaign
      const result = await createCampaignSafe(campaignData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create campaign');
      }

      // For our mock implementation, we need to update the local state
      // In a real app with a database, we would just fetch the updated data
      const createdCampaign = result.campaign || {
        ...campaignData,
        id: Math.max(...campaigns.map(c => c.id)) + 1,
      };

      setCampaigns([createdCampaign, ...campaigns]);

      // Close the dialog and reset form
      setIsCreateDialogOpen(false);
      setNewCampaign({
        name: '',
        template: '',
        phonePool: [],
        tags: []
      });

      toast({
        title: "Campaign created",
        description: `Campaign "${createdCampaign.name}" has been created as a draft`,
      });

      // Redirect to the new campaign
      router.push(`/campaigns/${createdCampaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Failed to create campaign",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Handle running a campaign
  const handleRunCampaign = async () => {
    if (!selectedCampaign) return;

    setIsRunning(true);

    try {
      // Call the API to run the campaign
      const result = await runCampaignSafe(selectedCampaign.id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to run campaign');
      }

      // Update the campaign status in our local state
      const updatedCampaigns = campaigns.map(campaign => {
        if (campaign.id === selectedCampaign.id) {
          return {
            ...campaign,
            status: 'active',
            lastRun: new Date().toISOString().split('T')[0]
          };
        }
        return campaign;
      });

      setCampaigns(updatedCampaigns);
      setIsRunDialogOpen(false);
      setSelectedCampaign(null);

      toast({
        title: "Campaign started",
        description: `Sending to ${result.result?.sending?.total || 0} recipients (${result.result?.sending?.sent || 0} sent, ${result.result?.sending?.failed || 0} failed)`,
      });
    } catch (error) {
      console.error('Error running campaign:', error);
      toast({
        title: "Failed to run campaign",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <DashboardLayout title="Campaigns">
      <div className="p-4">
        {/* Header with search and actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search campaigns..."
              className="pl-8 bg-[#2a2d36] border-[#3d4051]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-[#3d4051] text-[#8c8e96] hover:bg-[#2a2d36]">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Campaign stats cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#232530] border-[#2c2e3a]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#8c8e96]">Total Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-gray-400 mt-1">
                {campaigns.filter(c => c.status === 'active').length} active
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaigns.reduce((sum, c) => sum + c.channels, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-400 mt-1">Across all campaigns</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaigns.reduce((sum, c) => sum + c.responseCount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {(campaigns.reduce((sum, c) => sum + c.responseCount, 0) / campaigns.reduce((sum, c) => sum + c.channels, 0) * 100).toFixed(2)}% response rate
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Last Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                {campaigns.sort((a, b) => new Date(b.lastRun) - new Date(a.lastRun))[0]?.name || 'None'}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {campaigns.sort((a, b) => new Date(b.lastRun) - new Date(a.lastRun))[0]?.lastRun || 'No campaigns run yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns table */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>
              Manage your SMS campaigns and view their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Channels</TableHead>
                  <TableHead className="text-gray-400">Responses</TableHead>
                  <TableHead className="text-gray-400">Response Rate</TableHead>
                  <TableHead className="text-gray-400">Last Run</TableHead>
                  <TableHead className="text-gray-400">Created</TableHead>
                  <TableHead className="text-gray-400">Owner</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map(campaign => (
                    <TableRow key={campaign.id} className="border-gray-800">
                      <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium text-white hover:text-blue-400"
                          onClick={() => router.push(`/campaigns/${campaign.id}`)}
                        >
                          {campaign.name}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColorMap[campaign.status]} text-white`}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.channels.toLocaleString()}</TableCell>
                      <TableCell>{campaign.responseCount.toLocaleString()}</TableCell>
                      <TableCell>{campaign.responseRate}</TableCell>
                      <TableCell>{campaign.lastRun}</TableCell>
                      <TableCell>{campaign.createdAt}</TableCell>
                      <TableCell>{campaign.owner}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setIsRunDialogOpen(true);
                            }}
                            disabled={campaign.status === 'completed' || campaign.status === 'active'}
                          >
                            <Play campaign={campaign} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => router.push(`/campaigns/${campaign.id}`)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                      {searchTerm ? 'No campaigns match your search' : 'No campaigns found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Campaign</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Campaign Name</label>
              <Input
                placeholder="Enter campaign name"
                className="bg-gray-800 border-gray-700"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Message Template</label>
              <Textarea
                placeholder="Enter message template"
                className="h-24 bg-gray-800 border-gray-700"
                value={newCampaign.template}
                onChange={(e) => setNewCampaign({ ...newCampaign, template: e.target.value })}
              />
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>Characters: {newCampaign.template.length}</span>
                <span>Segments: {Math.ceil(newCampaign.template.length / 160)}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tags (comma separated)</label>
              <Input
                placeholder="e.g. new-leads, follow-up"
                className="bg-gray-800 border-gray-700"
                value={newCampaign.tags}
                onChange={(e) => setNewCampaign({ ...newCampaign, tags: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="save-as-template" />
              <label htmlFor="save-as-template" className="text-sm">Save as reusable template</label>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                className="border-gray-600"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleCreateCampaign}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Run Campaign Dialog */}
      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Run Campaign</DialogTitle>
          </DialogHeader>

          {selectedCampaign && (
            <div className="mt-4 space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium text-lg">{selectedCampaign.name}</h3>
                <div className="mt-2 text-sm text-gray-300">
                  <p className="mb-2">Template:</p>
                  <div className="bg-gray-700 p-3 rounded">{selectedCampaign.template}</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Channels:</p>
                    <p>{selectedCampaign.channels.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Created:</p>
                    <p>{selectedCampaign.createdAt}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">Confirmation</label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="confirm-run" />
                  <label htmlFor="confirm-run" className="text-sm">
                    I confirm that I want to run this campaign and send messages to {selectedCampaign.channels} channels
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
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// Play button component based on campaign status
function Play({ campaign }) {
  if (campaign.status === 'completed') {
    return <CheckCircle className="h-4 w-4 text-gray-400" />;
  } else if (campaign.status === 'active') {
    return <Pause className="h-4 w-4 text-blue-400" />;
  } else if (campaign.status === 'draft' || campaign.status === 'paused') {
    return <PlayButton className="h-4 w-4 text-green-400" />;
  }
  return <PlayButton className="h-4 w-4" />;
}

// Missing component definitions
function CheckCircle(props) {
  return <div {...props}>✓</div>;
}

function Pause(props) {
  return <div {...props}>⏸️</div>;
}

function PlayButton(props) {
  return <div {...props}>▶️</div>;
}
