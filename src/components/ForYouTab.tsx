import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, MapPin, Star, Calendar, Heart, ArrowLeft, UserPlus, UserCheck, Users2, User } from "lucide-react";
import { listVenues, listEvents, listUserFriends, listGroups } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  COMPONENT_VARIANTS, 
  COMMON_CLASSES, 
  LAYOUT,
  INTERACTIVE 
} from '@/lib/design-system';

// Tipos de estado para o fluxo
type FlowState = 'main' | 'filters' | 'friends' | 'groups' | 'date' | 'explore';

const ForYouTab = () => {
  const [flowState, setFlowState] = useState<FlowState>('main');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  // Filtros para "Quero sair"
  const wantToGoFilters = [
    { id: "solo", label: "Sozinho", description: "Atividades para fazer sozinho" },
    { id: "friends", label: "Com amigos", description: "Selecionar amigos ou conhecer pessoas" },
    { id: "date", label: "A dois", description: "Selecionar pessoa ou conhecer alguém" },
    { id: "groups", label: "Grupos", description: "Selecionar grupo ou conhecer grupos" },
  ];

  const { user: currentUser } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);

  const [groups, setGroups] = useState<any[]>([]);

  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Carregar alguns venues e eventos para sugerir
        const [venues, events, myFriends, allGroups] = await Promise.all([
          listVenues({ limit: 5, sort_by: 'rating', sort_order: 'desc' }),
          listEvents({ limit: 5 }),
          currentUser?.id ? listUserFriends(currentUser.id) : Promise.resolve([]),
          listGroups({ limit: 10 }),
        ]);
        setFriends(myFriends || []);
        setGroups(allGroups || []);
        const venueCards = (venues || []).map((v) => ({
          id: v.id,
          type: 'restaurant',
          name: v.name,
          category: v.category,
          description: v.description || '',
          image: v.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
          rating: v.rating ?? 0,
          distance: '',
          timeSlot: '',
          price: v.price_range || '$$',
          matchReason: 'Sugerido para você',
        }));
        const eventCards = (events || []).map((e) => ({
          id: e.id,
          type: 'event',
          name: e.title,
          venue: '',
          description: e.description || '',
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
          rating: 0,
          distance: '',
          timeSlot: e.start_time,
          price: '',
          matchReason: 'Evento recomendado',
          attendees: 0,
        }));
        setSuggestions([...venueCards, ...eventCards]);
      } catch (e) {
        console.error('Erro ao carregar sugestões:', e);
        setSuggestions([]);
      }
    };
    load();
  }, [currentUser?.id]);



  const handleWantToGo = () => {
    setFlowState('filters');
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
    if (filterId === 'solo') {
      // Para "sozinho", vai direto para o feed filtrado
      setFlowState('main');
    } else {
      // Para outros filtros, vai para a tela de seleção
      setFlowState(filterId as FlowState);
    }
  };

  const handleBack = () => {
    if (flowState === 'filters') {
      setFlowState('main');
    } else {
      setFlowState('filters');
    }
  };

  const handleSelectOption = (option: 'select' | 'explore') => {
    if (option === 'select') {
      // Manter na tela atual para seleção
      return;
    } else {
      // Ir para explorar
      setFlowState('explore');
    }
  };

  const handleBackToMain = () => {
    setFlowState('main');
    setSelectedFilter('');
  };

  // Renderizar filtros de "Quero sair"
  const renderWantToGoFilters = () => (
    <div className={`${LAYOUT.container} ${COMPONENT_VARIANTS.padding.lg} pb-20`}>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-bold">Quero sair</h2>
      </div>

      <div className={`${COMPONENT_VARIANTS.spacing.lg}`}>
        {wantToGoFilters.map((filter) => (
          <Card 
            key={filter.id}
            className={`${COMPONENT_VARIANTS.card.standard} ${INTERACTIVE.card} cursor-pointer`}
            onClick={() => handleFilterSelect(filter.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold">{filter.label}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Renderizar tela de amigos
  const renderFriendsScreen = () => (
    <div className={`${LAYOUT.container} ${COMPONENT_VARIANTS.padding.lg} pb-20`}>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-bold">Com amigos</h2>
      </div>

      <div className={`${COMPONENT_VARIANTS.spacing.lg}`}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => handleSelectOption('select')}
          >
            <UserCheck className="w-6 h-6 mb-2" />
            <span className="text-sm">Selecionar</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => handleSelectOption('explore')}
          >
            <UserPlus className="w-6 h-6 mb-2" />
            <span className="text-sm">Conhecer</span>
          </Button>
        </div>

        <div className={COMPONENT_VARIANTS.spacing.md}>
          {friends.map((friend) => (
            <Card key={friend.id} className={`${COMPONENT_VARIANTS.card.compact} ${INTERACTIVE.card}`}>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{friend.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {friend.status === 'online' ? 'Online' : 'Offline'}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Convidar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar tela de encontro
  const renderDateScreen = () => (
    <div className={`${LAYOUT.container} ${COMPONENT_VARIANTS.padding.lg} pb-20`}>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-bold">Encontro</h2>
      </div>

      <div className={`${COMPONENT_VARIANTS.spacing.lg}`}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => handleSelectOption('select')}
          >
            <UserCheck className="w-6 h-6 mb-2" />
            <span className="text-sm">Selecionar</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => handleSelectOption('explore')}
          >
            <UserPlus className="w-6 h-6 mb-2" />
            <span className="text-sm">Conhecer</span>
          </Button>
        </div>

        <div className={COMPONENT_VARIANTS.spacing.md}>
          {friends.filter(f => f.status === 'online').map((friend) => (
            <Card key={friend.id} className={`${COMPONENT_VARIANTS.card.compact} ${INTERACTIVE.card}`}>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{friend.name}</div>
                  <div className="text-xs text-muted-foreground">Online</div>
                </div>
                <Button variant="outline" size="sm">
                  Convidar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar tela de grupos
  const renderGroupsScreen = () => (
    <div className={`${LAYOUT.container} ${COMPONENT_VARIANTS.padding.lg} pb-20`}>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-bold">Grupos</h2>
      </div>

      <div className={`${COMPONENT_VARIANTS.spacing.lg}`}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => handleSelectOption('select')}
          >
            <UserCheck className="w-6 h-6 mb-2" />
            <span className="text-sm">Selecionar</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => handleSelectOption('explore')}
          >
            <UserPlus className="w-6 h-6 mb-2" />
            <span className="text-sm">Conhecer</span>
          </Button>
        </div>

        <div className={COMPONENT_VARIANTS.spacing.md}>
          {groups.map((group) => (
            <Card key={group.id} className={`${COMPONENT_VARIANTS.card.compact} ${INTERACTIVE.card}`}>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={group.avatar} alt={group.name} />
                  <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{group.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {group.members} membros • Ativo
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Convidar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar tela de explorar
  const renderExploreScreen = () => (
    <div className={`${LAYOUT.container} ${COMPONENT_VARIANTS.padding.lg} pb-20`}>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToMain}
          className="mr-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-bold">Explorar</h2>
      </div>

      <div className={`${COMPONENT_VARIANTS.spacing.lg}`}>
        <Card className={COMPONENT_VARIANTS.card.standard}>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-base font-semibold mb-2">Conhecer novas pessoas</h3>
            <p className="text-caption mb-6">
              Descubra pessoas próximas com interesses similares
            </p>
            <Button className={COMPONENT_VARIANTS.button.primary}>
              Começar a explorar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  // Renderizar tela principal
  const renderMainScreen = () => (
    <div className={`${LAYOUT.container} ${COMPONENT_VARIANTS.padding.lg} pb-20`}>
      {/* Botão "Quero sair" */}
      <div className={`${COMPONENT_VARIANTS.spacing.md}`}>
        <Button 
          className={`w-full h-14 ${COMPONENT_VARIANTS.button.primary} text-base font-semibold`}
          onClick={handleWantToGo}
        >
          <User className="w-5 h-5 mr-2" />
          Quero sair
        </Button>
      </div>

      {/* Suggestions */}
      <div className={LAYOUT.section}>
        {suggestions.map((suggestion) => (
          <Card 
            key={suggestion.id} 
            className={`${COMPONENT_VARIANTS.card.elevated} ${INTERACTIVE.card} ${COMPONENT_VARIANTS.spacing.md}`}
          >
            <div className="relative">
              <img 
                src={suggestion.image} 
                alt={suggestion.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 left-2 flex gap-1">
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {suggestion.type === "restaurant" && "Restaurante"}
                  {suggestion.type === "event" && "Evento"}
                  {suggestion.type === "bar" && "Bar"}
                  {suggestion.type === "activity" && "Atividade"}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-white/90 text-xs">
                  {suggestion.price}
                </Badge>
              </div>
              {suggestion.specialOffer && (
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-red-500 text-white text-xs">
                    {suggestion.specialOffer}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className={`${COMPONENT_VARIANTS.padding.lg} ${COMPONENT_VARIANTS.spacing.md}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-heading mb-1">{suggestion.name}</h4>
                  <p className="text-caption mb-2">{suggestion.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <div className={`${COMPONENT_VARIANTS.spacing.sm} mb-3`}>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(suggestion.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-caption ml-1">
                    {suggestion.rating}
                  </span>
                </div>
              </div>

              <div className={`${COMPONENT_VARIANTS.spacing.sm} mb-3`}>
                <div className="flex items-center space-x-4 text-caption">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{suggestion.distance}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{suggestion.timeSlot}</span>
                  </div>
                  {suggestion.attendees && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{suggestion.attendees}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-primary/5 rounded-md p-2 mb-3">
                <p className="text-caption text-primary">
                  {suggestion.matchReason}
                </p>
              </div>

              {suggestion.weather && (
                <div className="bg-blue-50 rounded-md p-2 mb-3">
                  <p className="text-caption text-blue-700">
                    {suggestion.weather}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={COMPONENT_VARIANTS.button.outline}
                >
                  Ver detalhes
                </Button>
                <Button 
                  size="sm"
                  className={COMPONENT_VARIANTS.button.primary}
                >
                  Reservar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Renderizar baseado no estado atual
  switch (flowState) {
    case 'filters':
      return renderWantToGoFilters();
    case 'friends':
      return renderFriendsScreen();
    case 'date':
      return renderDateScreen();
    case 'groups':
      return renderGroupsScreen();
    case 'explore':
      return renderExploreScreen();
    default:
      return renderMainScreen();
  }
};

export default ForYouTab;