import { useState } from 'react';
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. Ask me anything about civic rights, mental health, drug awareness, or youth empowerment.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('civic') || message.includes('right')) {
      return `Civic rights include your right to vote, freedom of speech, equality before the law, and freedom of assembly. As a student or young citizen, knowing your rights helps you participate meaningfully in society. Would you like to explore a real-world scenario involving rights?`;
    } else if (message.includes('mental') || message.includes('stress') || message.includes('anxiety') || message.includes('depression')) {
      return `Mental health matters! Here are some strategies: journaling, talking to a counselor, exercise, and setting realistic goals. Remember, it’s okay to ask for help. Want a quick daily mental health challenge?`;
    } else if (message.includes('drug') || message.includes('substance') || message.includes('addiction')) {
      return `Drug abuse can severely impact your health, relationships, and future. Prevention starts with education and open dialogue. Need help finding a local institution for support?`;
    } else if (message.includes('election') || message.includes('vote')) {
      return `Voting gives you a voice in decisions that affect your community. Are you registered to vote? Would you like to learn how elections work in Kenya?`;
    } else if (message.includes('institution') || message.includes('support')) {
      return `You can visit our Institutions page to connect with organizations offering mental health support, drug recovery programs, and civic education outreach. Would you like to see a list now?`;
    } else {
      return `I'm here to guide you on civic learning, mental health, and drug prevention. You can also explore learning modules or talk to someone in our support directory. What topic do you want help with today?`;
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
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
        <p className="text-gray-600">Ask about civic rights, mental health, drug awareness, and more.</p>
      </div>

      <Card className="flex flex-col h-[80vh] md:h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Chat Assistant
          </CardTitle>
          <CardDescription>Get help from your civic education assistant</CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  {!msg.isUser && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-full md:max-w-[80%] p-3 rounded-lg ${
                      msg.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.isUser && (
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
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4 flex-wrap sm:flex-nowrap">
            <Input
              placeholder="Type a question..."
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

          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "What are civic rights?",
              "How do I manage stress?",
              "Where can I get help for addiction?",
              "Tell me about voting in Kenya",
              "How does depression affect youth?",
              "Why is drug abuse harmful?",
            ].map((question) => (
              <Badge
                key={question}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setInputMessage(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
