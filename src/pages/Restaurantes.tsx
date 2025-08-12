
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listVenues } from '@/lib/api';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Utensils, MapPin, Star, Award, Heart, Salad } from "lucide-react";
import MobileNavigation from "@/components/MobileNavigation";
import styles from "@/styles/restarantes.module.css";

const Restaurantes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Carregar contagens reais da API
  useEffect(() => {
    const loadCategoryCounts = async () => {
      try {
        setIsLoading(true);
        // Carregar todos os venues para contar por categoria
        const venues = await listVenues({ limit: 1000 }); // Pegar todos
        
        // Contar por categoria
        const counts: Record<string, number> = {};
        
        venues.forEach((venue: any) => {
          const category = venue.category?.toLowerCase() || 'outros';
          counts[category] = (counts[category] || 0) + 1;
        });
        
        // Mapear para as categorias do frontend
        const mappedCounts = {
          'melhor_avaliado': venues.filter((v: any) => (v.rating || 0) >= 4.5).length,
          'brasileira': counts['brasileiro'] || counts['brasileira'] || 0,
          'saudavel': counts['saudável'] || counts['saudavel'] || counts['natural'] || 0,
          'hamburguer': counts['hamburguer'] || counts['hamburgueria'] || counts['burger'] || 0,
          'pizza': counts['pizza'] || counts['pizzaria'] || 0,
          'italiana': counts['italiano'] || counts['italiana'] || 0,
          'japonesa': counts['japonês'] || counts['japonesa'] || counts['sushi'] || 0,
          'chinesa': counts['chinês'] || counts['chinesa'] || 0,
          'frutos_mar': counts['frutos do mar'] || counts['peixe'] || counts['seafood'] || 0,
          'fast_food': counts['fast food'] || counts['fastfood'] || counts['lanchonete'] || 0,
        };
        
        setCategoryCounts(mappedCounts);
      } catch (error) {
        console.error('Erro ao carregar contagens:', error);
        // Em caso de erro, manter contadores zerados
        setCategoryCounts({});
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryCounts();
  }, []);

  // Tipos de culinária e categorias de restaurantes
  const cuisineTypes = [
    {
      id: 1,
      name: "Melhores Avaliados",
      count: categoryCounts.melhor_avaliado || 0,
      key: "melhor_avaliado",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-400 to-checkin-primary-600",
      description: "Top restaurantes da cidade",
      icon: Award
    },
    {
      id: 2,
      name: "Brasileira",
      count: categoryCounts.brasileira || 0,
      key: "brasileira",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-300 to-checkin-primary-500",
      description: "Sabores tradicionais do Brasil",
      icon: Heart
    },
    {
      id: 3,
      name: "Saudável",
      count: categoryCounts.saudavel || 0,
      key: "saudavel",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-200 to-checkin-primary-400",
      description: "Opções naturais e nutritivas",
      icon: Salad
    },
    {
      id: 4,
      name: "Hamburguerias",
      count: categoryCounts.hamburguer || 0,
      key: "hamburguer",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-500 to-checkin-primary-700",
      description: "Os melhores burgers da cidade",
      icon: Utensils
    },
    {
      id: 5,
      name: "Pizzarias",
      count: categoryCounts.pizza || 0,
      key: "pizza",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-400 to-checkin-primary-600",
      description: "Pizzas artesanais e tradicionais",
      icon: Utensils
    },
    {
      id: 6,
      name: "Italiana",
      count: categoryCounts.italiana || 0,
      key: "italiana",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-300 to-checkin-primary-500",
      description: "Autêntica culinária italiana",
      icon: Utensils
    },
    {
      id: 7,
      name: "Japonesa",
      count: categoryCounts.japonesa || 0,
      key: "japonesa",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-400 to-checkin-primary-800",
      description: "Sushi, sashimi e pratos nipônicos",
      icon: Utensils
    },
    {
      id: 8,
      name: "Chinesa",
      count: categoryCounts.chinesa || 0,
      key: "chinesa",
      image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-500 to-checkin-primary-700",
      description: "Tradições culinárias chinesas",
      icon: Utensils
    },
    {
      id: 9,
      name: "Frutos do Mar",
      count: categoryCounts.frutos_mar || 0,
      key: "frutos_mar",
      image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-300 to-checkin-primary-600",
      description: "Especialidades marinhas",
      icon: Utensils
    },
    {
      id: 10,
      name: "Fast Food",
      count: categoryCounts.fast_food || 0,
      key: "fast_food",
      image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=150&fit=crop",
      gradient: "from-checkin-primary-400 to-checkin-primary-700",
      description: "Opções rápidas e saborosas",
      icon: Utensils
    }
  ];

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/social")}
            className="p-2 h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 bg-gradient-to-br from-checkin-primary-400 to-checkin-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Restaurantes</h1>
            <p className="text-xs text-muted-foreground">Explore por categoria e tipo</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar categoria ou tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-24">
        <div className={`grid ${styles.gridFormater} grid-cols-2 gap-3`}>
          {cuisineTypes
            .filter(cuisine => 
              cuisine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              cuisine.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((cuisine) => {
              const IconComponent = cuisine.icon;
              return (
                <Card key={cuisine.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-105">
                  <div className={`h-20 ${styles.cardFormater} relative`}>
                    <img 
                      src={cuisine.image} 
                      alt={cuisine.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cuisine.gradient} opacity-90`} />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-2">
                      <IconComponent className="w-5 h-5 mb-1" />
                      <h3 className="text-sm font-semibold text-center">{cuisine.name}</h3>
                      <p className="text-xs opacity-90">{cuisine.count} locais</p>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>

        {searchQuery && cuisineTypes.filter(cuisine => 
          cuisine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cuisine.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).length === 0 && (
          <div className="text-center py-8">
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
            <p className="text-sm text-muted-foreground">Tente buscar por outro termo</p>
          </div>
        )}
      </div>

      <MobileNavigation currentPage="social" />
    </div>
  );
};

export default Restaurantes;
