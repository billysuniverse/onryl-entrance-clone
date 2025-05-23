import React, { useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, Play, Pause, Save, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  updateCampaignSafe,
  runCampaignSafe,
  deleteCampaignSafe
} from '@/lib/campaign';

export default function CampaignDetailLayout({ campaign, router }: any) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(campaign);
  const [tab, setTab] = useState('overview');

  const handleSave = async () => {
    const res = await updateCampaignSafe(campaign.id, edited);
    if (res.success) toast({ title: 'Saved' });
    else toast({ title: 'Error', variant: 'destructive' });
    setIsEditing(false);
  };

  return (
    <DashboardLayout title={`Campaign: ${campaign.name}`}>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.push('/campaigns')}>
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-semibold ml-4">{campaign.name}</h1>
          <Badge className="ml-2">{campaign.status}</Badge>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea value={edited.description} onChange={e => setEdited({ ...edited, description: e.target.value })} />
                ) : (
                  <p>{campaign.description}</p>
                )}
              </CardContent>
              <CardFooter>
                {isEditing ? (
                  <Button onClick={handleSave}>Save</Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          {/* Additional tabs... */}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
