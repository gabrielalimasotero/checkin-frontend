import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, MapPin, Star, Verified, MoreHorizontal, Trash2, Calendar, Users } from "lucide-react";
import { listUserFriends, listUserCheckins, getUser, listIncomingFriendRequests } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const NetworkTab = () => {
  const { user: currentUser } = useAuth();
  const [statusText, setStatusText] = useState("");
  const [deletedPosts, setDeletedPosts] = useState<number[]>([]);
  const [showInvitations, setShowInvitations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!currentUser?.id) return;
      try {
        setIsLoading(true);
        // Carregar amigos
        const friends = await listUserFriends(currentUser.id).catch(() => []);
        const friendIds = friends.map((f: any) => f.id);
        const ids = [currentUser.id, ...friendIds];
        // Carregar checkins recentes para cada usuário
        const checkinsArrays = await Promise.all(ids.map((uid) => listUserCheckins(uid, { limit: 5 }))); 
        const all = checkinsArrays.flat();
        // Carregar dados dos usuários vinculados aos checkins
        const uniqueUserIds = Array.from(new Set(all.map((c: any) => c.user_id)));
        const users = await Promise.all(uniqueUserIds.map((uid) => getUser(uid).catch(() => null)));
        const userMap = new Map(users.filter(Boolean).map((u: any) => [u.id, u]));
        // Mapear para posts do feed
        const posts = all
          .sort((a: any, b: any) => (new Date(b.created_at || '').getTime()) - (new Date(a.created_at || '').getTime()))
          .map((c: any) => {
            const u = userMap.get(c.user_id);
            return {
              id: c.id,
              type: 'checkin',
              user: {
                name: u?.name || 'Usuário',
                avatar: u?.avatar_url || '',
                verified: false,
              },
              time: '',
              content: c.review || '',
              likes: 0,
              comments: 0,
              location: '',
              rating: c.rating || 0,
            };
          });
        setFeedPosts(posts);
        // Carregar convites (usar solicitações de amizade como placeholder de convites)
        const requests = await listIncomingFriendRequests().catch(() => []);
        const mappedInvites = (requests || []).map((r: any) => ({
          id: r.id,
          type: 'friendship',
          title: 'Novo pedido de amizade',
          organizer: { name: 'Usuário', avatar: '' },
          venue: '',
          date: '',
          attendees: 0,
          description: 'Você tem um novo pedido de amizade',
          time: '',
          status: 'pending',
        }));
        setReceivedInvitations(mappedInvites);
      } catch (e) {
        console.error('Erro ao carregar feed:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [currentUser?.id]);

  const filteredPosts = useMemo(() => feedPosts.filter((post) => !deletedPosts.includes(post.id)), [feedPosts, deletedPosts]);

  const handleUpdateStatus = () => {
    if (statusText.trim()) {
      console.log("Status atualizado:", statusText);
      setStatusText("");
    }
  };

  const handleDeletePost = (postId: number) => {
    setDeletedPosts(prev => [...prev, postId]);
  };

  const handleAcceptInvitation = (invitationId: number) => {
    console.log("Convite aceito:", invitationId);
  };

  const handleDeclineInvitation = (invitationId: number) => {
    console.log("Convite recusado:", invitationId);
  };

  const toggleInvitations = () => {
    setShowInvitations(!showInvitations);
  };

  return (
    <div className="p-4 space-y-4 pb-24">{/* Extra padding for bottom navigation */}
      {/* Botão "Meus Convites" */}
      <div className="space-y-4">
        <Button 
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold"
          onClick={toggleInvitations}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Meus Convites
        </Button>
      </div>

      {/* Convites Expandidos */}
      {showInvitations && receivedInvitations.length > 0 && (
        <div className="space-y-3">
          {receivedInvitations.map((invitation) => (
            <Card key={invitation.id} className={`p-4 border-2 ${
              invitation.status === "accepted" 
                ? "border-green-200 bg-green-50/50" 
                : "border-primary/20 bg-primary/5"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={invitation.organizer.avatar} alt={invitation.organizer.name} />
                    <AvatarFallback>{invitation.organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{invitation.organizer.name}</span>
                      <Badge className={`text-xs ${
                        invitation.status === "accepted" 
                          ? "bg-green-500 text-white" 
                          : "bg-primary text-primary-foreground"
                      }`}>
                        {invitation.status === "accepted" ? "Aceito" : (
                          invitation.type === "event" ? "Evento" :
                          invitation.type === "dinner" ? "Jantar" :
                          "Atividade"
                        )}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{invitation.time}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h4 className={`font-semibold ${invitation.status === "accepted" ? "text-green-700" : "text-primary"}`}>
                  {invitation.title}
                </h4>
                <p className="text-sm text-muted-foreground">{invitation.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{invitation.venue}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{invitation.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{invitation.attendees} pessoas</span>
                  </div>
                </div>
              </div>

              {invitation.status === "pending" ? (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleAcceptInvitation(invitation.id)}
                  >
                    Aceitar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDeclineInvitation(invitation.id)}
                  >
                    Recusar
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
                  >
                    Ver Detalhes
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Status Composer */}
      <Card className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="No que você está pensando?"
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="text-xs text-muted-foreground">
                {statusText.length}/280
              </div>
              <Button 
                size="sm" 
                onClick={handleUpdateStatus}
                disabled={!statusText.trim()}
              >
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Network Feed */}
      {filteredPosts.map((post) => (
        <Card key={post.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-semibold">{post.user.name}</span>
                  {post.user.verified && (
                    <Verified className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center">
                  {post.location && (
                    <>
                      <MapPin className="w-3 h-3 inline-block mr-1" />
                      {post.location} • 
                    </>
                  )}
                  {post.time}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-sm">{post.content}</p>
            
            {post.rating && (
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < post.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  {post.rating}/5
                </span>
              </div>
            )}

            {post.image && (
              <img 
                src={post.image} 
                alt="Post image"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.comments}</span>
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 text-muted-foreground hover:text-destructive"
                onClick={() => handleDeletePost(post.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NetworkTab;