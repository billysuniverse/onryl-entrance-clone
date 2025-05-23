'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { phoneNumberPool, sendSMSSafe, sendBulkSMSSafe } from '@/lib/twilio';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock conversation data
const mockConversations = [
  {
    id: 1,
    number: '+1 (850) 676-1562',
    contact: 'Michael Lamb',
    workspace: 'Workspace # +1 (332) 244-3107',
    flagged: true,
    stopped: false,
    messages: [
      {
        id: 1,
        direction: 'incoming',
        text: 'I am not Robin stop texting this number mf...',
        timestamp: '5/8/2023, 5:00 am',
        status: 'delivered'
      },
      {
        id: 2,
        direction: 'outgoing',
        text: 'Good morning! All apps submitted before 9 am are guaranteed to make this morning\'s 11 am wire.',
        timestamp: '4/15/2023, 7:32 am',
        status: 'delivered'
      },
      {
        id: 3,
        direction: 'outgoing',
        text: 'Good morning, it\'s Barry from MF Group...are you still in need of funding for the business? Reply YES if interested - Reply STOP to opt-out.',
        timestamp: '4/15/2023, 7:31 am',
        status: 'delivered'
      },
      {
        id: 4,
        direction: 'outgoing',
        text: 'As soon as I receive your file, I will begin underwriting it to see if any options are viable here.',
        timestamp: '4/15/2023, 10:30 am',
        status: 'delivered'
      },
      {
        id: 5,
        direction: 'outgoing',
        text: 'Hi there! I hope you\'re having a wonderful evening! Could you please finish the application I sent over? I\'d love to get some offers for you first thing in the morning. Thank you!',
        timestamp: '5/8/2023, 6:01 pm',
        status: 'delivered'
      },
      {
        id: 6,
        direction: 'outgoing',
        text: 'Sure!',
        timestamp: '5/8/2023, 8:22 pm',
        status: 'delivered'
      },
      {
        id: 7,
        direction: 'incoming',
        text: 'I am not Robin stop texting this number mother fucker 🔥',
        timestamp: '5/8/2023, 5:00 am',
        status: 'delivered'
      },
    ],
    meta: {
      src: 'AmericanBusinessFunding2',
      ulid: 'TIF51CF8-5F55-23A6-816E-B46C364D...',
      email: 'michael03111980@gmail.com',
      state: 'FL',
      lead_id: '803585',
      adsource: 8,
      language: 'English',
      last_name: 'Lamb',
      first_name: 'Michael',
      date_created: '1/5/2023 11:34',
      business_name: 'Michael\'s flooring and remodeling',
      time_in_business: '1-2 Years',
      monthly_gross_sales: '$15,000 - $25,000',
      best_time_to_contact: 'Afternoon',
      personal_credit_score: 'Very Poor (400-549)',
      requested_loan_amount: '$25,000 - $50,000'
    }
  }
];

