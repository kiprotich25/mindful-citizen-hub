import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        "Hello! I'm your AI assistant for civic education. I can help answer questions about civic rights, mental health resources, drug awareness, and more. What would you like to learn about today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('civic') || message.includes('rights')) {
      return "Civic rights are freedoms that allow citizens to participate in their society—like voting, free speech, and equality before the law.";
    } else if (message.includes('mental health') || message.includes('stress') || message.includes('depression') || message.includes('anxiety')) {
      return "Mental health matters. Managing stress, seeking help when needed, and maintaining routines can support mental wellness. What would you like help with?";
    } else if (message.includes('drug') || message.includes('addiction')) {
      return "Drugs can harm your health and future. Avoid peer pressure, seek healthy coping mechanisms, and reach out if you or someone needs support.";
    } else if (message.includes('voting') || message.includes('election')) {
      return "Voting lets you shape your community. You must be registered, eligible, and informed. Want to learn how to vote or what it means?";
    } else {
      return "That's a good question! I'm here to help with civic learning, mental health, and drug awareness. Try asking about civic rights or mental health tips.";
    }
  };

  const sendMessage = async () => {
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
        <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
        <p className="text-gray-600">
          Ask questions about civic education, mental health, and more
        </p>
      </div>

      <Card className="flex flex-col h-[600px] max-h-[80vh]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Chat Assistant
          </CardTitle>
          <CardDescription>
            Get instant help with your civic education questions
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 pr-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {message.isUser && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Ask a question about civic rights, mental health, or drug awareness..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="overflow-x-auto mt-2">
            <div className="flex gap-2 w-max">
              {[
                'What are civic rights?',
                'How do I manage stress?',
                'Where can I get help for addiction?',
                'Tell me about voting in Kenya',
                'How does depression affect youth?',
                'Why is drug abuse harmful?'
              ].map((question) => (
                <Badge
                  key={question}
                  variant="outline"
                  className="cursor-pointer whitespace-nowrap hover:bg-gray-100"
                  onClick={() => setInputMessage(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
