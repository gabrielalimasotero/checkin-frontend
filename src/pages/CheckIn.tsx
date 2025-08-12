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
import { listEvents, listVenues } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  COMPONENT_VARIANTS, 
  COMMON_CLASSES, 
  LAYOUT,
  INTERACTIVE 
} from '@/lib/design-system';

const CheckIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [orderItems, setOrderItems] = useState([]);
  const [tableCode, setTableCode] = useState("");
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showPaymentCompleteDialog, setShowPaymentCompleteDialog] = useState(false);
  const [isNearVenue, setIsNearVenue] = useState(false);
  const [activeTab, setActiveTab] = useState("geral");
  const [todayEvents, setTodayEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar se há parâmetro de aba na URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['geral', 'historico', 'ativo', 'cardapio'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Carregar dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [eventsData, venuesData] = await Promise.all([
          listEvents({ limit: 10 }),
          listVenues({ limit: 5 })
        ]);
        setTodayEvents(eventsData || []);
        setVenues(venuesData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Current venue será obtido da API quando implementarmos check-ins
  const currentVenue = null;

  // Check-ins serão obtidos da API
  const myCheckins = [];

  // Amigos com contas abertas serão obtidos da API
  const friendsWithOpenTabs = [];



  // Histórico de check-ins será obtido da API
  const historicCheckins = [];



  // Pessoas no local serão obtidas da API
  const peopleHere = [];

  // Menu será obtido da API
  const menuItems = [];

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
                onClick={() => navigate('/messages')}
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

              {/* Contas Abertas - Incluindo o usuário no topo */}
              <Card className={COMPONENT_VARIANTS.card.standard}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Contas Abertas
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {friendsWithOpenTabs.length + (currentVenue ? 1 : 0)}
                  </Badge>
                </div>
                <div className={COMPONENT_VARIANTS.spacing.md}>
                  {/* Check-in do usuário no topo */}
                  {currentVenue ? (
                    <div className={`${COMPONENT_VARIANTS.padding.md} border-l-4 border-primary/50 rounded-lg bg-primary/10 hover:bg-primary/15 transition-colors`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30">
                          <span className="text-primary font-bold text-sm">Eu</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Você</div>
                          <div className="text-caption">{currentVenue.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">Desde {currentVenue.checkInTime}</div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            Ver local
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`${COMPONENT_VARIANTS.padding.md} border-l-4 border-muted rounded-lg bg-muted/10`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-muted-foreground">Nenhum check-in ativo</div>
                          <div className="text-xs text-muted-foreground mt-1">Faça check-in em um local para começar</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7"
                          onClick={() => navigate('/home')}
                        >
                          Explorar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Check-ins dos amigos */}
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
