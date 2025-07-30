
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Check, Utensils } from 'lucide-react';

interface InterestNotificationItemProps {
  notification: {
    id: number;
    type: 'promotion' | 'interest_match';
    title: string;
    restaurant?: string;
    promotion?: string;
    validUntil?: string;
    image?: string;
    event?: string;
    match?: string;
    time?: string;
    venue?: string;
    rsvpCount?: number;
  };
}

const InterestNotificationItem = ({ notification }: InterestNotificationItemProps) => {
  return (
    <div className="border rounded-lg p-3">
      {notification.type === 'promotion' && (
        <>
          <div className="flex items-start space-x-3 mb-2">
            <img 
              src={notification.image} 
              alt={notification.restaurant}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <Badge className="text-xs bg-red-100 text-red-700 mb-1 font-semibold">PROMOÇÃO</Badge>
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <p className="text-sm text-gray-600">{notification.restaurant}</p>
              <p className="text-sm font-medium text-green-600">{notification.promotion}</p>
              <p className="text-xs text-gray-500">{notification.validUntil}</p>
            </div>
          </div>
          <Button size="sm" className="w-full text-xs">
            <Utensils className="w-3 h-3 mr-1" />
            Ver no restaurante
          </Button>
        </>
      )}
      
      {notification.type === 'interest_match' && (
        <>
          <Badge variant="accept" className="text-xs mb-2 font-semibold">SEUS INTERESSES</Badge>
          <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
          <p className="text-sm text-gray-600 mb-1">{notification.match}</p>
          <div className="text-xs text-gray-500 mb-2">
            <span>📍 {notification.venue} • 🕒 {notification.time}</span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600">{notification.rsvpCount} pessoas conectáveis</span>
          </div>
          <Button size="sm" className="w-full text-xs">
            <Check className="w-3 h-3 mr-1" />
            Confirmar presença
          </Button>
        </>
      )}
    </div>
  );
};

export default InterestNotificationItem;
