import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
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

  // Grupos do usuário baseados em interesses
  const [userGroups, setUserGroups] = useState([
    { id: 1, name: 'Turma da Champions', interests: ['Champions League'], members: 12, role: 'admin', nextEvent: 'Hoje 21:00' },
    { id: 2, name: 'Grupo da Sinuca', interests: ['Sinuca', 'Jogos'], members: 6, role: 'membro', nextEvent: 'Sexta 20:00' }
  ]);

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
      
      // Salvar no banco de dados
      console.log('🔄 Enviando requisição para o Supabase...');
      const { data, error } = await supabase
        .from('users')
        .update({
          name: editedName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Erro ao salvar perfil:', error);
        return;
      }

      console.log('✅ Perfil salvo com sucesso:', data);
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
      console.log('🔄 Carregando interesses do usuário:', user.id);
      
      const { data, error } = await supabase
        .from('user_interests')
        .select(`
          interest_id,
          interests (
            id,
            name
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erro ao carregar interesses:', error);
        return;
      }

      console.log('📋 Dados brutos dos interesses:', data);
      
      const interestNames = data?.map(item => {
        const interest = item.interests as any;
        return interest?.name;
      }).filter(Boolean) || [];
      
      setInterests(interestNames);
      console.log('✅ Interesses carregados com sucesso:', interestNames);
    } catch (error) {
      console.error('❌ Erro ao carregar interesses:', error);
    } finally {
      setIsLoadingInterests(false);
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
      console.log('💾 Salvando interesses no banco...');
      console.log('📋 Interesses a salvar:', tempSelectedInterests);
      
      // Primeiro, remover todos os interesses atuais do usuário
      const { error: deleteError } = await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('❌ Erro ao remover interesses antigos:', deleteError);
        return;
      }

      // Para cada interesse selecionado, verificar se existe na tabela interests
      for (const interestName of tempSelectedInterests) {
        // Verificar se o interesse já existe
        let { data: existingInterest, error: checkError } = await supabase
          .from('interests')
          .select('id')
          .eq('name', interestName)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('❌ Erro ao verificar interesse:', checkError);
          continue;
        }

        let interestId;

        if (!existingInterest) {
          // Criar novo interesse se não existir
          const { data: newInterest, error: createError } = await supabase
            .from('interests')
            .insert({ name: interestName })
            .select('id')
            .single();

          if (createError) {
            console.error('❌ Erro ao criar interesse:', createError);
            continue;
          }

          interestId = newInterest.id;
        } else {
          interestId = existingInterest.id;
        }

        // Adicionar relacionamento usuário-interesse
        const { error: insertError } = await supabase
          .from('user_interests')
          .insert({
            user_id: user.id,
            interest_id: interestId
          });

        if (insertError) {
          console.error('❌ Erro ao adicionar interesse do usuário:', insertError);
        }
      }

      // Atualizar estado local
      setInterests(tempSelectedInterests);
      setShowAddInterest(false);
      setTempSelectedInterests([]);
      
      console.log('✅ Interesses salvos com sucesso no banco!');
      
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
      console.log('🗑️ Removendo interesse:', interestToRemove);
      
      // Buscar o ID do interesse
      const { data: interestData, error: interestError } = await supabase
        .from('interests')
        .select('id')
        .eq('name', interestToRemove)
        .single();

      if (interestError) {
        console.error('❌ Erro ao buscar interesse:', interestError);
        return;
      }

      console.log('📋 ID do interesse encontrado:', interestData.id);

      // Remover relacionamento usuário-interesse
      const { error: removeError } = await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id)
        .eq('interest_id', interestData.id);

      if (removeError) {
        console.error('❌ Erro ao remover interesse:', removeError);
        return;
      }

      // Atualizar estado local
      setInterests(interests.filter(interest => interest !== interestToRemove));
      console.log('✅ Interesse removido com sucesso do banco:', interestToRemove);
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
    }
  }, [user?.id]);

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
            <div className="flex items-center space-x-1.5 mt-1">
              <Badge className="bg-primary-foreground/20 text-primary-foreground text-xs h-5 px-2">
                ✓ Conectável
              </Badge>
            </div>
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
