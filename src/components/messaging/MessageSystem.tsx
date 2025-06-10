
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_profile?: {
    full_name: string;
    avatar_url: string;
  };
}

interface Conversation {
  recipient_id: string;
  recipient_name: string;
  recipient_avatar: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface MessageSystemProps {
  itemId?: string;
  recipientId?: string;
  className?: string;
}

const MessageSystem: React.FC<MessageSystemProps> = ({ 
  itemId, 
  recipientId, 
  className = "" 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(recipientId || null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    fetchConversations();
    
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }

    // Set up real-time subscription for messages
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Update conversations list
          fetchConversations();
          
          // Show notification if message is from someone else
          if (newMessage.sender_id !== user.id) {
            toast({
              title: "New message",
              description: "You have received a new message",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConversation]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // This is a simplified version - in production you'd want a more efficient query
      const { data: sentMessages } = await supabase
        .from('messages')
        .select(`
          recipient_id,
          content,
          created_at,
          profiles!messages_recipient_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      const { data: receivedMessages } = await supabase
        .from('messages')
        .select(`
          sender_id,
          content,
          created_at,
          is_read,
          profiles!messages_sender_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      // Process conversations (simplified)
      const conversationMap = new Map<string, Conversation>();

      sentMessages?.forEach(msg => {
        if (!conversationMap.has(msg.recipient_id)) {
          conversationMap.set(msg.recipient_id, {
            recipient_id: msg.recipient_id,
            recipient_name: msg.profiles?.full_name || 'Unknown User',
            recipient_avatar: msg.profiles?.avatar_url || '',
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0
          });
        }
      });

      receivedMessages?.forEach(msg => {
        const existing = conversationMap.get(msg.sender_id);
        if (!existing || new Date(msg.created_at) > new Date(existing.last_message_time)) {
          conversationMap.set(msg.sender_id, {
            recipient_id: msg.sender_id,
            recipient_name: msg.profiles?.full_name || 'Unknown User',
            recipient_avatar: msg.profiles?.avatar_url || '',
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: existing?.unread_count || 0
          });
        }
        
        if (!msg.is_read) {
          const conv = conversationMap.get(msg.sender_id);
          if (conv) {
            conv.unread_count++;
          }
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', otherUserId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedConversation) return;
    
    setIsSending(true);
    try {
      const messageData = {
        sender_id: user.id,
        recipient_id: selectedConversation,
        content: newMessage.trim(),
        item_id: itemId || null,
        conversation_id: `${[user.id, selectedConversation].sort().join('-')}`,
        is_read: false
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      setNewMessage('');
      
      // Optimistically add the message to the UI
      setMessages(prev => [...prev, {
        id: `temp-${Date.now()}`,
        sender_id: user.id,
        recipient_id: selectedConversation,
        content: messageData.content,
        created_at: new Date().toISOString(),
        is_read: false
      }]);

    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectConversation = (recipientId: string) => {
    setSelectedConversation(recipientId);
    fetchMessages(recipientId);
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Please log in to access messaging</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Messages
        </h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-96">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <ScrollArea className="h-full">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.recipient_id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conv.recipient_id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => selectConversation(conv.recipient_id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={conv.recipient_avatar} />
                        <AvatarFallback>
                          {conv.recipient_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conv.recipient_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.last_message}
                        </p>
                      </div>
                      {conv.unread_count > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {conv.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <ScrollArea className="flex-1 p-4">
                  {isLoading ? (
                    <div className="text-center text-gray-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500">No messages yet</div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg ${
                              message.sender_id === user.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      disabled={isSending}
                    />
                    <Button onClick={sendMessage} disabled={isSending || !newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageSystem;
