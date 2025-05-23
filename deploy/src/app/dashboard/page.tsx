'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';

// Mock data for the message status history chart
const messageStatusData = [
  { name: 'Thu May 16', delivered: 0, responded: 3, undelivered: 0, stop: 3, spam: 0 },
  { name: 'Fri May 17', delivered: 0, responded: 0, undelivered: 0, stop: 0, spam: 0 },
  { name: 'Sat May 18', delivered: 0, responded: 0, undelivered: 0, stop: 0, spam: 0 },
  { name: 'Sun May 19', delivered: 0, responded: 0, undelivered: 0, stop: 0, spam: 0 },
  { name: 'Mon May 20', delivered: 0, responded: 4, undelivered: 0, stop: 0, spam: 0 },
  { name: 'Tue May 21', delivered: 0, responded: 0, undelivered: 0, stop: 3, spam: 0 },
  { name: 'Wed May 22', delivered: 0, responded: 6, undelivered: 0, stop: 9, spam: 0 },
];

// Mock data for users
const users = [
  { id: 'br', name: 'billy roth', userId: '#4942', role: 'admin' },
  { id: 'bm', name: 'barry meneke', userId: '#5056', role: 'user' },
];

// Mock data for flags
const flags = [
  { id: 1, name: 'Confirm rev', count: 48, color: 'bg-red-500' },
  { id: 2, name: 'Good Number for app', count: 63, color: 'bg-blue-500' },
  { id: 3, name: 'app sent', count: 200, color: 'bg-yellow-500' },
  { id: 4, name: 'app completed', count: 17, color: 'bg-green-500' },
];

// Mock data for recent campaigns
const recentCampaigns = [
  {
    id: 1,
    name: 'test',
    type: 'Single blast',
    timeSent: '4/25/2025 at 9:16 AM',
    queued: 0,
    sent: 0,
    delivered: 0,
    undelivered: 0,
    response: 0,
    failed: 0,
    stop: 0,
    message: 'Hello'
  },
  {
    id: 2,
    name: 'name response legit',
    type: 'Single blast',
    timeSent: '4/23/2025 at 11:40 AM',
    queued: 900,
    sent: 900,
    delivered: 0,
    undelivered: 0,
    response: 3,
    failed: 0,
    stop: 1,
    message: 'Hi {first_name}, This is Billy with Majestic Funding. Please complete application: bit.ly/secure-application — billy.roth Reply STOP to stop'
  }
];

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard Home">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Message Status History */}
        <Card className="col-span-1 md:col-span-2 bg-[#232530] border-[#2c2e3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">MESSAGE STATUS HISTORY</CardTitle>
            <p className="text-sm text-[#8c8e96]">Track your message status history over the last 10 days</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={messageStatusData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="delivered" stackId="a" fill="#00C853" />
                  <Bar dataKey="responded" stackId="a" fill="#FF4081" />
                  <Bar dataKey="undelivered" stackId="a" fill="#FFC107" />
                  <Bar dataKey="stop" stackId="a" fill="#a855f7" />
                  <Bar dataKey="spam" stackId="a" fill="#9C27B0" />
                </ComposedChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-600 mr-1"></div>
                  <span>0 Delivered Messages</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-pink-500 mr-1"></div>
                  <span>13 Responded Messages</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>0 Undelivered Messages</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                  <span>15 Stop</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                  <span>0 Spam</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Heatmap */}
        <Card className="bg-[#232530] border-[#2c2e3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">MESSAGE HEATMAP</CardTitle>
            <p className="text-sm text-[#8c8e96]">Check out the states with the most messages</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <div className="text-center">
                <div className="h-48 bg-gray-800 rounded-md flex items-center justify-center">
                  <p className="text-gray-400">USA Message Heatmap</p>
                </div>
                <p className="text-sm text-gray-400 mt-4">Visualization of message distribution across the United States</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Section */}
        <Card className="bg-[#232530] border-[#2c2e3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">USERS</CardTitle>
            <p className="text-sm text-[#8c8e96]">Here is where you can see your users activity</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 pb-3 border-b border-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                    {user.id}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-400">
                      User ID: {user.userId} {' '}
                      <span className={user.role === 'admin' ? 'text-yellow-500' : 'text-blue-500'}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flags Section */}
        <Card className="bg-[#232530] border-[#2c2e3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">FLAGS</CardTitle>
            <p className="text-sm text-[#8c8e96]">Here are all the current workspace flags in use</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flags.map((flag) => (
                <div key={flag.id} className="flex items-center gap-3 pb-3 border-b border-gray-800">
                  <div className={`h-6 w-6 rounded-full ${flag.color}`}></div>
                  <div>
                    <div className="text-sm font-medium">{flag.name}</div>
                    <div className="text-xs text-gray-400">{flag.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <Card className="col-span-1 md:col-span-2 bg-[#232530] border-[#2c2e3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">YOUR MOST RECENT CAMPAIGNS</CardTitle>
            <p className="text-sm text-[#8c8e96]">These are your most recent sent campaigns</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">NAME</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">TYPE</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">TIME SENT</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">QUEUED</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">SENT</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">DELIVERED</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">UNDELIVERED</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">RESPONSE</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">FAILED</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">STOP</th>
                    <th className="py-3 px-2 text-xs font-medium text-gray-400">MESSAGE</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-gray-800">
                      <td className="py-3 px-2 text-sm text-blue-500">{campaign.name}</td>
                      <td className="py-3 px-2 text-sm">{campaign.type}</td>
                      <td className="py-3 px-2 text-sm">{campaign.timeSent}</td>
                      <td className="py-3 px-2 text-sm">{campaign.queued}</td>
                      <td className="py-3 px-2 text-sm">{campaign.sent}</td>
                      <td className="py-3 px-2 text-sm">{campaign.delivered}</td>
                      <td className="py-3 px-2 text-sm">{campaign.undelivered}</td>
                      <td className="py-3 px-2 text-sm">{campaign.response}</td>
                      <td className="py-3 px-2 text-sm">{campaign.failed}</td>
                      <td className="py-3 px-2 text-sm">{campaign.stop}</td>
                      <td className="py-3 px-2 text-sm truncate max-w-[200px]">{campaign.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
