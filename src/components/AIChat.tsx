
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
      content: "Hello! I'm your AI assistant for civic education. I can help answer questions about civic rights, mental health resources, drug awareness, and more. What would you like to learn about today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample responses - in a real app, this would connect to an AI service
  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('civic') || message.includes('rights')) {
      return "Civic rights are fundamental freedoms and protections that citizens have in a democratic society. These include the right to vote, freedom of speech, freedom of assembly, and equal protection under the law. Would you like to learn more about any specific civic right?";
    } else if (message.includes('mental health') || message.includes('depression') || message.includes('anxiety')) {
      return "Mental health is just as important as physical health. If you're struggling, remember that help is available. Consider speaking with a healthcare provider, calling a mental health helpline, or reaching out to trusted friends and family. Our institutions directory has resources that might help. What specific aspect of mental health would you like to discuss?";
    } else if (message.includes('drug') || message.includes('substance') || message.includes('addiction')) {
      return "Drug awareness and prevention are crucial for community health. If you or someone you know is struggling with substance use, know that recovery is possible with the right support. There are many resources available including counseling, support groups, and treatment programs. Would you like information about local resources?";
    } else if (message.includes('voting') || message.includes('election')) {
      return "Voting is one of the most important civic duties and rights. To vote, you typically need to be registered, be of legal age (usually 18), and meet residency requirements. Elections happen at various levels - local, state, and federal. Each vote matters in shaping your community and country. Do you have questions about the voting process?";
    } else {
      return "That's an interesting question! I'm here to help with civic education, mental health awareness, and drug prevention topics. You can also explore our learning modules or check out local institutions in our directory for more specific resources. What would you like to know more about?";
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

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputMessage),
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
        <p className="text-gray-600">Ask questions about civic education, mental health, and more</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Chat Assistant
          </CardTitle>
          <CardDescription>
            Get instant help with your civic education questions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
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
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
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
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setInputMessage("What are my voting rights?")}
            >
              Voting Rights
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setInputMessage("How can I manage stress and anxiety?")}
            >
              Mental Health
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setInputMessage("What should I know about drug prevention?")}
            >
              Drug Awareness
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
