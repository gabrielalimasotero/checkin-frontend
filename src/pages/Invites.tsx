import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Plus, Calendar, MapPin, Users, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type InviteTab = 'pending' | 'sent' | 'received';

const Invites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<InviteTab>('pending');
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [sentInvites, setSentInvites] = useState<any[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInvites = async () => {
      setIsLoading(true);
      try {
        // TODO: Implementar API para carregar convites pendentes
        // const pending = await listPendingInvites();
        // setPendingInvites(pending || []);
        setPendingInvites([]);

        // TODO: Implementar API para carregar convites enviados
        // const sent = await listSentInvites();
        // setSentInvites(sent || []);
        setSentInvites([]);

        // TODO: Implementar API para carregar convites recebidos
        // const received = await listReceivedInvites();
        // setReceivedInvites(received || []);
        setReceivedInvites([]);
      } catch (error) {
        console.error('Erro ao carregar convites:', error);
        setPendingInvites([]);
        setSentInvites([]);
        setReceivedInvites([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadInvites();
    }
  }, [user?.id]);

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      // TODO: Implementar API para aceitar convite
      // await acceptInvite(inviteId);
      console.log('Convite aceito:', inviteId);
      // Recarregar lista de convites
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      // TODO: Implementar API para recusar convite
      // await declineInvite(inviteId);
      console.log('Convite recusado:', inviteId);
      // Recarregar lista de convites
    } catch (error) {
      console.error('Erro ao recusar convite:', error);
    }
  };

  const handleCreateInvite = () => {
    // TODO: Navegar para página de criação de convite ou abrir modal
    console.log('Criar novo convite');
  };

  const getCurrentInvites = () => {
    switch (activeTab) {
      case 'pending':
        return pendingInvites;
      case 'sent':
        return sentInvites;
      case 'received':
        return receivedInvites;
      default:
        return [];
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'pending':
        return 'Nenhum convite pendente';
      case 'sent':
        return 'Nenhum convite enviado';
      case 'received':
        return 'Nenhum convite recebido';
      default:
        return 'Nenhum convite';
    }
  };

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-lg font-bold text-primary">Meus Convites</h1>
            </div>
            <Button
              onClick={handleCreateInvite}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Convite
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border">
        <div className="max-w-sm mx-auto">
          <div className="grid grid-cols-3 bg-transparent h-12">
            <button
              onClick={() => setActiveTab('pending')}
              className={`text-sm border-b-2 transition-colors ${
                activeTab === 'pending' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`text-sm border-b-2 transition-colors ${
                activeTab === 'sent' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Enviados
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`text-sm border-b-2 transition-colors ${
                activeTab === 'received' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Recebidos
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Carregando convites...</div>
          </div>
        ) : getCurrentInvites().length > 0 ? (
          <div className="space-y-4">
            {getCurrentInvites().map((invite) => (
              <Card key={invite.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={invite.organizer?.avatar} alt={invite.organizer?.name} />
                      <AvatarFallback>
                        {invite.organizer?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{invite.organizer?.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {invite.type === "event" ? "Evento" :
                           invite.type === "dinner" ? "Jantar" :
                           invite.type === "hangout" ? "Encontro" : "Atividade"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {invite.createdAt}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-primary">
                    {invite.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {invite.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    {invite.venue && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{invite.venue}</span>
                      </div>
                    )}
                    {invite.date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{invite.date}</span>
                      </div>
                    )}
                    {invite.attendees && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{invite.attendees} pessoas</span>
                      </div>
                    )}
                  </div>
                </div>

                {invite.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => handleAcceptInvite(invite.id)}
                    >
                      Aceitar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDeclineInvite(invite.id)}
                    >
                      Recusar
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground text-center">
              {getEmptyMessage()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invites;
