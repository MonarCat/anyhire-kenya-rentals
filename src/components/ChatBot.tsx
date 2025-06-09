
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AnyHire assistant. I can help you navigate the site, understand how rentals work, or answer questions about listing items. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Navigation help
    if (message.includes('browse') || message.includes('search') || message.includes('find items')) {
      return "To browse items, click 'Browse Items' in the header or visit /search. You can filter by category, location, and price range to find exactly what you need.";
    }
    
    if (message.includes('list') || message.includes('rent out') || message.includes('earn money')) {
      return "To list an item for rent, click 'List Item' in the header or visit /list-item. You'll need to provide photos, description, pricing, and location details.";
    }
    
    if (message.includes('profile') || message.includes('account') || message.includes('settings')) {
      return "Access your profile by clicking the Account menu in the top right. From there you can edit your profile, view your listings, and manage bookings.";
    }
    
    if (message.includes('dashboard') || message.includes('my items') || message.includes('bookings')) {
      return "Your dashboard shows all your active listings, rental requests, and booking history. Access it from the Account menu after signing in.";
    }
    
    if (message.includes('pricing') || message.includes('plans') || message.includes('subscription')) {
      return "Check out our pricing plans at /pricing to see the different listing options and features available for item owners.";
    }
    
    if (message.includes('safety') || message.includes('security') || message.includes('tips')) {
      return "Safety is important! Visit /safety-tips to learn about secure transactions, meeting safely, and protecting yourself when renting or listing items.";
    }
    
    if (message.includes('agreement') || message.includes('terms') || message.includes('contract')) {
      return "Our rental agreement template is available at /rental-agreement. This helps protect both renters and item owners during transactions.";
    }
    
    if (message.includes('payment') || message.includes('how to pay') || message.includes('mpesa')) {
      return "Payments are processed securely through M-Pesa and other supported methods. The platform handles all transactions with a small service fee.";
    }
    
    if (message.includes('sign up') || message.includes('register') || message.includes('create account')) {
      return "To get started, click 'Get Started' or 'Sign In' in the header and create your account. You'll need an email and password to begin listing or renting items.";
    }
    
    // General help
    if (message.includes('how') && message.includes('work')) {
      return "AnyHire connects people who need items with those who have them to rent. Browse available items, contact owners, agree on terms, and complete secure payments through our platform.";
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I can help you with navigation, explain how rentals work, guide you through listing items, or answer questions about safety and payments. What would you like to know?";
    }
    
    // Default responses
    const defaultResponses = [
      "I can help you navigate AnyHire! Try asking about browsing items, listing for rent, your dashboard, pricing plans, or safety tips.",
      "Not sure I understand that specific question, but I can help with site navigation, rental processes, or account management. What would you like to know?",
      "I'm here to help you use AnyHire effectively. Ask me about finding items to rent, listing your own items, managing your account, or staying safe on the platform."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 h-96 shadow-xl">
      <CardHeader className="bg-green-600 text-white rounded-t-lg p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AnyHire Assistant
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-green-700 h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-80">
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  message.isBot
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-600 text-white'
                }`}
              >
                <div className="flex items-start gap-1">
                  {message.isBot && <Bot className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                  {!message.isBot && <User className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                  <span>{message.text}</span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-2 rounded-lg text-sm flex items-center gap-1">
                <Bot className="w-3 h-3" />
                <span>Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-3">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-green-600 hover:bg-green-700 h-9 w-9"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
