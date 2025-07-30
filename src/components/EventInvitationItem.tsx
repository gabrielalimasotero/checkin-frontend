
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface EventInvitationItemProps {
  invitation: {
    id: number;
    host: string;
    title: string;
    venue: string;
    date: string;
    time: string;
    message: string;
  };
  onRSVP: (eventId: number, response: 'yes' | 'no') => void;
}

const EventInvitationItem = ({ invitation, onRSVP }: EventInvitationItemProps) => {
  return (
    <div className="border rounded-lg p-3 bg-checkin-turquoise-50 border-checkin-turquoise-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-checkin-turquoise-800 text-sm">
            {invitation.host} convidou você: {invitation.title}
          </h4>
          <p className="text-xs text-checkin-turquoise-700 mt-1 mb-2">"{invitation.message}"</p>
          <div className="text-xs text-checkin-turquoise-600">
            <span>📍 {invitation.venue}</span>
            <span className="ml-3">🕒 {invitation.date} às {invitation.time}</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onRSVP(invitation.id, 'no')}
          className="flex-1 text-xs h-7 border-checkin-turquoise-300 text-checkin-turquoise-700"
        >
          Não vou
        </Button>
        <Button 
          size="sm" 
          onClick={() => onRSVP(invitation.id, 'yes')}
          className="flex-1 text-xs h-7 bg-checkin-turquoise-600 hover:bg-checkin-turquoise-700"
        >
          <Check className="w-3 h-3 mr-1" />
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default EventInvitationItem;
