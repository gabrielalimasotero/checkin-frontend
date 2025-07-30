import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, MapPin, Calendar, Clock } from "lucide-react";

interface MessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MessagesDialog = ({ open, onOpenChange }: MessagesDialogProps) => {
  const [activeTab, setActiveTab] = useState<"direct" | "groups">("direct");

  const directMessages = [
    {
      id: 1,
      name: "Ana Silva",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Vamos pro Boteco da Maria hoje às 19h? 🍻",
      time: "5 min",
      unread: 2,
      type: "hangout",
      place: "Boteco da Maria"
    },
    {
      id: 2,
      name: "Carlos Oliveira",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Confirmado para o happy hour! Que horas chegam?",
      time: "12 min",
      unread: 0,
      type: "hangout",
      place: "Bar do Centro"
    },
    {
      id: 3,
      name: "Mariana Costa",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Criou o grupo 'Jantares Italianos' - Que tal nos encontrarmos?",
      time: "1h",
      unread: 1,
      type: "group",
      place: "Bella Vista"
    },
    {
      id: 4,
      name: "Pedro Santos",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Galera do futebol está marcando para sábado!",
      time: "2h",
      unread: 0,
      type: "hangout",
      place: "Arena Sports"
    }
  ];

  const groupMessages = [
    {
      id: 1,
      name: "Amigos do Happy Hour",
      avatar: "🍻",
      lastMessage: "Ana: Encontro hoje às 18h30 no Bar Central!",
      time: "8 min",
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
      time: "25 min",
      unread: 0,
      members: 24,
      type: "group"
    },
    {
      id: 3,
      name: "Noite e Dia",
      avatar: "🌙",
      lastMessage: "Marina: Festival de música eletrônica no sábado!",
      time: "1h",
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
      time: "3h",
      unread: 0,
      members: 12,
      type: "group",
      place: "Quadra do Parque"
    }
  ];

  const currentMessages = activeTab === "direct" ? directMessages : groupMessages;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Mensagens</span>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b px-4">
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

        {/* Messages List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="relative">
                  {activeTab === "direct" ? (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={message.avatar} />
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{message.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                  </div>
                  
                  {activeTab === "groups" && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {message.members} membros
                    </p>
                  )}
                  
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {message.lastMessage}
                  </p>
                  
                  {message.place && message.type === "hangout" && (
                    <div className="flex items-center space-x-1 mt-1">
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
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesDialog;