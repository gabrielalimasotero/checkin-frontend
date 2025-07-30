import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Users, Search, MapPin, History, Activity, Clock, Star } from "lucide-react";
import MainNavigation from "@/components/MainNavigation";
import MyCheckInsTab from "@/components/MyCheckInsTab";
import StatusTab from "@/components/StatusTab";
import OrderTab from "@/components/OrderTab";
import CheckInDialogs from "@/components/CheckInDialogs";

const CheckIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderItems, setOrderItems] = useState([]);
  const [tableCode, setTableCode] = useState("");
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showPaymentCompleteDialog, setShowPaymentCompleteDialog] = useState(false);
  const [isNearVenue, setIsNearVenue] = useState(false);
  const [activeTab, setActiveTab] = useState("geral");
  
  // Verificar se há parâmetro de aba na URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['geral', 'historico', 'ativo', 'cardapio'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const currentVenue = {
    name: "Boteco da Maria",
    table: "Mesa 8",
    checkInTime: "18:00",
    isActive: true
  };

  // Meus check-ins ativos
  const myCheckins = [
    {
      id: 1,
      venue: "Boteco da Maria",
      time: "Hoje 18:00",
      status: "Ativo",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop"
    }
  ];

  // Amigos com contas abertas (ainda não pagaram)
  const friendsWithOpenTabs = [
    {
      id: 1,
      name: "Ana Costa",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      venue: "Bar do João",
      time: "há 30 min",
      status: "open"
    },
    {
      id: 2,
      name: "Pedro Lima", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      venue: "Pizzaria Bella Vista",
      time: "há 1h",
      status: "open"
    }
  ];

  // Amigos que já concluíram check-in hoje
  const friendsCompletedToday = [
    {
      id: 3,
      name: "João Santos",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      venue: "Café Central",
      time: "há 2h",
      status: "completed"
    },
    {
      id: 4,
      name: "Carlos Lima",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      venue: "Bar Esportivo", 
      time: "há 3h",
      status: "completed"
    }
  ];

  // Check-ins históricos para avaliação (removido Boteco da Maria)
  const historicCheckins = [
    {
      id: 3,
      venue: "Café Central",
      time: "Anteontem 14:20",
      status: "Finalizado", 
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop",
      totalPaid: 32.00,
      rating: 5
    },
    {
      id: 4,
      venue: "Bar do João",
      time: "3 dias atrás 20:00",
      status: "Finalizado",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop",
      totalPaid: 67.80,
      rating: 3
    }
  ];

  // Outras coisas rolando hoje
  const todayEvents = [
    {
      id: 2,
      event: "Happy Hour - Bar do João",
      venue: "Bar do João",
      time: "20:00",
      attendees: 15,
      friends: ["Ana", "Carlos"]
    },
    {
      id: 3,
      event: "Noite de Karaokê",
      venue: "Bar Central",
      time: "21:00",
      attendees: 12,
      friends: ["Marina"]
    },
    {
      id: 4,
      event: "Show de Jazz",
      venue: "Café Blues",
      time: "20:30",
      attendees: 8,
      friends: []
    },
    {
      id: 5,
      event: "Festa de Aniversário",
      venue: "Casa da Júlia",
      time: "20:00",
      attendees: 24,
      friends: ["Pedro", "Ana", "João"]
    }
  ];

  const peopleHere = [
    { 
      id: 1, 
      name: "Maria Silva", 
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", 
      isTable: false,
      isRSVP: false
    },
    { 
      id: 2, 
      name: "João Santos", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face", 
      isTable: true,
      isRSVP: false
    },
    { 
      id: 3, 
      name: "Ana Costa", 
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", 
      isTable: true,
      isRSVP: false
    },
    { 
      id: 4, 
      name: "Pedro Lima", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", 
      isTable: false,
      isRSVP: true
    }
  ];

  const menuItems = [
    { id: 1, name: "Chopp Brahma 300ml", price: 8.50, category: "Bebidas" },
    { id: 2, name: "Porção de Calabresa", price: 28.00, category: "Petiscos" },
    { id: 3, name: "Batata Frita", price: 18.00, category: "Petiscos" },
    { id: 4, name: "Cerveja Heineken", price: 12.00, category: "Bebidas" }
  ];

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckIn = () => {
    if (!isNearVenue) {
      setShowLocationDialog(true);
      return;
    }
    console.log("Check-in realizado");
  };

  const handleRSVP = () => {
    console.log("RSVP realizado");
  };

  const handleCompletePayment = () => {
    setShowPaymentCompleteDialog(true);
  };

  const handleChangeRSVP = (eventId: number) => {
    console.log(`Mudando RSVP para evento ${eventId}`);
  };

  const handlePaymentComplete = () => {
    setShowPaymentCompleteDialog(false);
    setOrderItems([]);
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
    <div className="mobile-viewport bg-background flex flex-col">
      {/* Header sem localização */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-primary">Check-in</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="ativo">Ativo</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <div className="space-y-4">
              {/* Amigos com Contas Abertas */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Amigos com Conta Aberta
                </h3>
                <div className="space-y-3">
                  {friendsWithOpenTabs.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-3 border-l-4 border-primary rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name} 
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-sm">{friend.name}</div>
                          <div className="text-xs text-gray-500">{friend.venue} • {friend.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="accept" className="text-xs">
                          Conta aberta
                        </Badge>
                        <Button variant="outline" size="sm" className="text-xs">
                          Ver local
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Amigos que Finalizaram Hoje */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Check-ins Finalizados Hoje
                </h3>
                <div className="space-y-3">
                  {friendsCompletedToday.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name} 
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-sm">{friend.name}</div>
                          <div className="text-xs text-gray-500">{friend.venue} • {friend.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="accept" className="text-xs">
                          Finalizado
                        </Badge>
                        <Button variant="outline" size="sm" className="text-xs">
                          Ver local
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Explorar Pessoas */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Explorar Pessoas
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm"
                    onClick={() => navigate('/social?tab=pessoas')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Conhecer pessoas novas
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm"
                    onClick={() => navigate('/social?tab=pessoas')}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver quem está próximo
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <History className="w-5 h-5 mr-2" />
                Histórico de Check-ins
              </h3>
              <div className="space-y-3">
                {historicCheckins.map((checkin) => (
                  <div key={checkin.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={checkin.image} 
                      alt={checkin.venue}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{checkin.venue}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{checkin.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={checkin.status === 'Ativo' ? 'accept' : 'secondary'}
                          className="text-xs"
                        >
                          {checkin.status}
                        </Badge>
                        {checkin.totalPaid > 0 && (
                          <span className="text-xs font-medium text-primary">
                            R$ {checkin.totalPaid.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {checkin.rating > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(checkin.rating)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Button variant="outline" size="sm" className="text-xs">
                        Ver
                      </Button>
                      {checkin.status === 'Finalizado' && checkin.rating === 0 && (
                        <Button variant="outline" size="sm" className="text-xs text-yellow-600">
                          Avaliar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ativo">
            <StatusTab
              peopleHere={peopleHere}
              tableCode={tableCode}
              setTableCode={setTableCode}
              onCheckIn={handleCheckIn}
              onRSVP={handleRSVP}
            />
          </TabsContent>

          <TabsContent value="cardapio">
            <OrderTab
              orderItems={orderItems}
              setOrderItems={setOrderItems}
              menuItems={menuItems}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CheckInDialogs
        showLocationDialog={showLocationDialog}
        setShowLocationDialog={setShowLocationDialog}
        showPaymentCompleteDialog={showPaymentCompleteDialog}
        setShowPaymentCompleteDialog={setShowPaymentCompleteDialog}
        waiterCode=""
        onPaymentComplete={handlePaymentComplete}
      />

      <MainNavigation />
    </div>
  );
};

export default CheckIn;
