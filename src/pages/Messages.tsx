import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MessageSquare, Users, MapPin, Calendar, Clock, UserPlus } from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct");

  // Mensagens diretas
  const directMessages = [
    {
      id: 1,
      name: "Ana Silva",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Vamos pro Boteco da Maria hoje às 19h? 🍻",
      time: "há 5 min",
      unread: 2,
      type: "hangout",
      place: "Boteco da Maria"
    },
    {
      id: 2,
      name: "Carlos Oliveira",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Confirmado para o happy hour! Que horas chegam?",
      time: "há 12 min",
      unread: 0,
      type: "hangout",
      place: "Bar do Centro"
    },
    {
      id: 3,
      name: "Mariana Costa",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Criou o grupo 'Jantares Italianos' - Que tal nos encontrarmos?",
      time: "há 1h",
      unread: 1,
      type: "group",
      place: "Bella Vista"
    },
    {
      id: 4,
      name: "Pedro Santos",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Galera do futebol está marcando para sábado!",
      time: "há 2h",
      unread: 0,
      type: "hangout",
      place: "Arena Sports"
    }
  ];

  // Mensagens de grupos
  const groupMessages = [
    {
      id: 1,
      name: "Amigos do Happy Hour",
      avatar: "🍻",
      lastMessage: "Ana: Encontro hoje às 18h30 no Bar Central!",
      time: "há 8 min",
      unread: 3,
      members: 8,
      type: "group",
      place: "Bar Central"
    },
    {
      id: 2,
      name: "Foodlovers SP",
      avatar: "🍕",
      lastMessage: "Carlos: Alguém conhece um bom japonês na região?",
      time: "há 25 min",
      unread: 0,
      members: 24,
      type: "group"
    },
    {
      id: 3,
      name: "Noite e Dia",
      avatar: "🌙",
      lastMessage: "Marina: Festival de música eletrônica no sábado!",
      time: "há 1h",
      unread: 5,
      members: 15,
      type: "group",
      place: "Club Underground"
    },
    {
      id: 4,
      name: "Galera do Esporte",
      avatar: "⚽",
      lastMessage: "Pedro: Partida marcada para domingo de manhã",
      time: "há 3h",
      unread: 0,
      members: 12,
      type: "group",
      place: "Quadra do Parque"
    }
  ];

  const currentMessages = activeTab === "direct" ? directMessages : groupMessages;

  const handleMessageClick = (messageId: number) => {
    console.log(`Abrir conversa ${messageId}`);
    // Aqui você pode navegar para a conversa específica
  };

  return (
    <div className="h-screen bg-background max-w-sm mx-auto flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-border p-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/home')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Mensagens</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border flex-shrink-0">
        <div className="flex">
          <Button
            variant={activeTab === "direct" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 rounded-none border-b-2 ${
              activeTab === "direct" 
                ? "border-primary bg-primary/10 text-primary hover:bg-primary/20" 
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("direct")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Diretas
          </Button>
          <Button
            variant={activeTab === "groups" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 rounded-none border-b-2 ${
              activeTab === "groups" 
                ? "border-primary bg-primary/10 text-primary hover:bg-primary/20" 
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("groups")}
          >
            <Users className="w-4 h-4 mr-2" />
            Grupos
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3 pb-20">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleMessageClick(message.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  {activeTab === "direct" ? (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={message.avatar} alt={message.name} />
                      <AvatarFallback>{message.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                      {message.avatar}
                    </div>
                  )}
                  {message.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{message.unread}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {message.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                  </div>
                  
                  {activeTab === "groups" && (
                    <div className="text-xs text-muted-foreground mb-1">
                      👥 {message.members} membros
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {message.lastMessage}
                  </p>
                  
                  {message.place && message.type === "hangout" && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className="text-xs text-primary font-medium">{message.place}</span>
                    </div>
                  )}
                  
                  {message.place && message.type === "group" && (
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {message.place}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Estado vazio */}
          {currentMessages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-2">Nenhuma mensagem</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === "direct" 
                  ? "Suas conversas diretas aparecerão aqui." 
                  : "Seus grupos aparecerão aqui."
                }
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate('/social')}
              >
                Conectar com pessoas
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages; 