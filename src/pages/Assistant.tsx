import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Assistant = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mensagem de boas-vindas
    const welcomeMessage: Message = {
      id: '1',
      text: 'Olá! Sou seu assistente inteligente do CheckIn. Como posso ajudá-lo hoje? Posso sugerir lugares, eventos, ajudar com check-ins e muito mais!',
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // TODO: Implementar integração com API do assistente inteligente
    // const response = await sendMessageToAssistant(inputText);
    
    // Simular resposta do assistente (remover quando API estiver pronta)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela sua mensagem! Estou processando sua solicitação. Em breve terei uma resposta personalizada para você.',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-bold text-primary">Assistente CheckIn</h1>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                {message.sender === 'user' ? (
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                )}
                <AvatarFallback>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex flex-col ${
                message.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
                <Card className={`p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </Card>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-muted">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-border p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              size="sm"
              className="p-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
