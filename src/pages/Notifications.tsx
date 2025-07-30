
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, Clock, Users, Check, X, Heart, Calendar, UserPlus } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();

  const handleAcceptInvitation = (invitationId: number) => {
    console.log(`Aceitar convite ${invitationId}`);
  };

  const handleDeclineInvitation = (invitationId: number) => {
    console.log(`Recusar convite ${invitationId}`);
  };

  const handleAcceptConnection = (connectionId: number) => {
    console.log(`Aceitar conexão ${connectionId}`);
  };

  const handleDeclineConnection = (connectionId: number) => {
    console.log(`Recusar conexão ${connectionId}`);
  };

  // Check-ins públicos de amigos
  const friendCheckins = [
    {
      id: 1,
      friend: {
        name: "Ana Costa",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
      },
      venue: "Bar do João",
      time: "há 5 min",
      isPublic: true
    },
    {
      id: 2,
      friend: {
        name: "João Santos",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
      },
      venue: "Café Central",
      time: "há 15 min",
      isPublic: true
    },
    {
      id: 3,
      friend: {
        name: "Maria Silva",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
      },
      venue: "Pizzaria Bella Vista",
      time: "há 30 min",
      isPublic: true
    }
  ];

  // Convites recebidos
  const invitations = [
    {
      id: 1,
      host: {
        name: "Júlia",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
      },
      title: "Festa de aniversário",
      venue: "Casa da Júlia",
      date: "Hoje",
      time: "20:00",
      urgency: 'happening_soon'
    },
    {
      id: 2,
      host: {
        name: "Pedro Lima",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
      },
      title: "Happy Hour",
      venue: "Bar Esportivo",
      date: "Amanhã",
      time: "18:00",
      urgency: 'normal'
    },
    {
      id: 3,
      host: {
        name: "Carlos",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
      },
      title: "Show de Jazz",
      venue: "Café Blues",
      date: "Sábado",
      time: "21:00",
      urgency: 'normal'
    }
  ];

  // Solicitações de amizade e conexão
  const connectionRequests = [
    {
      id: 1,
      person: {
        name: "Marina Santos",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
      },
      type: "friendship",
      mutualFriends: 3,
      time: "há 2h"
    },
    {
      id: 2,
      person: {
        name: "Rafael Costa",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
      },
      type: "connection",
      mutualInterests: ["Música", "Esportes"],
      time: "há 1h"
    },
    {
      id: 3,
      person: {
        name: "Fernanda Lima",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
      },
      type: "friendship",
      mutualFriends: 5,
      time: "há 30 min"
    }
  ];

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
          <h1 className="text-lg font-bold">Notificações</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6 pb-20">
        {/* Check-ins públicos de amigos */}
        {friendCheckins.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold flex items-center text-foreground">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              Check-ins de amigos
            </h3>
            {friendCheckins.map((checkin) => (
              <div key={checkin.id} className="bg-white rounded-lg p-4 shadow-sm border border-border">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={checkin.friend.avatar} alt={checkin.friend.name} />
                    <AvatarFallback>{checkin.friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {checkin.friend.name} fez check-in
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📍 {checkin.venue}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ⏰ {checkin.time}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/venue/${checkin.venue.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Convites recebidos */}
        {invitations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold flex items-center text-foreground">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              Convites recebidos
            </h3>
            {invitations.map((invitation) => (
              <div key={invitation.id} className={`bg-white rounded-lg p-4 shadow-sm border ${
                invitation.urgency === 'happening_soon' 
                  ? 'border-orange-200 bg-orange-50/50' 
                  : 'border-border'
              }`}>
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={invitation.host.avatar} alt={invitation.host.name} />
                    <AvatarFallback>{invitation.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {invitation.host.name} convidou você
                      </span>
                      {invitation.urgency === 'happening_soon' && (
                        <Badge className="text-xs bg-orange-100 text-orange-700">
                          ACONTECENDO EM BREVE
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-1">
                      {invitation.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📍 {invitation.venue}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📅 {invitation.date} • ⏰ {invitation.time}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeclineInvitation(invitation.id)}
                    className="flex-1 text-xs h-8"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Recusar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleAcceptInvitation(invitation.id)}
                    className="flex-1 text-xs h-8"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Aceitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Solicitações de amizade e conexão */}
        {connectionRequests.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold flex items-center text-foreground">
              <UserPlus className="w-4 h-4 mr-2 text-primary" />
              Solicitações
            </h3>
            {connectionRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg p-4 shadow-sm border border-border">
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={request.person.avatar} alt={request.person.name} />
                    <AvatarFallback>{request.person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground mb-1">
                      {request.person.name}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {request.type === 'friendship' ? 'quer ser seu amigo' : 'quer se conectar'}
                    </div>
                    {request.type === 'friendship' && (
                      <div className="text-xs text-muted-foreground">
                        👥 {request.mutualFriends} amigos em comum
                      </div>
                    )}
                    {request.type === 'connection' && (
                      <div className="text-xs text-muted-foreground">
                        💡 Interesses: {request.mutualInterests.join(', ')}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      ⏰ {request.time}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeclineConnection(request.id)}
                    className="flex-1 text-xs h-8"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Recusar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleAcceptConnection(request.id)}
                    className="flex-1 text-xs h-8"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Aceitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {friendCheckins.length === 0 && invitations.length === 0 && connectionRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold mb-2">Nenhuma notificação</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Você está em dia! Novas notificações aparecerão aqui.
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/social')}
            >
              Explorar pessoas
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
