
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, EyeOff, Receipt, ChefHat, CheckCircle2, Clock, MapPin, ExternalLink, Plus, Star, Eye, CreditCard } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listVenueCheckins } from "@/lib/api";
import { 
  COMPONENT_VARIANTS, 
  COMMON_CLASSES, 
  LAYOUT,
  INTERACTIVE 
} from '@/lib/design-system';

interface StatusTabProps {
  peopleHere: Array<{
    id: number;
    name: string;
    avatar: string;
    isTable: boolean;
    isRSVP: boolean;
  }>;
  tableCode: string;
  setTableCode: (code: string) => void;
  onCheckIn: () => void;
  onRSVP: () => void;
}

const StatusTab = ({ 
  peopleHere, 
  onCheckIn, 
  onRSVP 
}: StatusTabProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [venueName, setVenueName] = useState<string>("Local");
  const [accountBacklog, setAccountBacklog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const vid = searchParams.get('venueId');
      if (!vid) return;
      try {
        setIsLoading(true);
        const checkins = await listVenueCheckins(vid, { limit: 10 });
        // Placeholder: derivar nome do local e backlog conforme o modelo evoluir
        setVenueName('Local');
        setAccountBacklog((checkins || []).map((c: any, idx: number) => ({
          id: idx + 1,
          item: c.review ? c.review.substring(0, 20) : 'Consumo',
          quantity: 1,
          price: 0,
          status: 'delivered',
          time: '',
        })));
      } catch (e) {
        setAccountBacklog([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [searchParams]);

  // Backlog da conta atual (alimentado via API)

  // Separar pessoas por status
  const peopleCurrentlyHere = peopleHere.filter(person => !person.isRSVP);
  const peopleWhoLeft = [
    {
      id: 5,
      name: "Marina Santos",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      leftTime: "há 30 min"
    },
    {
      id: 6,
      name: "Rafael Costa",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      leftTime: "há 1h"
    }
  ];
  const peoplePlanningToCome = peopleHere.filter(person => person.isRSVP);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return "Entregue";
      case 'preparing':
        return "Preparando";
      default:
        return "Pendente";
    }
  };

  const getTotalBacklog = () => {
    return accountBacklog.reduce((total, item) => total + item.price, 0);
  };

  const handleVenueClick = () => {
    navigate('/venue-details');
  };

  const handleAddItems = () => {
    navigate('/menu');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className={LAYOUT.section}>
      {/* Você está em */}
      <Card className={`${COMPONENT_VARIANTS.card.spacious} bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20`}>
        <div>
          <h3 className="text-base font-semibold text-primary">Você está em {venueName}.</h3>
        </div>
      </Card>

      {/* Minha Conta - Layout mais vertical */}
      <Card className={COMPONENT_VARIANTS.card.standard}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-primary" />
            Minha Conta
          </h3>
          <Badge variant="secondary" className="text-xs">
             {accountBacklog.length} itens
          </Badge>
        </div>
        
        {accountBacklog.length > 0 ? (
          <div className={COMPONENT_VARIANTS.spacing.md}>
            {accountBacklog.map((item) => (
              <div key={item.id} className={`${COMPONENT_VARIANTS.padding.md} bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.item}</div>
                    <div className="text-caption">
                      Qtd: {item.quantity} • {item.time}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getStatusText(item.status)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary">R$ {item.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border-t border-border/50 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-sm font-medium text-primary">
                  R$ {getTotalBacklog().toFixed(2)}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1 h-10"
                  onClick={handleAddItems}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
                <Button 
                  className={`flex-1 h-10 ${COMPONENT_VARIANTS.button.primary}`}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-caption text-muted-foreground mb-4">Nenhum item na conta</p>
            <Button 
              variant="outline" 
              onClick={handleAddItems}
              className={COMPONENT_VARIANTS.button.outline}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar itens
            </Button>
          </div>
        )}
      </Card>


    </div>
  );
};

export default StatusTab;