// Static mock conversations with fixed phone numbers to avoid hydration errors
for (let i = 1; i <= 10; i++) {
  // Using deterministic phone numbers to avoid hydration errors
  const areaCode = 100 + (i * 71) % 900; // Generate stable area codes
  const prefix = 100 + (i * 37) % 900;
  const lineNum = 1000 + (i * 17) % 9000;
  const phoneNumber = `+1 (${areaCode}) ${prefix}-${lineNum}`;
  const name = ['Francis Adams', 'Emma Wilson', 'James Clark', 'Sarah Miller', 'David Brown', 'Jennifer Davis', 'Robert Johnson', 'Linda Wilson', 'Michael Thompson', 'Barbara Garcia'][i % 10];

  mockConversations.push({
    id: i + 1,
    number: phoneNumber,
    contact: name,
    workspace: 'Workspace # +1 (332) 244-3107',
    flagged: i % 3 === 0,
    stopped: i % 5 === 0,
    messages: [
      {
        id: 1,
        direction: 'outgoing',
        text: `Hey, it's Billy with Majestic Group, a direct business lender. Are you still looking for funding? Reply STOP to opt-out.`,
        timestamp: '5/2/2023, 9:55 am',
        status: 'delivered'
      }
    ],
    meta: {
      src: 'AmericanBusinessFunding2',
      ulid: `TIF51CF8-${i.toString().padStart(5, '0')}`,
      email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
      state: ['CA', 'TX', 'FL', 'NY', 'IL'][i % 5],
      lead_id: Math.floor(Math.random() * 900000) + 100000,
      adsource: Math.floor(Math.random() * 10) + 1,
      language: 'English',
      last_name: name.split(' ')[1],
      first_name: name.split(' ')[0],
      date_created: '1/5/2023 11:34',
      business_name: `${name.split(' ')[0]}'s ${['Auto Shop', 'Restaurant', 'Consulting', 'Plumbing', 'Retail Store', 'Construction', 'Marketing Agency', 'Tech Startup', 'Bakery', 'Law Firm'][i % 10]}`,
      time_in_business: ['<1 Year', '1-2 Years', '3-5 Years', '5+ Years'][i % 4],
      monthly_gross_sales: ['$5,000 - $10,000', '$10,000 - $15,000', '$15,000 - $25,000', '$25,000 - $50,000', '$50,000+'][i % 5],
      best_time_to_contact: ['Morning', 'Afternoon', 'Evening', 'Anytime'][i % 4],
      personal_credit_score: ['Excellent (720+)', 'Good (690-719)', 'Fair (630-689)', 'Poor (550-629)', 'Very Poor (400-549)'][i % 5],
      requested_loan_amount: ['$5,000 - $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000 - $100,000', '$100,000+'][i % 5]
    }
  });
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState(mockConversations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBlastMessageOpen, setIsBlastMessageOpen] = useState(false);
  const [blastNumbers, setBlastNumbers] = useState('');
  const [blastMessage, setBlastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('numbers');
  const [safeMode, setSafeMode] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isBlastSending, setIsBlastSending] = useState(false);
  const { toast } = useToast();

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    return (
      conv.number.includes(searchTerm) ||
      conv.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    setIsSending(true);

    // Create the new message with an initial "sending" status
    const newMessage = {
      id: selectedConversation.messages.length + 1,
      direction: 'outgoing',
      text: messageText,
      timestamp: new Date().toLocaleString(),
      status: 'sending'
    };

    // Optimistically update the UI
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id));
    setMessageText('');

    try {
      // Send the message using our Twilio utility
      const result = await sendSMSSafe(
        selectedConversation.number.replace(/\D/g, ''), // Remove non-digit characters from phone number
        messageText
      );

      if (result.success) {
        // Update the message status to reflect the actual result
        const finalUpdatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            const updatedMessages = conv.messages.map(msg => {
              if (msg.id === newMessage.id) {
                return {
                  ...msg,
                  status: result.status,
                  messageId: result.messageId,
                  from: result.from
                };
              }
              return msg;
            });

            return {
              ...conv,
              messages: updatedMessages
            };
          }
          return conv;
        });

        setConversations(finalUpdatedConversations);
        setSelectedConversation(finalUpdatedConversations.find(c => c.id === selectedConversation.id));

        toast({
          title: "Message sent",
          description: `Message sent to ${selectedConversation.contact || selectedConversation.number}`,
        });
      } else {
        // Update the message to show it failed
        const finalUpdatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            const updatedMessages = conv.messages.map(msg => {
              if (msg.id === newMessage.id) {
                return {
                  ...msg,
                  status: 'failed',
                  error: result.error
                };
              }
              return msg;
            });

            return {
              ...conv,
              messages: updatedMessages
            };
          }
          return conv;
        });

        setConversations(finalUpdatedConversations);
        setSelectedConversation(finalUpdatedConversations.find(c => c.id === selectedConversation.id));

        toast({
          title: "Failed to send message",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Update the message to show it failed
      const finalUpdatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          const updatedMessages = conv.messages.map(msg => {
            if (msg.id === newMessage.id) {
              return {
                ...msg,
                status: 'failed',
                error: error.message
              };
            }
            return msg;
          });

          return {
            ...conv,
            messages: updatedMessages
          };
        }
        return conv;
      });

      setConversations(finalUpdatedConversations);
      setSelectedConversation(finalUpdatedConversations.find(c => c.id === selectedConversation.id));

      toast({
        title: "Failed to send message",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const sendBlastMessage = async () => {
    if (!blastMessage.trim() || !blastNumbers.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both phone numbers and a message to send",
        variant: "destructive",
      });
      return;
    }

    setIsBlastSending(true);

    try {
      // Parse the phone numbers from the text area
      const numbersArray = blastNumbers
        .split(',')
        .map(num => num.trim())
        .filter(num => num.length > 0)
        .map(num => {
          // Format the phone number (remove any non-digit characters)
          let formatted = num.replace(/\D/g, '');
          // Ensure it has country code
          if (formatted.length === 10) {
            formatted = '1' + formatted;
          }
          return formatted;
        });

      if (numbersArray.length === 0) {
        toast({
          title: "No valid numbers",
          description: "Please enter valid phone numbers separated by commas",
          variant: "destructive",
        });
        setIsBlastSending(false);
        return;
      }

      // Send the bulk message using our Twilio utility
      const result = await sendBulkSMSSafe(numbersArray, blastMessage);

      // Close the dialog
      setIsBlastMessageOpen(false);

      // Reset the form
      setBlastNumbers('');
      setBlastMessage('');

      if (result.sent > 0) {
        toast({
          title: "Bulk messages sent",
          description: `Successfully sent ${result.sent} of ${result.total} messages`,
          variant: result.failed > 0 ? "default" : "default",
        });

        // If there were failures, show a more detailed toast
        if (result.failed > 0) {
          toast({
            title: "Some messages failed",
            description: `${result.failed} of ${result.total} messages failed to send`,
            variant: "destructive",
          });
        }

        // Create new conversation entries for the successful sends that don't exist yet
        const newConversations = [...conversations];

        result.results.forEach(msgResult => {
          if (msgResult.success) {
            // Check if a conversation with this number already exists
            const existingConvIndex = newConversations.findIndex(
              conv => conv.number.replace(/\D/g, '') === msgResult.to.replace(/\D/g, '')
            );

            if (existingConvIndex >= 0) {
              // Add message to existing conversation
              const newMessage = {
                id: newConversations[existingConvIndex].messages.length + 1,
                direction: 'outgoing',
                text: msgResult.body,
                timestamp: new Date().toLocaleString(),
                status: msgResult.status,
                messageId: msgResult.messageId,
                from: msgResult.from
              };

              newConversations[existingConvIndex].messages.push(newMessage);
            } else {
              // Create a new conversation
              const formattedNumber = `+${msgResult.to.replace(/\D/g, '')}`;
              const displayNumber = `+${msgResult.to.replace(/\D/g, '').replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')}`;

              const newConversation = {
                id: Math.max(...newConversations.map(c => c.id)) + 1,
                number: displayNumber,
                contact: '',
                workspace: 'Workspace # +1 (332) 244-3107',
                flagged: false,
                stopped: false,
                messages: [
                  {
                    id: 1,
                    direction: 'outgoing',
                    text: msgResult.body,
                    timestamp: new Date().toLocaleString(),
                    status: msgResult.status,
                    messageId: msgResult.messageId,
                    from: msgResult.from
                  }
                ],
                meta: {
                  src: 'BlastMessage',
                  ulid: `BM${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                  email: '',
                  state: '',
                  lead_id: '',
                  adsource: '',
                  language: 'English',
                  last_name: '',
                  first_name: '',
                  date_created: new Date().toLocaleString(),
                  business_name: '',
                  time_in_business: '',
                  monthly_gross_sales: '',
                  best_time_to_contact: '',
                  personal_credit_score: '',
                  requested_loan_amount: ''
                }
              };

              newConversations.push(newConversation);
            }
          }
        });

        setConversations(newConversations);
      } else {
        toast({
          title: "Failed to send messages",
          description: "All messages failed to send. Please check the phone numbers and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending bulk messages:', error);

      toast({
        title: "Error sending messages",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsBlastSending(false);
    }
  };

  const addContact = () => {
    // This would open a dialog to add a contact in a real app
    console.log('Adding contact to CRM');
  };

  return (
    <DashboardLayout title="Messages">
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Left sidebar with conversation list */}
        <div className="w-1/3 border-r border-[#2c2e3a] overflow-y-auto">
          <div className="p-3 border-b border-[#2c2e3a] flex justify-between items-center">
            <div className="text-sm text-[#8c8e96]">
              <span>Channels: 667</span>
              <span className="ml-3">Unread: 116</span>
            </div>
            <div className="flex space-x-1">
              <Button size="sm" variant="outline" className="bg-purple-600 hover:bg-purple-700 border-none">
                <span className="text-xs">✓</span>
              </Button>
              <Button size="sm" variant="outline" className="bg-red-600 hover:bg-red-700 border-none">
                <span className="text-xs">✗</span>
              </Button>
            </div>
          </div>

          <div className="p-3 border-b border-[#2c2e3a]">
            <Input
              placeholder="Search for anything..."
              className="bg-[#2a2d36] border-[#3d4051]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="p-3 border-b border-[#2c2e3a] flex space-x-2">
            <div className="flex-1">
              <label className="text-xs text-[#8c8e96] block mb-1">Campaign</label>
              <select className="w-full bg-[#2a2d36] border border-[#3d4051] rounded px-2 py-1 text-sm">
                <option>None Selected</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#8c8e96] block mb-1">Flags</label>
              <select className="w-full bg-[#2a2d36] border border-[#3d4051] rounded px-2 py-1 text-sm">
                <option>None</option>
              </select>
            </div>
          </div>

          <div className="p-3 border-b border-[#2c2e3a] flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <input type="checkbox" id="unread" className="mr-1 accent-purple-600" />
                <label htmlFor="unread" className="text-xs text-[#8c8e96]">Unread</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="bookmarked" className="mr-1 accent-purple-600" />
                <label htmlFor="bookmarked" className="text-xs text-[#8c8e96]">Bookmarked</label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-xs text-[#8c8e96]">Replied:</label>
              <select className="bg-[#2a2d36] border border-[#3d4051] rounded px-1 text-xs">
                <option>Both</option>
              </select>
            </div>
          </div>

          <div className="p-3 border-b border-[#2c2e3a]">
            <div className="flex items-center">
              <input type="checkbox" id="order-oldest" className="mr-1 accent-purple-600" />
              <label htmlFor="order-oldest" className="text-xs text-[#8c8e96]">Order by oldest</label>
            </div>
          </div>

          {/* Conversation list */}
          <div className="overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-3 border-b border-[#2c2e3a] cursor-pointer hover:bg-[#2a2d36] flex ${selectedConversation?.id === conv.id ? 'bg-[#2a2d36]' : ''}`}
              >
                <div className="mr-2 text-center mt-1">
                  {conv.flagged ? <div className="h-5 w-5 rounded-full bg-yellow-500"></div> : null}
                  {conv.stopped ? <div className="h-5 w-5 rounded-full bg-red-500 mt-1"></div> : null}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-medium">
                      {conv.number} {conv.contact ? `- ${conv.contact}` : ''}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    {conv.messages[conv.messages.length - 1]?.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {conv.messages[conv.messages.length - 1]?.timestamp}
                  </div>
                </div>
                <div className="flex flex-col ml-2 space-y-1">
                  <Button size="icon" variant="ghost" className="h-5 w-5">
                    <span className="text-xs">🚩</span>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-5 w-5">
                    <span className="text-xs">⛔</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle section with conversation */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Conversation header */}
            <div className="p-3 border-b border-[#2c2e3a] flex justify-between items-center">
              <div>
                <div className="font-medium">{selectedConversation.number}</div>
                <div className="text-sm text-[#8c8e96]">{selectedConversation.workspace}</div>
                <div className="text-sm text-[#8c8e96]">{selectedConversation.contact}</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-[#3d4051] text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
                onClick={addContact}
              >
                Add Contact To CRM
              </Button>
            </div>

            {/* Message thread */}
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.direction === 'outgoing'
                        ? message.status === 'failed'
                          ? 'bg-red-800 text-white'
                          : 'bg-[#a855f7] text-white'
                        : 'bg-[#2a2d36] text-white'
                    }`}
                  >
                    <div className="text-sm">{message.text}</div>
                    <div className="flex justify-between items-center text-xs text-gray-300 mt-1">
                      <div className="flex items-center">
                        {message.direction === 'outgoing' && (
                          <span className="mr-1">
                            {message.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
                            {message.status === 'queued' && '⏱️'}
                            {message.status === 'sent' && '✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'failed' && '⚠️'}
                          </span>
                        )}
                        <span>
                          {message.status === 'failed' ? 'Failed' : message.status}
                        </span>
                      </div>
                      <div>{message.timestamp}</div>
                    </div>
                    {message.status === 'failed' && message.error && (
                      <div className="text-xs text-red-300 mt-1">
                        Error: {message.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {selectedConversation.messages.some(m => m.text.includes('STOP')) && (
                <div className="mt-4 p-2 bg-red-500/20 border border-red-500 rounded text-center text-sm">
                  YOU CANNOT SEND MESSAGES HERE AS THIS NUMBER HAS BEEN UNSUBSCRIBED.
                  <button className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded">CLICK HERE TO ARCHIVE</button>
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="p-3 border-t border-[#2c2e3a]">
              <div className="flex items-center">
                <Input
                  placeholder="Type a message..."
                  className="flex-1 bg-[#2a2d36] border-[#3d4051]"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={isSending || selectedConversation.messages.some(m => m.text.includes('STOP'))}
                />
                <Button
                  onClick={sendMessage}
                  className="ml-2 bg-purple-600 hover:bg-purple-700"
                  disabled={isSending || selectedConversation.messages.some(m => m.text.includes('STOP')) || !messageText.trim()}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
              {selectedConversation.messages.some(m => m.status === 'failed') && (
                <div className="mt-2 text-xs text-red-400">
                  Some messages failed to send. Check your connection and try again.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}

        {/* Right sidebar with contact details */}
        <div className="w-1/3 border-l border-[#2c2e3a] overflow-y-auto">
          {selectedConversation && (
            <div>
              <div className="p-3 border-b border-[#2c2e3a]">
                <h3 className="font-medium">Contact Meta Data</h3>
                <div
                  className="absolute top-3 right-3 h-6 w-6 bg-purple-500 rounded-full"
                  style={{ display: 'none' }}
                ></div>
              </div>

              <div className="p-3 space-y-2">
                {Object.entries(selectedConversation.meta).map(([key, value]) => (
                  <div key={key} className="flex">
                    <div className="w-1/3 text-xs text-[#8c8e96] pr-2">{key.replace(/_/g, ' ')}:</div>
                    <div className="w-2/3 text-xs truncate">
                      {key === 'email' ? (
                        <a href={`mailto:${value}`} className="text-purple-400 hover:underline">
                          {value}
                        </a>
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-[#2c2e3a]">
                <h3 className="font-medium mb-2">Contact Notes</h3>
                <Textarea
                  placeholder="Enter notes here"
                  className="w-full h-24 bg-[#2a2d36] border-[#3d4051]"
                />
              </div>

              <div className="p-3 border-t border-[#2c2e3a]">
                <h3 className="font-medium mb-2">Campaign History</h3>
                <div className="space-y-1 text-xs">
                  <a href="#" className="text-purple-400 hover:underline block">View Full Campaign History</a>
                  <a href="#" className="text-purple-400 hover:underline block">View Full Channel Log History</a>
                  <a href="#" className="text-purple-400 hover:underline block">View Three-dot Link Clicks</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center fixed bottom-4 right-4 left-[220px]">
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsBlastMessageOpen(true)}
            className="bg-[#a855f7] hover:bg-[#9333ea]"
          >
            Send Message
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#8c8e96]">Safe Mode:</span>
            <div
              className={`w-12 h-6 rounded-full cursor-pointer flex items-center transition-colors ${safeMode ? 'bg-purple-600' : 'bg-[#3d4051]'}`}
              onClick={() => setSafeMode(!safeMode)}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transform transition-transform ${safeMode ? 'translate-x-6' : 'translate-x-1'}`}
              ></div>
            </div>
          </div>
        </div>
        <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-900/20">
          Export Channels
        </Button>
      </div>

      {/* Blast Message Dialog */}
      <Dialog open={isBlastMessageOpen} onOpenChange={setIsBlastMessageOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#232530] border-[#2c2e3a]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex justify-between items-center">
              BLAST MESSAGE
              <Button
                variant="ghost"
                size="sm"
                className="text-[#8c8e96]"
                onClick={() => setIsBlastMessageOpen(false)}
              >
                X
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <p className="text-sm text-[#8c8e96]">
              Please enter the numbers you would like to send messages to below,
              and separate the numbers with commas. Optionally, you can send it
              to channels marked with specific flags.
            </p>

            <div className="mt-4 flex justify-center">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-[200px] grid-cols-2 mx-auto">
                  <TabsTrigger value="numbers" className="bg-green-600 data-[state=active]:bg-green-700">Numbers</TabsTrigger>
                  <TabsTrigger value="flags" className="bg-blue-600 data-[state=active]:bg-blue-700">Flags</TabsTrigger>
                </TabsList>

                <TabsContent value="numbers" className="mt-4">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400">
                      This will accept a leading "1". The number will also be accepted if there is no leading "1"
                    </p>
                    <Textarea
                      placeholder="Enter numbers, separated by commas..."
                      className="w-full h-20 bg-[#2a2d36] border-[#3d4051]"
                      value={blastNumbers}
                      onChange={(e) => setBlastNumbers(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button variant="outline" className="border-[#3d4051] text-purple-400 hover:bg-purple-900/20">
                        Comma Paste
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm">Number Limit: 0 / 2000</div>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Select List
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="flags" className="mt-4">
                  <div className="p-4 text-center text-gray-400">
                    Channel flag selection will be available here
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-6">
              <h3 className="text-sm mb-2">Message Body:</h3>
              <div className="flex gap-1 mb-2">
                <Button variant="outline" size="sm" className="text-xs border-[#3d4051] bg-[#2a2d36] hover:bg-[#343746] text-purple-400">
                  {"{f}"}
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-[#3d4051] bg-[#2a2d36] hover:bg-[#343746] text-purple-400">
                  {"{fn}"}
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-[#3d4051] bg-[#2a2d36] hover:bg-[#343746] text-purple-400">
                  {"{ln}"}
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-[#3d4051] bg-[#2a2d36] hover:bg-[#343746] text-purple-400">
                  {"{bf}"}
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-[#3d4051] bg-[#2a2d36] hover:bg-[#343746] text-purple-400">
                  {"{cn}"}
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-[#3d4051] bg-[#2a2d36] hover:bg-[#343746] text-purple-400">
                  {"{az}"}
                </Button>
              </div>

              <Textarea
                placeholder="Enter your message"
                className="w-full h-32 bg-[#2a2d36] border-[#3d4051]"
                value={blastMessage}
                onChange={(e) => setBlastMessage(e.target.value)}
              />

              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <div>Characters: 0</div>
                <div>Segments: 0 / 2</div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={sendBlastMessage}
                className="bg-purple-600 hover:bg-purple-700 w-1/2"
                disabled={isBlastSending || !blastMessage.trim() || !blastNumbers.trim()}
              >
                {isBlastSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Messages
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
