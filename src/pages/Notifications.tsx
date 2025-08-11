
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, Clock, Users, Check, X, Heart, Calendar, UserPlus } from 'lucide-react';
import { listNotifications } from '@/lib/api';

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await listNotifications({ limit: 50 });
        // Mapear para formato da UI atual (temporário)
        const mapped = data.map((n) => {
          if (n.type === 'event_reminder') {
            return {
              id: n.id,
              type: 'event_reminder',
              title: n.title,
              venue: n.data?.venue || '',
              date: n.data?.date || '',
              time: n.data?.time || '',
              timeAgo: '',
            };
          }
          if (n.type === 'checkin') {
            return {
              id: n.id,
              type: 'checkin',
              friend: {
                name: n.data?.friend_name || 'Amigo',
                avatar: n.data?.friend_avatar || '',
              },
              venue: n.data?.venue || '',
              timeAgo: '',
            };
          }
          if (n.type === 'connection') {
            return {
              id: n.id,
              type: 'connection',
              person: {
                name: n.data?.person_name || 'Pessoa',
                avatar: n.data?.person_avatar || '',
              },
              mutualFriends: n.data?.mutualFriends || 0,
              mutualInterests: n.data?.mutualInterests || [],
              timeAgo: '',
            };
          }
          // Fallback genérico
          return {
            id: n.id,
            type: 'event_reminder',
            title: n.title,
            venue: n.message,
            date: '',
            time: '',
            timeAgo: '',
          };
        });
        setNotifications(mapped);
      } catch (e) {
        console.error('Erro ao carregar notificações:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleAcceptConnection = (connectionId: number) => {
    console.log(`Aceitar conexão ${connectionId}`);
  };

  const handleDeclineConnection = (connectionId: number) => {
    console.log(`Recusar conexão ${connectionId}`);
  };

  const allNotifications = notifications;





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
        <div className="p-4 space-y-4 pb-20">
        {/* Lista única de notificações */}
        {allNotifications.map((notification) => {
          // Renderizar lembrete de evento
          if (notification.type === "event_reminder") {
            return (
              <div key={notification.id} className="bg-white rounded-lg p-4 shadow-sm border-2 border-primary/30 bg-primary/5">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground mb-1">
                      {notification.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {notification.venue}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {notification.date} • {notification.time}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {notification.timeAgo}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Renderizar check-in
          if (notification.type === "checkin") {
            return (
              <div key={notification.id} className="bg-white rounded-lg p-4 shadow-sm border border-border/50">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={notification.friend.avatar} alt={notification.friend.name} />
                    <AvatarFallback>{notification.friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {notification.friend.name} fez check-in
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {notification.venue}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {notification.timeAgo}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/venue/${notification.venue.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    Ver
                  </Button>
                </div>
              </div>
            );
          }

          // Renderizar solicitação de conexão
          if (notification.type === "connection") {
            return (
              <div key={notification.id} className="bg-white rounded-lg p-4 shadow-sm border border-border/50">
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={notification.person.avatar} alt={notification.person.name} />
                    <AvatarFallback>{notification.person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground mb-1">
                      {notification.person.name}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {notification.type === 'friendship' ? 'quer ser seu amigo' : 'quer se conectar'}
                    </div>
                    {notification.type === 'friendship' && (
                      <div className="text-xs text-muted-foreground">
                        {notification.mutualFriends} amigos em comum
                      </div>
                    )}
                    {notification.type === 'connection' && (
                      <div className="text-xs text-muted-foreground">
                        Interesses: {notification.mutualInterests.join(', ')}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {notification.timeAgo}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeclineConnection(notification.id)}
                    className="flex-1 text-xs h-8"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Recusar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleAcceptConnection(notification.id)}
                    className="flex-1 text-xs h-8"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Aceitar
                  </Button>
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* Estado vazio */}
        {(!isLoading && allNotifications.length === 0) && (
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
