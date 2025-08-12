import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listGroups } from '@/lib/api';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Heart, MessageSquare, Users2, Utensils, Coffee, Music, Star, Target, Calendar, Users, ChevronDown, Filter, Percent, IceCream, ChefHat, Cookie } from "lucide-react";
import MainNavigation from "@/components/MainNavigation";
import styles from "@/styles/social.module.css";

import MeetNewPeopleDialog from "@/components/MeetNewPeopleDialog";
import CreateGroupDialog from "@/components/CreateGroupDialog";

// Tipo para pessoa
interface Person {
  id: number;
  name: string;
  avatar: string;
  distance: string;
  venue: string;
  interests: string[];
  mutualFriends: number;
  connectionType: string;
  compatibility: number;
  commonInterests: string[];
  clickable: boolean;
  gender: "homens" | "mulheres";
}

const Social = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"lugares" | "grupos" | "pessoas">("lugares");
  const [interestGroups, setInterestGroups] = useState<any[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [nearbyPeople, setNearbyPeople] = useState<Person[]>([]);
  const [isLoadingPeople, setIsLoadingPeople] = useState(false);

  const [showMeetPeople, setShowMeetPeople] = useState(false);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Recife");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState("");
  const [peopleFilter, setPeopleFilter] = useState<"todos" | "homens" | "mulheres">("todos");

  // Carregar grupos da API
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setIsLoadingGroups(true);
        const groups = await listGroups({ limit: 20 });
        setInterestGroups(groups || []);
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
        setInterestGroups([]);
      } finally {
        setIsLoadingGroups(false);
      }
    };

    loadGroups();
  }, []);

  // Lista de bares disponíveis
  const availableBars = [
    {
      id: 1,
      name: "Bar do Zé",
      tags: ["PetiscosTop", "CervejaGelada", "MúsicaAoVivo"],
      hours: "Aberto até 01h",
      location: "Boa Vista",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop",
      rating: 4.5
    },
    {
      id: 2,
      name: "Toca da Loba",
      tags: ["LGBTQIA+", "RolêSeguro", "AmbienteFechado"],
      hours: "Aberto até 23h",
      location: "Graças",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100&h=100&fit=crop",
      rating: 4.8
    },
    {
      id: 3,
      name: "Na Brasa Pub",
      tags: ["Churrasco", "PromoçãoDeBalde"],
      hours: "Aberto até 02h", 
      location: "Pina",
      image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=100&h=100&fit=crop",
      rating: 4.2
    },
    {
      id: 4,
      name: "Hidden Bar",
      tags: ["DrinksAutorais", "Reservado", "PraDate"],
      hours: "Aberto até 00h",
      location: "Casa Forte",
      image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=100&h=100&fit=crop",
      rating: 4.7
    }
  ];

  // Categorias de exploração simplificadas
  const exploreCategories = [
    {
      id: 1,
      name: "Restaurantes",
      icon: Utensils,
      count: 247,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-400 to-checkin-primary-600",
      clickable: true,
      route: "/restaurantes"
    },
    {
      id: 2,
      name: "Bares",
      icon: Music,
      count: 203,
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-500 to-checkin-primary-700",
      clickable: true
    },
    {
      id: 3,
      name: "Eventos",
      icon: Calendar,
      count: 89,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-300 to-checkin-primary-500",
      clickable: false
    },
    {
      id: 4,
      name: "Shows",
      icon: Music,
      count: 156,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-400 to-checkin-primary-600",
      clickable: false
    },
    {
      id: 5,
      name: "Cafés",
      icon: Coffee,
      count: 78,
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-500 to-checkin-primary-700",
      clickable: false
    },
    {
      id: 6,
      name: "Promoções",
      icon: Percent,
      count: 124,
      image: "https://images.unsplash.com/photo-1607083206869-4c7d0c21e65c?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-400 to-checkin-primary-800",
      clickable: false
    },
    {
      id: 7,
      name: "Docerias",
      icon: Cookie,
      count: 45,
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-200 to-checkin-primary-400",
      clickable: false
    },
    {
      id: 8,
      name: "Padarias",
      icon: ChefHat,
      count: 67,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-300 to-checkin-primary-500",
      clickable: false
    },
    {
      id: 9,
      name: "Sorveterias",
      icon: IceCream,
      count: 32,
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-300 to-checkin-primary-500",
      clickable: false
    },
    {
      id: 10,
      name: "Açaí",
      icon: IceCream,
      count: 28,
      image: "https://images.unsplash.com/photo-1605801234031-3d5ad5b51c52?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-400 to-checkin-primary-600",
      clickable: false
    }
  ];





  const getConnectionBadgeColor = (type: string) => {
    switch (type) {
      case "1º grau":
        return "bg-primary/10 text-primary border-primary/30";
      case "2º grau":
        return "bg-secondary/10 text-secondary-foreground border-secondary/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getCompatibilityColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-gray-600";
  };

  const handleCategoryClick = (category: any) => {
    if (category.clickable) {
      if (category.route) {
        navigate(category.route);
      } else if (category.name === "Bares") {
        setSelectedCategory("Bares");
      }
    }
  };

  const handlePersonClick = (person: Person) => {
    if (person.clickable) {
      navigate(`/profile/${person.id}`);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? "" : tag);
  };

  const handleBarClick = (barId: number) => {
    navigate(`/venue/${barId}`);
  };

  const filteredBars = selectedTag 
    ? availableBars.filter(bar => bar.tags.includes(selectedTag))
    : availableBars;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedTag("");
  };

  // Filtrar pessoas baseado no filtro selecionado
  const filteredPeople = peopleFilter === "todos" 
    ? nearbyPeople 
    : nearbyPeople.filter(person => person.gender === peopleFilter);

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Search className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-primary">Explorar</h1>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary p-0 h-auto"
              >
                {currentLocation}
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>

        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar lugares, pessoas, grupos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl text-sm"
          />
        </div>

        {/* Filter Toggle */}
        <div className="grid grid-cols-3 gap-1">
          <Button
            variant={filterType === "lugares" ? "default" : "outline"}
            size="sm"
            className={`text-xs ${filterType === "lugares" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}`}
            onClick={() => setFilterType("lugares")}
          >
            Lugares
          </Button>
          <Button
            variant={filterType === "grupos" ? "default" : "outline"}
            size="sm"
            className={`text-xs ${filterType === "grupos" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}`}
            onClick={() => setFilterType("grupos")}
          >
            Grupos
          </Button>
          <Button
            variant={filterType === "pessoas" ? "default" : "outline"}
            size="sm"
            className={`text-xs ${filterType === "pessoas" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}`}
            onClick={() => setFilterType("pessoas")}
          >
            Pessoas
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-20">
        {filterType === "lugares" ? (
          selectedCategory === "Bares" ? (
            <div className="space-y-4">
              {/* Header dos Bares */}
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToCategories}
                  className="text-primary"
                >
                  ← Voltar
                </Button>
                <h3 className="font-semibold text-foreground">Bares em Recife</h3>
              </div>
              
              {/* Filtro por tags */}
              {selectedTag && (
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-primary" />
                  <Badge className="bg-primary/10 text-primary">
                    {selectedTag}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedTag("")}
                    className="ml-2 text-xs text-gray-500"
                  >
                    Limpar filtro
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                {filteredBars.map((bar) => (
                  <Card 
                    key={bar.id} 
                    className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleBarClick(bar.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <img 
                        src={bar.image} 
                        alt={bar.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{bar.name}</h4>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(Math.floor(bar.rating))}
                          <span className="text-xs text-gray-600 ml-1">({bar.rating})</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          🕒 {bar.hours} | 📍 {bar.location}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {bar.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              className={`text-xs cursor-pointer transition-colors ${
                                selectedTag === tag 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-primary/10 text-primary hover:bg-primary/20"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTagClick(tag);
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* Categorias Explorar */
            <div className="space-y-4">
              <div className={`grid ${styles.gridFormater} grid-cols-2 gap-3`}>
                {exploreCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Card 
                      key={category.id} 
                      className={`relative overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                        category.clickable ? 'hover:shadow-lg' : 'opacity-75'
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div className={`h-20 ${styles.cardFormater} relative`}>
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-90`} />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-2">
                          <IconComponent className="w-5 h-5 mb-1" />
                          <h3 className="text-sm font-semibold text-center">{category.name}</h3>
                          <p className="text-xs opacity-90">{category.count} locais</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )
        ) : filterType === "grupos" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Grupos por Interesse</h3>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowCreateGroupDialog(true)}
                className="text-xs border-primary text-primary"
              >
                + Criar Grupo
              </Button>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-primary">
                <span className="font-medium">🎯 Grupos Personalizados:</span> Baseados nos seus interesses e localização. Participe ou crie novos grupos!
              </p>
            </div>

            {interestGroups.map((group) => (
              <Card key={group.id} className="p-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={group.avatar} alt={group.name} />
                    <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{group.name}</h4>
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        {group.interest}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-2 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{group.members} membros</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{group.radius}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users2 className="w-3 h-3" />
                        <span>{group.mutualFriends} amigos</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{group.description}</p>
                    
                    {group.nextEvent && (
                      <div className="bg-primary/10 rounded p-2 mb-3">
                        <p className="text-xs text-primary">📅 {group.nextEvent}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className={`text-xs flex-1 ${
                          group.isJoined 
                            ? "bg-gray-500 hover:bg-gray-600" 
                            : "bg-primary hover:bg-primary/90"
                        }`}
                      >
                        {group.isJoined ? "Participando" : "Participar"}
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs flex-1">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Pessoas Próximas</h3>
            </div>
            
            {/* Barra de Filtros */}
            <div className="flex space-x-2 mb-4">
              <Button
                variant={peopleFilter === "todos" ? "default" : "outline"}
                size="sm"
                className={`flex-1 text-xs ${peopleFilter === "todos" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}`}
                onClick={() => setPeopleFilter("todos")}
              >
                Todos
              </Button>
              <Button
                variant={peopleFilter === "homens" ? "default" : "outline"}
                size="sm"
                className={`flex-1 text-xs ${peopleFilter === "homens" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}`}
                onClick={() => setPeopleFilter("homens")}
              >
                Homens
              </Button>
              <Button
                variant={peopleFilter === "mulheres" ? "default" : "outline"}
                size="sm"
                className={`flex-1 text-xs ${peopleFilter === "mulheres" ? "bg-primary hover:bg-primary/90" : "border-primary/50 text-primary hover:bg-primary/10"}`}
                onClick={() => setPeopleFilter("mulheres")}
              >
                Mulheres
              </Button>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-primary">
                <span className="font-medium">🔍 Baseado em:</span> Seus interesses, localização atual e amigos em comum
              </p>
            </div>

            {filteredPeople.map((person) => (
              <Card 
                key={person.id} 
                className={`p-3 ${person.clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                onClick={() => handlePersonClick(person)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{person.name}</h4>
                      <span className={`text-xs font-medium ${getCompatibilityColor(person.compatibility)}`}>
                        {person.compatibility}% compatível
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{person.venue}</span>
                      <span className="text-xs text-gray-500">• {person.distance}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Users2 className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {person.mutualFriends} amigos em comum
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {person.commonInterests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs flex-1">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Conectar
                      </Button>
                      <Button size="sm" className="text-xs flex-1 bg-primary hover:bg-primary/90">
                        Ver Perfil
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>



      <MeetNewPeopleDialog 
        isOpen={showMeetPeople} 
        onClose={() => setShowMeetPeople(false)} 
      />

      <CreateGroupDialog 
        isOpen={showCreateGroupDialog} 
        onClose={() => setShowCreateGroupDialog(false)} 
      />

      <MainNavigation />
    </div>
  );
};

export default Social;