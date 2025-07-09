import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: "Hello! I'm your AI assistant for civic education. Ask me about civic rights, mental health, drug awareness, and more!",
    isUser: false,
    timestamp: new Date()
  }]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    if (message.includes('civic') || message.includes('rights')) {
      return "Civic rights include voting, freedom of expression, and equal access to public services. Want more details?";
    } else if (message.includes('mental') || message.includes('anxiety')) {
      return "Mental health matters! Practice mindfulness, talk to trusted adults, and reach out to professionals if needed.";
    } else if (message.includes('drug')) {
      return "Drugs can harm your body and mind. Stay informed, say no to peer pressure, and seek support when needed.";
    } else {
      return "I'm here to help with civic rights, mental health, and drug awareness. What would you like to know more about?";
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(userMessage.content),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">AI Assistant</h2>
        <p className="text-gray-600">Ask anything about civic rights, mental health, or drug awareness</p>
      </div>

      <Card className="h-[600px]  flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" /> Chat Assistant
          </CardTitle>
          <CardDescription>
            Instant help with your civic education questions
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-4 pb-10">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  {!message.isUser && (
                    <div className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4  text-blue-600" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-lg bg-muted text-muted-foreground ${message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.isUser && (
                    <div className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-muted" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Ask something..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge onClick={() => setInputMessage('What are my civic rights?')} variant="outline" className="cursor-pointer hover:bg-gray-100">Civic Rights</Badge>
            <Badge onClick={() => setInputMessage('How can I deal with anxiety?')} variant="outline" className="cursor-pointer hover:bg-gray-100">Mental Health</Badge>
            <Badge onClick={() => setInputMessage('Why avoid drugs?')} variant="outline" className="cursor-pointer hover:bg-gray-100">Drug Awareness</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
