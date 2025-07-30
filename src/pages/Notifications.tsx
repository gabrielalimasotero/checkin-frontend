
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Check, X, Heart, Utensils, Share, ExternalLink } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();

  const handleRSVP = (eventId: number, response: 'yes' | 'no') => {
    console.log(`RSVP ${response} para evento ${eventId}`);
  };

  const handleShareToWhatsApp = (eventId: number) => {
    console.log(`Compartilhar evento ${eventId} no WhatsApp`);
  };

  // Updated urgent invitations with new styling
  const urgentInvitations = [
    {
      id: 1,
      type: 'invitation',
      host: "Júlia",
      title: "niver adiantado!!",
      venue: "Casa da Júlia",
      date: "Hoje",
      time: "18:00",
      urgency: 'happening_now'
    }
  ];

  const interestNotifications = [
    {
      id: 2,
      type: 'promotion',
      title: 'Promoção em um dos seus favoritos!',
      restaurant: 'Restaurante Bella Vista',
      promotion: '20% de desconto em pratos principais',
      validUntil: 'até amanhã',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      urgency: 'medium'
    },
    {
      id: 3,
      type: 'interest_match',
      title: 'Evento baseado nos seus interesses',
      event: 'Champions League no Sports Bar',
      match: 'Real Madrid vs Barcelona',
      time: 'hoje às 21:00',
      venue: 'Sports Bar Champions',
      rsvpCount: 15,
      urgency: 'medium'
    }
  ];

  return (
    <div className="min-h-screen bg-checkin-pearl-50 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-checkin-turquoise-500 to-checkin-ocean-600 shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/home')}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-white">Notificações</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Convites Acontecendo Agora */}
        {urgentInvitations.map((invitation) => (
          <div key={invitation.id} className="bg-gradient-to-r from-checkin-turquoise-50 to-checkin-ocean-50 border border-checkin-turquoise-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-checkin-turquoise-500 text-white text-xs">ACONTECENDO AGORA</Badge>
              <span className="text-xs text-checkin-turquoise-700 font-medium">{invitation.date}</span>
            </div>
            <h4 className="font-medium text-checkin-turquoise-800 text-sm mb-1">
              {invitation.host} convidou você: {invitation.title}
            </h4>
            <div className="text-xs text-checkin-turquoise-700 mb-3">
              <span>📍 {invitation.venue}</span>
              <span className="ml-3">🕒 {invitation.time}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleRSVP(invitation.id, 'no')}
                className="flex-1 text-xs h-7 border-checkin-turquoise-300 text-checkin-turquoise-700"
              >
                Não vou
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleRSVP(invitation.id, 'yes')}
                className="flex-1 text-xs h-7 bg-checkin-turquoise-600 hover:bg-checkin-turquoise-700"
              >
                <Check className="w-3 h-3 mr-1" />
                Confirmar
              </Button>
            </div>
          </div>
        ))}

        {/* Baseado nos seus interesses */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-checkin-pearl-200">
          <h3 className="font-semibold mb-3 flex items-center text-checkin-ocean-700">
            <Heart className="w-4 h-4 mr-2" />
            Baseado nos seus interesses
          </h3>
          <div className="space-y-3">
            {interestNotifications.map((notification) => (
              <div key={notification.id} className="border rounded-lg p-3 border-checkin-pearl-200">
                {notification.type === 'promotion' && (
                  <>
                    <div className="flex items-start space-x-3 mb-2">
                      <img 
                        src={notification.image} 
                        alt={notification.restaurant}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <Badge className="text-xs bg-green-100 text-green-700 mb-1">PROMOÇÃO</Badge>
                        <h4 className="font-medium text-sm text-checkin-ocean-700">{notification.title}</h4>
                        <p className="text-sm text-checkin-ocean-600">{notification.restaurant}</p>
                        <p className="text-sm font-medium text-green-600">{notification.promotion}</p>
                        <p className="text-xs text-checkin-ocean-400">{notification.validUntil}</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full text-xs bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600">
                      <Utensils className="w-3 h-3 mr-1" />
                      Ver no restaurante
                    </Button>
                  </>
                )}
                
                {notification.type === 'interest_match' && (
                  <>
                    <Badge className="text-xs bg-blue-100 text-blue-700 mb-2">SEUS INTERESSES</Badge>
                    <h4 className="font-medium text-sm mb-1 text-checkin-ocean-700">{notification.title}</h4>
                    <p className="text-sm text-checkin-ocean-600 mb-1">{notification.match}</p>
                    <div className="text-xs text-checkin-ocean-500 mb-2">
                      <span>📍 {notification.venue} • 🕒 {notification.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-3 h-3 text-checkin-ocean-500" />
                      <span className="text-xs text-checkin-ocean-600">{notification.rsvpCount} pessoas conectáveis</span>
                    </div>
                    <Button size="sm" className="w-full text-xs bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600">
                      <Check className="w-3 h-3 mr-1" />
                      Confirmar presença
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
