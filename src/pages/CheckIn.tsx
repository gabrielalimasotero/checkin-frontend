import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Users, Search, MapPin, History, Activity, Clock, Star, Eye, MessageSquare } from "lucide-react";
import MainNavigation from "@/components/MainNavigation";
import MyCheckInsTab from "@/components/MyCheckInsTab";
import StatusTab from "@/components/StatusTab";
import OrderTab from "@/components/OrderTab";
import CheckInDialogs from "@/components/CheckInDialogs";
import { 
  COMPONENT_VARIANTS, 
  COMMON_CLASSES, 
  LAYOUT,
  INTERACTIVE 
} from '@/lib/design-system';

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
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-sm mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-lg font-bold text-primary font-ubuntu">CheckIn</h1>
            </div>
            
            {/* Action Button */}
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => navigate(`/messages?table=${currentVenue.table}`)}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal com melhor espaçamento */}
      <div className="flex-1 overflow-y-auto">
        <div className={`${LAYOUT.container} ${COMPONENT_VARIANTS.padding.lg} pb-24`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className={LAYOUT.section}>
            {/* Tabs com melhor proporção */}
            <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50">
              <TabsTrigger value="geral" className="text-sm font-medium">Geral</TabsTrigger>
              <TabsTrigger value="historico" className="text-sm font-medium">Histórico</TabsTrigger>
              <TabsTrigger value="ativo" className="text-sm font-medium">Ativo</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className={LAYOUT.section}>
              {/* Seção de Status Atual */}
              <Card className={`${COMPONENT_VARIANTS.card.spacious} bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-primary" />
                    Status Atual
                  </h3>
                  <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                    Ativo
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-medium">Boteco da Maria</h4>
                    <p className="text-caption">Mesa 8 • Desde 18:00</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Amigos com Contas Abertas - Layout mais vertical */}
              <Card className={COMPONENT_VARIANTS.card.standard}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Contas Abertas
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {friendsWithOpenTabs.length}
                  </Badge>
                </div>
                <div className={COMPONENT_VARIANTS.spacing.md}>
                  {friendsWithOpenTabs.map((friend) => (
                    <div key={friend.id} className={`${COMPONENT_VARIANTS.padding.md} border-l-4 border-primary/30 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors`}>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name} 
                          className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{friend.name}</div>
                          <div className="text-caption">{friend.venue}</div>
                          <div className="text-xs text-muted-foreground mt-1">{friend.time}</div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant="accept" className="text-xs">
                            Conta aberta
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            Ver local
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>



              {/* Explorar Pessoas - Cards mais altos */}
              <Card className={COMPONENT_VARIANTS.card.standard}>
                <h3 className="text-base font-semibold flex items-center mb-4">
                  <Search className="w-5 h-5 mr-2 text-primary" />
                  Explorar Pessoas
                </h3>
                <div className={COMPONENT_VARIANTS.spacing.md}>
                  <Button 
                    variant="outline" 
                    className={`w-full justify-start h-14 ${COMPONENT_VARIANTS.button.outline}`}
                    onClick={() => navigate('/social?tab=pessoas')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Conhecer pessoas novas</div>
                        <div className="text-caption">Descubra conexões próximas</div>
                      </div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`w-full justify-start h-14 ${COMPONENT_VARIANTS.button.outline}`}
                    onClick={() => navigate('/social?tab=pessoas')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Ver quem está próximo</div>
                        <div className="text-caption">Pessoas na sua região</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className={LAYOUT.section}>
              <Card className={COMPONENT_VARIANTS.card.standard}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold flex items-center">
                    <History className="w-5 h-5 mr-2 text-primary" />
                    Histórico de Check-ins
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {historicCheckins.length}
                  </Badge>
                </div>
                <div className={COMPONENT_VARIANTS.spacing.md}>
                  {historicCheckins.map((checkin) => (
                    <div key={checkin.id} className={`${COMPONENT_VARIANTS.padding.md} bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors`}>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={checkin.image} 
                          alt={checkin.venue}
                          className="w-16 h-16 rounded-xl object-cover shadow-sm"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{checkin.venue}</h4>
                          <div className="flex items-center space-x-2 text-caption mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{checkin.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
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
                            <div className="flex items-center space-x-1 mt-2">
                              {renderStars(checkin.rating)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            Ver
                          </Button>
                          {checkin.status === 'Finalizado' && checkin.rating === 0 && (
                            <Button variant="outline" size="sm" className="text-xs h-8 text-yellow-600 border-yellow-300">
                              Avaliar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="ativo" className={LAYOUT.section}>
              <StatusTab
                peopleHere={peopleHere}
                tableCode={tableCode}
                setTableCode={setTableCode}
                onCheckIn={handleCheckIn}
                onRSVP={handleRSVP}
              />
            </TabsContent>

            <TabsContent value="cardapio" className={LAYOUT.section}>
              <OrderTab
                orderItems={orderItems}
                setOrderItems={setOrderItems}
                menuItems={menuItems}
              />
            </TabsContent>
          </Tabs>
        </div>
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
