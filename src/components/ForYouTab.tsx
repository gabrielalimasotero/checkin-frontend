import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, MapPin, Star, Calendar, Heart } from "lucide-react";

const ForYouTab = () => {
  const [selectedMood, setSelectedMood] = useState("all");

  const moodFilters = [
    { id: "all", label: "Tudo", emoji: "🎯" },
    { id: "solo", label: "Sozinho", emoji: "🚶" },
    { id: "friends", label: "Com amigos", emoji: "👥" },
    { id: "date", label: "Encontro", emoji: "💕" },
    { id: "family", label: "Família", emoji: "👨‍👩‍👧‍👦" },
  ];

  const suggestions = [
    {
      id: 1,
      type: "restaurant",
      name: "Bistrô do Chef",
      category: "Francesa",
      description: "Perfeito para um jantar romântico hoje à noite",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
      rating: 4.8,
      distance: "1.2 km",
      timeSlot: "19:00 - 21:00",
      price: "$$",
      matchReason: "Baseado no seu gosto por culinária francesa",
      availability: true,
      mood: ["date", "friends"]
    },
    {
      id: 2,
      type: "event",
      name: "Show Acústico - João Martins",
      venue: "Café Cultural",
      description: "Música brasileira ao vivo em ambiente intimista",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      rating: 4.6,
      distance: "0.8 km",
      timeSlot: "20:00",
      price: "R$ 25",
      matchReason: "Você gosta de música acústica",
      attendees: 45,
      mood: ["solo", "date"]
    },
    {
      id: 3,
      type: "bar",
      name: "Rooftop Sunset",
      category: "Bar",
      description: "Happy hour com vista da cidade até 19h",
      image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=300&h=200&fit=crop",
      rating: 4.7,
      distance: "2.1 km",
      timeSlot: "17:00 - 19:00",
      price: "$",
      matchReason: "Trending na sua região",
      specialOffer: "2x1 em drinks até 18h",
      mood: ["friends", "date"]
    },
    {
      id: 4,
      type: "activity",
      name: "Parque Villa-Lobos",
      category: "Atividade ao ar livre",
      description: "Tarde perfeita para exercícios e relaxamento",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      rating: 4.5,
      distance: "3.2 km",
      timeSlot: "Agora aberto",
      price: "Grátis",
      matchReason: "Você adora atividades ao ar livre",
      weather: "Clima ideal: 24°C, ensolarado",
      mood: ["solo", "family", "friends"]
    }
  ];

  const filteredSuggestions = suggestions.filter(suggestion => 
    selectedMood === "all" || suggestion.mood.includes(selectedMood)
  );

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">O que fazer agora?</h2>
        <p className="text-sm text-muted-foreground">Sugestões personalizadas para você</p>
      </div>

      {/* Mood Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {moodFilters.map((mood) => (
          <Button
            key={mood.id}
            variant={selectedMood === mood.id ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => setSelectedMood(mood.id)}
          >
            <span className="mr-1">{mood.emoji}</span>
            {mood.label}
          </Button>
        ))}
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        {filteredSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={suggestion.image} 
                alt={suggestion.name}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-1">
                <Badge className="bg-primary text-primary-foreground text-xs">
                  {suggestion.type === "restaurant" && "🍽️ Restaurante"}
                  {suggestion.type === "event" && "🎵 Evento"}
                  {suggestion.type === "bar" && "🍻 Bar"}
                  {suggestion.type === "activity" && "🏃 Atividade"}
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
            
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{suggestion.name}</h3>
                {suggestion.venue && (
                  <p className="text-sm text-muted-foreground">📍 {suggestion.venue}</p>
                )}
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{suggestion.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{suggestion.distance}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{suggestion.timeSlot}</span>
                  </div>
                </div>
              </div>

              {suggestion.attendees && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{suggestion.attendees} pessoas interessadas</span>
                </div>
              )}

              {suggestion.weather && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  ☀️ {suggestion.weather}
                </div>
              )}

              <div className="text-xs text-primary bg-primary/10 p-2 rounded">
                💡 {suggestion.matchReason}
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1" size="sm">
                  Ver detalhes
                </Button>
                <Button variant="outline" size="sm" className="px-3">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ForYouTab;