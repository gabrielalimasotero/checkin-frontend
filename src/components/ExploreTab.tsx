import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { listVenues } from '@/lib/api';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, TrendingUp, Users, Percent } from "lucide-react";

const ExploreTab = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await listVenues({ limit: 12, sort_by: 'rating', sort_order: 'desc' });
        // Mapear para o formato esperado por esta UI
        const mapped = data.map((v) => ({
          id: v.id,
          name: v.name,
          category: v.category,
          rating: v.rating ?? 0,
          reviews: v.total_reviews ?? 0,
          image: v.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
          distance: '',
          priceRange: v.price_range || '$$',
          trending: false,
          description: v.description || '',
          filterType: 'restaurant',
        }));
        setVenues(mapped);
      } catch (e) {
        console.error('Erro ao carregar venues:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const categories = [
    { id: "all", label: "Todos" },
    { id: "friends", label: "Seus Amigos" },
    { id: "promotions", label: "Promoções" },
    { id: "restaurant", label: "Restaurantes" },
    { id: "bar", label: "Bares" },
    { id: "show", label: "Shows" },
    { id: "event", label: "Eventos" },
  ];



  // Filtrar lugares baseado na categoria selecionada (somente dados do backend)
  const filteredPlaces = selectedCategory === "all"
    ? venues
    : venues.filter(place => place.filterType === selectedCategory);

  return (
    <div className="p-4 pb-20 space-y-4">

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Trending Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Em alta agora</h2>
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-sm text-muted-foreground p-4">Nenhum local encontrado.</div>
        )}
        {filteredPlaces.map((place) => (
          <Card key={place.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={place.image} 
                alt={place.name}
                className="w-full h-40 object-cover"
              />
              {place.trending && (
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
              <Badge variant="outline" className="absolute top-2 right-2 bg-white/90">
                {place.priceRange}
              </Badge>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{place.name}</h3>
                <p className="text-sm text-muted-foreground">{place.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {place.category}
                  </Badge>
                  {place.friendsHere && place.friendsHere.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      👥 {place.friendsHere.length} amigo{place.friendsHere.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {place.promotion && (
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                      🎉 Promoção
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{place.rating}</span>
                    <span className="text-muted-foreground">({place.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{place.distance}</span>
                  </div>
                </div>
              </div>

              {/* Informações de amigos */}
              {place.friendsHere && place.friendsHere.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-xs text-green-700 font-medium mb-1">
                    👥 Seus amigos estão aqui:
                  </p>
                  <p className="text-xs text-green-600">
                    {place.friendsHere.join(", ")}
                  </p>
                </div>
              )}

              {/* Informações de promoção */}
              {place.promotion && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                  <p className="text-xs text-orange-700 font-medium mb-1">
                    🎉 Promoção Especial:
                  </p>
                  <p className="text-xs text-orange-600">
                    {place.promotion}
                  </p>
                </div>
              )}

              <Button className="w-full" size="sm" onClick={() => navigate(`/venue/${place.id}`)}>
                Ver detalhes
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExploreTab;