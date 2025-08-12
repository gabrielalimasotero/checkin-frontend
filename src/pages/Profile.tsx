import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { listInterests, createInterest, getUserInterests, addUserInterest, removeUserInterest, listGroups } from '@/lib/api';
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
import CreateGroupDialog from "@/components/CreateGroupDialog";

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  
  // Debug: log dos dados do usuário
  console.log('🔍 Profile - Dados do usuário:', user);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "Usuário");
  const [notifications, setNotifications] = useState(user?.notifications_enabled ?? true);
  const [privacy, setPrivacy] = useState<"public" | "friends" | "community" | "anonymous">("friends");
  
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
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  
  // Interesses do usuário
  const [interests, setInterests] = useState<string[]>([]);
  const [showAddInterest, setShowAddInterest] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [isLoadingInterests, setIsLoadingInterests] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Tags de interesses pré-definidas
  const availableInterests = [
    "Jazz ao vivo", "Música ambiente", "Voz e violão", "Sertanejo universitário", 
    "Funk ao vivo", "Eletrônica leve", "Forró e piseiro", "Samba e pagode", 
    "DJ residente", "Karaokê", "Música clássica", "Rock nacional", 
    "Ambiente intimista", "Espaço descontraído", "Clima romântico", "Pet friendly", 
    "Vista panorâmica", "Pôr do sol", "Rooftop", "Mesas compartilhadas", 
    "Lounge ao ar livre", "Iluminação aconchegante", "Jogo de futebol ao vivo", 
    "Transmissão de lutas (UFC, Boxe)", "Jogos de tabuleiro", "Mesa de sinuca", 
    "Stand-up comedy", "Pub quiz", "Noite de talentos", "Open mic", 
    "Exposição de arte", "Show de mágica", "Espaço gamer", "Ambiente climatizado", 
    "Acessibilidade", "Reservas antecipadas", "Música ao vivo todos os dias", 
    "Espaço instagramável", "Estacionamento próprio", "Busca lugar tranquilo", 
    "Gosta de ambientes movimentados", "Curtir dançar", "Prefere locais reservados", 
    "Interesse por esportes", "Interesse por cultura", "Vai pelo som", 
    "Vai pela experiência", "Gosta de conversar", "Aprecia vista bonita"
  ];
  
  // Estado para interesses temporários (antes de salvar)
  const [tempSelectedInterests, setTempSelectedInterests] = useState<string[]>([]);

  // Grupos do usuário serão obtidos da API
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Estados para estatísticas reais
  const [stats, setStats] = useState({
    checkins: 0,
    reviews: 0,
    friends: 0,
    badges: 0
  });
  const [checkinsData, setCheckinsData] = useState<any[]>([]);
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [friendsData, setFriendsData] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('🚪 Iniciando logout do perfil...');
      setIsLoggingOut(true);
      await logout();
      console.log('✅ Logout concluído, redirecionando...');
      navigate("/");
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      setIsLoggingOut(false);
      // Mesmo com erro, redirecionar para a página inicial
      navigate("/");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('💾 Salvando alterações do perfil...');
      console.log('📋 Nome a ser salvo:', editedName);
      console.log('📋 ID do usuário:', user?.id);
      
      if (!user?.id) {
        console.error('❌ ID do usuário não encontrado');
        setIsSaving(false);
        return;
      }
      
      // Salvar no backend
      const { updateUser } = await import('@/lib/api');
      await updateUser(user.id, { name: editedName });
      console.log('✅ Perfil salvo com sucesso no backend');
      setIsEditing(false);
      await refreshUser();
    } catch (err) {
      console.error('❌ Erro ao salvar perfil:', err);
    } finally {
      console.log('🔄 Finalizando save, isLoading = false');
      setIsSaving(false);
    }
  };

  // Carregar interesses do usuário
  const loadUserInterests = async () => {
    if (!user?.id) {
      console.log('❌ Usuário não autenticado, não é possível carregar interesses');
      return;
    }
    
    try {
      setIsLoadingInterests(true);
      console.log('🔄 Carregando interesses do usuário (backend):', user.id);
      const data = await getUserInterests(user.id);
      const interestNames = (data || []).map(i => i.name).filter(Boolean) as string[];
      setInterests(interestNames);
      console.log('✅ Interesses carregados com sucesso do backend:', interestNames);
    } catch (error) {
      console.error('❌ Erro ao carregar interesses:', error);
    } finally {
      setIsLoadingInterests(false);
    }
  };

  const loadUserGroups = async () => {
    if (!user?.id) {
      console.log('❌ Usuário não autenticado, não é possível carregar grupos');
      return;
    }
    
    try {
      setIsLoadingGroups(true);
      console.log('🔄 Carregando grupos do usuário (backend):', user.id);
      // TODO: Implementar filtro por usuário quando estiver disponível na API
      const allGroups = await listGroups({ limit: 50 });
      // Por enquanto, filtrar do lado cliente (não ideal, mas funcional)
      // const userGroups = allGroups.filter(g => g.created_by === user.id || g.members?.includes(user.id));
      // Como não temos essa info, vamos usar lista vazia por enquanto
      setUserGroups([]);
      console.log('✅ Grupos carregados:', []);
    } catch (error) {
      console.error('❌ Erro ao carregar grupos:', error);
      setUserGroups([]);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // Função para abrir o modal de seleção de interesses
  const openInterestSelector = () => {
    setTempSelectedInterests([...interests]); // Inicializar com interesses atuais
    setShowAddInterest(true);
  };

  // Função para fechar o modal
  const closeInterestSelector = () => {
    setShowAddInterest(false);
    setTempSelectedInterests([]);
  };

  // Função para alternar seleção de interesse
  const toggleInterest = (interest: string) => {
    setTempSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  // Função para salvar interesses selecionados
  const saveInterests = async () => {
    if (!user?.id) {
      console.error('❌ Usuário não autenticado');
      return;
    }

    try {
      setIsLoadingInterests(true);
      console.log('💾 Salvando interesses no backend...');
      console.log('📋 Interesses a salvar:', tempSelectedInterests);
      // Buscar catálogo de interesses para mapear nome -> id
      const catalog = await listInterests();
      const nameToId = new Map(catalog.map(i => [i.name, i.id] as const));
      // Primeiro, remover todos os interesses atuais
      const current = await getUserInterests(user.id);
      for (const it of current) {
        await removeUserInterest(user.id, it.id);
      }
      // Inserir os selecionados (criando no catálogo se necessário)
      for (const interestName of tempSelectedInterests) {
        let interestId = nameToId.get(interestName);
        if (!interestId) {
          const created = await createInterest(interestName);
          interestId = created.id;
          nameToId.set(interestName, interestId);
        }
        await addUserInterest(user.id, interestId);
      }

      setInterests(tempSelectedInterests);
      setShowAddInterest(false);
      setTempSelectedInterests([]);
      console.log('✅ Interesses salvos com sucesso no backend!');
    } catch (error) {
      console.error('❌ Erro ao salvar interesses:', error);
    } finally {
      setIsLoadingInterests(false);
    }
  };

  const removeInterest = async (interestToRemove: string) => {
    if (!user?.id) {
      console.error('❌ Usuário não autenticado');
      return;
    }

    try {
      setIsLoadingInterests(true);
      console.log('🗑️ Removendo interesse (backend):', interestToRemove);
      const catalog = await listInterests();
      const interest = catalog.find(i => i.name === interestToRemove);
      if (interest?.id) {
        await removeUserInterest(user.id, interest.id);
        setInterests(interests.filter(interest => interest !== interestToRemove));
        console.log('✅ Interesse removido com sucesso do backend:', interestToRemove);
      }
    } catch (error) {
      console.error('❌ Erro ao remover interesse:', error);
    } finally {
      setIsLoadingInterests(false);
    }
  };

  const removeGroup = (groupId: number) => {
    setUserGroups(prev => prev.filter(g => g.id !== groupId));
  };

  // Atualizar editedName quando user mudar
  useEffect(() => {
    if (user?.name) {
      setEditedName(user.name);
    }
  }, [user?.name]);

  // Carregar interesses quando o usuário estiver disponível
  useEffect(() => {
    if (user?.id) {
      loadUserInterests();
      loadUserGroups();
      loadUserStats();
    }
  }, [user?.id]);

  // Função para carregar estatísticas do usuário
  const loadUserStats = async () => {
    if (!user?.id) {
      console.log('❌ Usuário não autenticado, não é possível carregar estatísticas');
      return;
    }
    
    try {
      setIsLoadingStats(true);
      console.log('🔄 Carregando estatísticas do usuário (backend):', user.id);
      
      // TODO: Implementar endpoints para estatísticas quando estiverem disponíveis
      // const userCheckins = await getUserCheckins(user.id);
      // const userReviews = await getUserReviews(user.id);
      // const userFriends = await getUserFriends(user.id);
      // const userBadges = await getUserBadges(user.id);
      
      // Por enquanto, usar contadores zerados até implementar API
      setStats({
        checkins: 0,
        reviews: 0,
        friends: 0,
        badges: 0
      });
      setCheckinsData([]);
      setReviewsData([]);
      setFriendsData([]);
      
      console.log('✅ Estatísticas carregadas (vazias por enquanto)');
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      setStats({ checkins: 0, reviews: 0, friends: 0, badges: 0 });
      setCheckinsData([]);
      setReviewsData([]);
      setFriendsData([]);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Badges serão obtidos da API
  const [badgesData, setBadgesData] = useState<any[]>([]);

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 p-3 text-primary-foreground">
        <div className="flex justify-between items-start mb-3">
          {/* User Info - Layout mais compacto */}
          <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 border-2 border-primary-foreground/20">
            <AvatarImage src={user?.avatar_url} />
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
                <h2 className="text-lg font-bold truncate">{user?.name || "Usuário"}</h2>
                <p className="text-primary-foreground/70 text-xs">{user?.email || "email@example.com"}</p>
              </>
            )}

          </div>
          <div className="flex space-x-1">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(user?.name || "Usuário"); // Reset para o valor original
                  }}
                  disabled={isSaving}
                  className="text-primary-foreground hover:bg-primary-foreground/20 p-1.5 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-primary-foreground hover:bg-primary-foreground/20 p-1.5 h-auto"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <div className="w-4 h-4 text-primary-foreground">✓</div>
                  )}
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-primary-foreground hover:bg-primary-foreground/20 p-1.5 h-auto"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-1.5 h-auto"
          >
            {isLoggingOut ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

        {/* Stats - Layout mais compacto */}
        <div className="grid grid-cols-3 gap-3 bg-primary-foreground/10 rounded-lg p-2">
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
            {/* Lista de interesses atuais */}
            {interests.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {interests.map((interest) => (
                  <div 
                    key={interest} 
                    className="relative p-2 bg-accent border border-border rounded-md hover:bg-accent/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white pr-6 truncate">
                        {interest}
                      </span>
                      <button 
                        onClick={() => removeInterest(interest)} 
                        className="absolute top-1 right-1 p-0.5 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        disabled={isLoadingInterests}
                      >
                        {isLoadingInterests ? (
                          <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X className="w-2.5 h-2.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botão para adicionar/editar interesses */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openInterestSelector}
              className="w-full"
              disabled={isLoadingInterests}
            >
              {isLoadingInterests ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {interests.length === 0 ? 'Adicionar Interesses' : 'Editar Interesses'}
            </Button>

            {/* Modal de seleção de interesses */}
            {showAddInterest && (
              <Dialog open={showAddInterest} onOpenChange={setShowAddInterest}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Selecionar Interesses</DialogTitle>
                    <DialogDescription>
                      Escolha os interesses que melhor representam você. Você pode selecionar quantos quiser.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {availableInterests.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-2 text-sm rounded-md border transition-colors ${
                          tempSelectedInterests.includes(interest)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-accent'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  
                  <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={closeInterestSelector}>
                      Cancelar
                    </Button>
                    <Button onClick={saveInterests} disabled={isLoadingInterests}>
                      {isLoadingInterests ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        'Salvar'
                      )}
                      Salvar ({tempSelectedInterests.length} selecionados)
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-xs"
                onClick={() => setShowCreateGroupDialog(true)}
              >
                <Users className="w-3 h-3 mr-1" />
                Grupo
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              Crie eventos e grupos para conectar com pessoas que compartilham seus interesses
            </p>
          </div>
        </Card>
      </div>

      {/* Navigation */}
      <MainNavigation />

      {/* Dialogs */}
      <CreateGroupDialog 
        isOpen={showCreateGroupDialog} 
        onClose={() => setShowCreateGroupDialog(false)} 
      />
    </div>
  );
};

export default Profile;
