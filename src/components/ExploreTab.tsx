import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, TrendingUp } from "lucide-react";

const ExploreTab = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "Todos" },
    { id: "restaurant", label: "Restaurantes" },
    { id: "bar", label: "Bares" },
    { id: "show", label: "Shows" },
    { id: "event", label: "Eventos" },
  ];

  const trendingPlaces = [
    {
      id: 1,
      name: "Restaurante Bella Vista",
      category: "Italiano",
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop",
      distance: "0.8 km",
      priceRange: "$$",
      trending: true,
      description: "Autêntica culinária italiana com vista panorâmica"
    },
    {
      id: 2,
      name: "Bar do Rock",
      category: "Bar",
      rating: 4.6,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=300&h=200&fit=crop",
      distance: "1.2 km",
      priceRange: "$",
      trending: true,
      description: "Música ao vivo e drinks artesanais"
    },
    {
      id: 3,
      name: "Club Underground",
      category: "Balada",
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop",
      distance: "2.1 km",
      priceRange: "$$",
      trending: true,
      description: "Música eletrônica e ambiente underground"
    }
  ];

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

        {trendingPlaces.map((place) => (
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
                <Badge variant="secondary" className="text-xs">
                  {place.category}
                </Badge>
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

              <Button className="w-full" size="sm">
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