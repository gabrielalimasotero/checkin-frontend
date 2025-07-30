
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, EyeOff, Receipt, ChefHat, CheckCircle2, Clock, MapPin, ExternalLink, Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  // Check-in ativo atual
  const currentCheckin = {
    id: 1,
    venue: "Boteco da Maria",
    time: "Hoje 18:00",
    status: "Ativo",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop",
    totalPaid: 0,
    rating: 0
  };

  // Backlog da conta atual
  const accountBacklog = [
    {
      id: 1,
      item: "Chopp Brahma 300ml",
      quantity: 2,
      price: 17.00,
      status: "delivered",
      time: "há 5 min"
    },
    {
      id: 2,
      item: "Porção de Calabresa",
      quantity: 1,
      price: 28.00,
      status: "preparing",
      time: "há 8 min"
    },
    {
      id: 3,
      item: "Batata Frita",
      quantity: 1,
      price: 18.00,
      status: "preparing",
      time: "há 10 min"
    }
  ];

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
        return 'Entregue';
      case 'preparing':
        return 'Preparando';
      default:
        return 'Pendente';
    }
  };

  const getTotalBacklog = () => {
    return accountBacklog.reduce((total, item) => total + item.price, 0);
  };

  const handleVenueClick = () => {
    navigate('/venue/boteco-da-maria');
  };

  const handleAddItems = () => {
    navigate('/checkin?tab=cardapio');
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
    <div className="space-y-4">
      {/* Check-in Ativo */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          Check-in ativo:
        </h3>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
          <img 
            src={currentCheckin.image} 
            alt={currentCheckin.venue}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-sm">{currentCheckin.venue}</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>{currentCheckin.time}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant="accept"
                className="text-xs"
              >
                {currentCheckin.status}
              </Badge>
              {currentCheckin.totalPaid > 0 && (
                <span className="text-xs font-medium text-checkin-turquoise-600">
                  R$ {currentCheckin.totalPaid.toFixed(2)}
                </span>
              )}
            </div>
            {currentCheckin.rating > 0 && (
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(currentCheckin.rating)}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <Button variant="outline" size="sm" className="text-xs" onClick={handleVenueClick}>
              Ver
            </Button>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onCheckIn}
        >
          <EyeOff className="w-4 h-4 mr-2" />
          Ocultar check-in
        </Button>
      </Card>

      {/* Minha Conta */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Receipt className="w-5 h-5 mr-2" />
          Minha Conta
        </h3>
        
        {accountBacklog.length > 0 ? (
          <div className="space-y-3">
            {accountBacklog.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <div className="font-medium text-sm">{item.item}</div>
                    <div className="text-xs text-gray-500">
                      Qtd: {item.quantity} • {item.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">R$ {item.price.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{getStatusText(item.status)}</div>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold text-checkin-turquoise-600">
                R$ {getTotalBacklog().toFixed(2)}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={handleAddItems}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar itens
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-checkin-turquoise-500 to-checkin-petrol-600 hover:from-checkin-turquoise-600 hover:to-checkin-petrol-700"
              >
                Encerrar Conta
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">Nenhum pedido ativo</p>
            <p className="text-xs text-gray-400">Seus pedidos aparecerão aqui</p>
            <Button 
              variant="outline"
              className="mt-3"
              onClick={handleAddItems}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar itens
            </Button>
          </div>
        )}
      </Card>

      {/* Quem está aqui agora */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Estão aqui agora ({peopleCurrentlyHere.length})
        </h3>
        <div className="space-y-3">
          {peopleCurrentlyHere.map((person) => (
            <div key={person.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback>{person.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{person.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {person.isTable && (
                  <Badge variant="secondary" className="text-xs">
                    🪑 Na mesa
                  </Badge>
                )}
                <Button variant="outline" size="sm">
                  👋
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Já foram ({peopleWhoLeft.length})
        </h3>
        <div className="space-y-3">
          {peopleWhoLeft.map((person) => (
            <div key={person.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 opacity-60">
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback>{person.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-gray-600">{person.name}</span>
                  <div className="text-xs text-gray-400">Saiu {person.leftTime}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="opacity-60">
                💬
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Pretendem vir ({peoplePlanningToCome.length})
        </h3>
        <div className="space-y-3">
          {peoplePlanningToCome.map((person) => (
            <div key={person.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback>{person.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{person.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                  📅 RSVP
                </Badge>
                <Button variant="outline" size="sm">
                  💬
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StatusTab;
