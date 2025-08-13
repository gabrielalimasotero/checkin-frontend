import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Users, 
  Heart,
  Plus,
  UserPlus,
  CheckCircle,
  Eye
} from "lucide-react";
import MobileNavigation from "@/components/MobileNavigation";
import { getVenue, listVenuePromotions } from '@/lib/api';

const VenueDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [venue, setVenue] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const v = await getVenue(id);
        // fetch promotions if needed
        const promotions = await listVenuePromotions(id).catch(() => []);
        const mapped = {
          id: v.id,
          name: v.name,
          type: v.category,
          rating: v.rating ?? 0,
          reviewCount: v.total_reviews ?? 0,
          address: v.address || '',
          latitude: v.latitude || null,
          longitude: v.longitude || null,
          phone: v.phone || '',
          hours: v.hours || '',
          priceRange: v.price_range || '',
          features: v.features || '',
          images: v.image_url ? [v.image_url] : [],
          stats: { peopleHere: 0, intendToGo: 0, friends: 0, openToMeet: 0 },
          menu: [],
          peopleHere: [],
          promotions,
        };
        setVenue(mapped);
      } catch (e) {
        console.error('Erro ao carregar venue:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleAddFriend = (personId: number) => {
    console.log(`Enviando solicitação de amizade para pessoa ${personId}`);
  };

  const getMenuByCategory = () => {
    const categories = (venue?.menu || []).reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof venue.menu>);
    return categories;
  };

  const menuByCategory = getMenuByCategory();

  return (
    <div className="min-h-screen bg-gray-50 max-w-sm mx-auto">
      {/* Header */}
      <div className="relative">
          <img 
          src={venue?.images?.[0] || ''} 
          alt={venue?.name || ''}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 right-4 ${isFollowing ? 'bg-primary text-white' : 'bg-white/90'} hover:bg-white`}
          onClick={handleFollow}
        >
          <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Venue Info */}
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold">{venue?.name}</h1>
            <p className="text-gray-600 text-sm">{venue?.type}</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                 <span className="text-sm font-medium ml-1">{venue?.rating}</span>
                 <span className="text-xs text-gray-500 ml-1">({venue?.reviewCount} avaliações)</span>
              </div>
            </div>
          </div>
          <Button 
            className={`${isFollowing ? 'bg-gray-500' : 'bg-primary'} hover:bg-primary/90`}
            onClick={handleFollow}
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
             <div className="font-semibold text-primary">{venue?.stats?.peopleHere ?? 0}</div>
            <div className="text-xs text-gray-600">Aqui agora</div>
          </div>
          <div className="text-center">
             <div className="font-semibold text-blue-600">{venue?.stats?.intendToGo ?? 0}</div>
            <div className="text-xs text-gray-600">Pretendem ir</div>
          </div>
          <div className="text-center">
             <div className="font-semibold text-green-600">{venue?.stats?.friends ?? 0}</div>
            <div className="text-xs text-gray-600">Amigos</div>
          </div>
          <div className="text-center">
             <div className="font-semibold text-purple-600">{venue?.stats?.openToMeet ?? 0}</div>
            <div className="text-xs text-gray-600">Abertas</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Geral</TabsTrigger>
            <TabsTrigger value="menu">Cardápio</TabsTrigger>
            <TabsTrigger value="people">Pessoas</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Photos */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Fotos</h3>
              <div className="grid grid-cols-3 gap-2">
                {(venue?.images || []).map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${venue.name} ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Check-in</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Pretendo ir</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            {Object.entries(menuByCategory).map(([category, items]) => (
              <Card key={category} className="p-4">
                   <h3 className="font-semibold mb-3">{category}</h3>
                <div className="space-y-3">
                   {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-primary font-semibold">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="people" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Pessoas no Local</h3>
              <div className="space-y-3">
                {(venue?.peopleHere || []).map((person) => (
                  <div key={person.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={person.avatar} />
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{person.name}</span>
                          {person.isFriend && (
                            <Badge variant="outline" className="text-xs">Amigo</Badge>
                          )}
                          {person.isOpenToMeet && (
                            <Badge className="text-xs bg-purple-100 text-purple-700">Aberta</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{person.table}</p>
                      </div>
                    </div>
                    {!person.isFriend && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddFriend(person.id)}
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Informações</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Endereço</p>
                     <p className="text-gray-600 text-sm">{venue?.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Horário</p>
                     <p className="text-gray-600 text-sm">{venue?.hours}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Contato</p>
                     <p className="text-gray-600 text-sm">{venue?.phone}</p>
                  </div>
                </div>
                {venue?.priceRange && (
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-gray-100 text-gray-700" variant="secondary">
                      Faixa de preço: {venue.priceRange}
                    </Badge>
                  </div>
                )}
                {venue?.features && (
                  <div className="flex items-start space-x-3">
                    <div>
                      <p className="font-medium text-sm">Diferenciais</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {venue.features.split(/[,;]+/).map((f: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {f.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNavigation currentPage="social" />
    </div>
  );
};

export default VenueDetails;
