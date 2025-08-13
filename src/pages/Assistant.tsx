import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface RecommendationItem {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  rating: number;
  total_reviews: number;
  price_range: string;
  features: string;
  latitude: number;
  longitude: number;
}

interface AssistantApiResponse {
  user_message: string;
  intent: {
    query: string;
    features: string[];
    min_rating: number;
    max_distance_km: number | null;
    lat: number | null;
    lon: number | null;
  };
  recommendations: RecommendationItem[];
}

const Assistant = () => {
  const navigate = useNavigate();
  const { user, supabaseUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    try {
      // Em dev, usa proxy do Vite (/ai -> https://ia.henriquefontaine.com)
      const endpoint = import.meta.env.DEV ? '/ai/chat' : 'https://ia.henriquefontaine.com/chat';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const res: AssistantApiResponse = await response.json();

      const top = res.recommendations.slice(0, 5);
      const header = res.intent?.query
        ? `Encontrei opções para "${res.intent.query}"${res.intent.features?.length ? ` com ${res.intent.features.join(', ')}` : ''}:\n`
        : 'Aqui estão algumas recomendações:\n';
      const list = top.map((r, idx) => `${idx + 1}. ${r.name} — ${r.category} (${r.price_range || '-'})\n   ⭐ ${r.rating.toFixed(1)} (${r.total_reviews})\n   ${r.address}`).join('\n\n');
      const assistantText = `${header}${list}`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: assistantText,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Não consegui buscar recomendações agora. ${err?.message ? `Detalhes: ${err.message}` : ''}`.trim(),
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
      // Foca novamente no input para facilitar a digitação contínua
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
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
                  <AvatarImage src={user?.avatar_url || supabaseUser?.user_metadata?.avatar_url || undefined} />
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
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border p-3 z-[60] safe-area-bottom shadow-lg">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              type="text"
              autoFocus
              inputMode="text"
              enterKeyHint="send"
              autoComplete="off"
              className="flex-1"
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
