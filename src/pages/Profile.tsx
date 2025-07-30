import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  User, 
  MapPin, 
  Star, 
  Settings, 
  LogOut, 
  Edit3, 
  Bell,
  Users,
  Camera,
  Award,
  Plus,
  Calendar,
  Tag,
  X,
  Trash2
} from "lucide-react";
import MainNavigation from "@/components/MainNavigation";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("Carlos Mendonça");
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);
  const [privacy, setPrivacy] = useState<"public" | "friends" | "community" | "anonymous">(user?.preferences?.privacy || "friends");
  
  // New privacy settings
  const [profileVisibility, setProfileVisibility] = useState<"friends" | "network">("friends");
  const [autoCheckin, setAutoCheckin] = useState<"public" | "anonymous">("public");
  const [allowMessages, setAllowMessages] = useState<"friends" | "network" | "everyone">("friends");
  const [reviewDelay, setReviewDelay] = useState<"immediate" | "1h" | "1d" | "7d">("immediate");
  
  // Estados para os dialogs de detalhamento
  const [showCheckinsDialog, setShowCheckinsDialog] = useState(false);
  const [showReviewsDialog, setShowReviewsDialog] = useState(false);
  const [showFriendsDialog, setShowFriendsDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  
  
  // Interesses do usuário
  const [interests, setInterests] = useState([
    "Champions League", "Futebol", "Craft Beer", "Pizza", "Rock", "Jazz", "Academia"
  ]);
  const [showAddInterest, setShowAddInterest] = useState(false);
  const [newInterest, setNewInterest] = useState("");

  // Grupos do usuário baseados em interesses
  const [userGroups, setUserGroups] = useState([
    { id: 1, name: 'Turma da Champions', interests: ['Champions League'], members: 12, role: 'admin', nextEvent: 'Hoje 21:00' },
    { id: 2, name: 'Grupo da Sinuca', interests: ['Sinuca', 'Jogos'], members: 6, role: 'membro', nextEvent: 'Sexta 20:00' }
  ]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aqui salvaria as alterações na API/contexto
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
      setShowAddInterest(false);
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const removeGroup = (groupId: number) => {
    setUserGroups(prev => prev.filter(g => g.id !== groupId));
  };

  // Stats
  const stats = {
    checkins: 47,
    reviews: 23,
    friends: 156,
    badges: 8
  };

  // Dados detalhados para os dialogs
  const checkinsData = [
    { id: 1, venue: "Boteco da Maria", date: "Hoje", rating: 5, spent: 45.80 },
    { id: 2, venue: "Café Central", date: "Ontem", rating: 4, spent: 28.50 },
    { id: 3, venue: "Bar do João", date: "2 dias atrás", rating: 5, spent: 67.20 },
    { id: 4, venue: "Pizza Express", date: "3 dias atrás", rating: 3, spent: 52.90 }
  ];

  const reviewsData = [
    { id: 1, venue: "Boteco da Maria", rating: 5, comment: "Ambiente incrível!", date: "Hoje" },
    { id: 2, venue: "Café Central", rating: 4, comment: "Bom café e atendimento", date: "Ontem" },
    { id: 3, venue: "Bar do João", rating: 5, comment: "Melhor happy hour da cidade", date: "2 dias atrás" }
  ];

  const friendsData = [
    { id: 1, name: "Ana Silva", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop", mutualFriends: 12, lastSeen: "Boteco da Maria" },
    { id: 2, name: "João Santos", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop", mutualFriends: 8, lastSeen: "Café Central" },
    { id: 3, name: "Maria Costa", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop", mutualFriends: 15, lastSeen: "Bar do Rock" }
  ];

  const badgesData = [
    { id: 1, name: "Explorador", description: "Visitou 10+ lugares diferentes", icon: "🗺️", earned: "Há 3 dias" },
    { id: 2, name: "Social", description: "Conectou com 50+ pessoas", icon: "👥", earned: "Há 1 semana" },
    { id: 3, name: "Crítico", description: "Fez 20+ avaliações", icon: "⭐", earned: "Há 2 semanas" },
    { id: 4, name: "Fotógrafo", description: "Compartilhou 30+ fotos", icon: "📷", earned: "Há 1 mês" }
  ];

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 p-3 text-primary-foreground">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-base font-bold">Meu Perfil</h1>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-primary-foreground/70" />
              <span className="text-xs text-primary-foreground/70">Recife</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-1.5 h-auto"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* User Info - Layout mais compacto */}
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-12 h-12 border-2 border-primary-foreground/20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary-foreground text-primary font-bold text-sm">
              CM
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder-primary-foreground/70 h-8 text-sm"
                placeholder="Seu nome"
              />
            ) : (
              <>
                <h2 className="text-lg font-bold truncate">Carlos Mendonça</h2>
                <p className="text-primary-foreground/70 text-xs">@carlosm_recife</p>
              </>
            )}
            <div className="flex items-center space-x-1.5 mt-1">
              <Badge className="bg-primary-foreground/20 text-primary-foreground text-xs h-5 px-2">
                ✓ Conectável
              </Badge>
              <Badge className="bg-primary-foreground/20 text-primary-foreground text-xs h-5 px-2">
                🏆 Nível 5
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-1.5 h-auto"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats - Layout mais compacto */}
        <div className="grid grid-cols-4 gap-3 bg-primary-foreground/10 rounded-lg p-2">
          <button 
            onClick={() => setShowCheckinsDialog(true)}
            className="text-center hover:bg-primary-foreground/10 rounded-md p-1 transition-colors"
          >
            <div className="text-base font-bold">{stats.checkins}</div>
            <div className="text-xs text-primary-foreground/70">Check-ins</div>
          </button>
          <button 
            onClick={() => setShowReviewsDialog(true)}
            className="text-center hover:bg-primary-foreground/10 rounded-md p-1 transition-colors"
          >
            <div className="text-base font-bold">{stats.reviews}</div>
            <div className="text-xs text-primary-foreground/70">Avaliações</div>
          </button>
          <button 
            onClick={() => setShowFriendsDialog(true)}
            className="text-center hover:bg-primary-foreground/10 rounded-md p-1 transition-colors"
          >
            <div className="text-base font-bold">{stats.friends}</div>
            <div className="text-xs text-primary-foreground/70">Amigos</div>
          </button>
          <button 
            onClick={() => setShowBadgesDialog(true)}
            className="text-center hover:bg-primary-foreground/10 rounded-md p-1 transition-colors"
          >
            <div className="text-base font-bold">{stats.badges}</div>
            <div className="text-xs text-primary-foreground/70">Badges</div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 pb-20 space-y-4">
        {/* Interesses */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Meus Interesses
          </h3>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge key={interest} variant="accept" className="text-sm font-semibold flex items-center">
                  {interest}
                  <button onClick={() => removeInterest(interest)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {showAddInterest ? (
              <div className="flex space-x-2">
                <Input
                  placeholder="Novo interesse..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  className="flex-1"
                />
                <Button size="sm" onClick={addInterest}>
                  Adicionar
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddInterest(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Interesse
              </Button>
            )}
            
            <p className="text-xs text-gray-500">
              Seus interesses ajudam a personalizar seu feed e conectar você com pessoas similares
            </p>
          </div>
        </Card>

        {/* Grupos */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Meus Grupos
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-xs h-8"
              >
                <Users className="w-3 h-3 mr-1" />
                Gerenciar
              </Button>
              <Button 
                variant="outline"
                className="w-full text-xs h-8 border-primary/50 text-primary"
                onClick={() => navigate('/social?tab=grupos')}
              >
                <Calendar className="w-3 h-3 mr-1" />
                Explorar
              </Button>
            </div>

            <div className="space-y-2">
              {userGroups.map((group) => (
                <div key={group.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{group.name}</h4>
                    <div className="flex items-center space-x-2 mb-1">
                      {group.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs px-2 py-1">{interest}</Badge>
                      ))}
                      {group.role === 'admin' && (
                        <Badge className="text-xs bg-primary/10 text-primary">Admin</Badge>
                      )}
                    </div>
                    {group.nextEvent && (
                      <p className="text-xs text-muted-foreground mt-1">📅 {group.nextEvent}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-gray-500">{group.members} membros</span>
                    <div className="flex items-center space-x-1">
                      {group.role === 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 text-primary hover:bg-primary/10"
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGroup(group.id)}
                        className="w-6 h-6 p-0 text-red-500 hover:bg-red-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Criar (Evento e Grupo) */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Criar
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Evento
              </Button>
              <Button className="w-full bg-accent hover:bg-accent/90 text-xs">
                <Users className="w-3 h-3 mr-1" />
                Grupo
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              Grupos conectam pessoas com interesses similares em um raio próximo. Receba convites automáticos para eventos baseados nos seus interesses!
            </p>
          </div>
        </Card>


        {/* Settings */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Notificações</p>
                <p className="text-xs text-gray-500">Receber alertas sobre atividades</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Privacidade do Perfil</p>
              <Select value={profileVisibility} onValueChange={(value: "friends" | "network") => setProfileVisibility(value)}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friends">👥 Amigos</SelectItem>
                  <SelectItem value="network">🌐 Rede (amigos de amigos)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Check-in Automático</p>
              <Select value={autoCheckin} onValueChange={(value: "public" | "anonymous") => setAutoCheckin(value)}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">🌍 Público</SelectItem>
                  <SelectItem value="anonymous">🥸 Anônimo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Permitir mensagens de</p>
              <Select value={allowMessages} onValueChange={(value: "friends" | "network" | "everyone") => setAllowMessages(value)}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friends">👥 Meus amigos</SelectItem>
                  <SelectItem value="network">🌐 Da rede</SelectItem>
                  <SelectItem value="everyone">🌍 De todos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Postar minha avaliação</p>
              <Select value={reviewDelay} onValueChange={(value: "immediate" | "1h" | "1d" | "7d") => setReviewDelay(value)}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">⚡ Imediatamente</SelectItem>
                  <SelectItem value="1h">⏰ Em 1 hora</SelectItem>
                  <SelectItem value="1d">📅 Em 1 dia</SelectItem>
                  <SelectItem value="7d">🗓️ Em 7 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Badges */}
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <h3 className="font-semibold mb-3 flex items-center text-foreground">
            <Award className="w-4 h-4 mr-2" />
            Conquistas
          </h3>
          
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl flex items-center justify-center mb-1 mx-auto shadow-lg border-2 border-primary/40">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <p className="text-xs text-foreground font-medium">Explorador</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/30 rounded-xl flex items-center justify-center mb-1 mx-auto shadow-lg border-2 border-accent/40">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <p className="text-xs text-foreground font-medium">Social</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/30 rounded-xl flex items-center justify-center mb-1 mx-auto shadow-lg border-2 border-secondary/40">
                <Star className="w-6 h-6 text-secondary-foreground" />
              </div>
              <p className="text-xs text-foreground font-medium">Crítico</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-muted/40 to-muted/60 rounded-xl flex items-center justify-center mb-1 mx-auto shadow-lg border-2 border-muted">
                <Camera className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-xs text-foreground font-medium">Fotógrafo</p>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-primary">✨ Continue explorando para desbloquear mais conquistas!</p>
          </div>
        </Card>
      </div>


      <MainNavigation />

      {/* Dialogs de detalhamento */}
      
      {/* Dialog Check-ins */}
      <Dialog open={showCheckinsDialog} onOpenChange={setShowCheckinsDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Meus Check-ins ({stats.checkins})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {checkinsData.map((checkin) => (
              <div key={checkin.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{checkin.venue}</h4>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{checkin.date}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      {Array.from({ length: checkin.rating }, (_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </span>
                    <span>•</span>
                    <span className="text-primary font-medium">R$ {checkin.spent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Avaliações */}
      <Dialog open={showReviewsDialog} onOpenChange={setShowReviewsDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Minhas Avaliações ({stats.reviews})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reviewsData.map((review) => (
              <div key={review.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{review.venue}</h4>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Amigos */}
      <Dialog open={showFriendsDialog} onOpenChange={setShowFriendsDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Meus Amigos ({stats.friends})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {friendsData.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{friend.name}</h4>
                  <div className="text-xs text-muted-foreground">
                    <span>{friend.mutualFriends} amigos em comum</span>
                    <span className="mx-1">•</span>
                    <span>Último em: {friend.lastSeen}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Ver perfil
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Badges */}
      <Dialog open={showBadgesDialog} onOpenChange={setShowBadgesDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Minhas Conquistas ({stats.badges})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {badgesData.map((badge) => (
              <div key={badge.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl flex items-center justify-center text-lg">
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{badge.description}</p>
                  <span className="text-xs text-primary">Conquistado {badge.earned}</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
