
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Share } from 'lucide-react';

interface CommunityGroupItemProps {
  group: {
    id: number;
    name: string;
    description: string;
    members: number;
    category: string;
    recentEvent?: {
      id: number;
      title: string;
      venue: string;
      date: string;
      time: string;
      organizer: string;
      rsvpCount: number;
      maxCapacity: number;
    };
  };
  onRSVP: (eventId: number, response: 'yes' | 'no') => void;
  onShareToWhatsApp: (eventId: number) => void;
}

const CommunityGroupItem = ({ group, onRSVP, onShareToWhatsApp }: CommunityGroupItemProps) => {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{group.name}</h4>
          <p className="text-xs text-gray-600 mb-1">{group.description}</p>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">{group.category}</Badge>
            <span className="text-xs text-gray-500">{group.members} membros</span>
          </div>
        </div>
      </div>
      
      {group.recentEvent && (
        <div className="bg-gray-50 p-2 rounded mt-2">
          <div className="flex items-center justify-between mb-1">
            <h5 className="text-xs font-medium">{group.recentEvent.title}</h5>
            <Badge className="text-xs bg-green-100 text-green-700">
              {group.recentEvent.rsvpCount}/{group.recentEvent.maxCapacity}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mb-1">Por {group.recentEvent.organizer}</p>
          <div className="text-xs text-gray-500 mb-2">
            <span>📍 {group.recentEvent.venue}</span>
            <span className="ml-3">🕒 {group.recentEvent.date} às {group.recentEvent.time}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onRSVP(group.recentEvent!.id, 'no')}
              className="flex-1 text-xs h-6"
            >
              Não vou
            </Button>
            <Button 
              size="sm" 
              onClick={() => onRSVP(group.recentEvent!.id, 'yes')}
              className="flex-1 text-xs h-6"
            >
              <Check className="w-3 h-3 mr-1" />
              Confirmar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onShareToWhatsApp(group.recentEvent!.id)}
              className="text-xs h-6 px-2"
            >
              <Share className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityGroupItem;
