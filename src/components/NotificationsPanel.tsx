
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Calendar, Heart, MessageCircle } from 'lucide-react';
import StatusNotificationItem from './StatusNotificationItem';
import InterestNotificationItem from './InterestNotificationItem';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  // Status notifications - includes interactions with user's own posts
  const statusNotifications = [
    {
      id: 1,
      type: 'like' as const,
      user: 'Ana Silva',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      action: 'curtiu seu status',
      status: 'Quem tem recomendação de sushi aqui pela ZN? 🍣',
      time: 'há 5 min'
    },
    {
      id: 2,
      type: 'comment' as const,
      user: 'Carlos Santos',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      action: 'comentou em seu status',
      status: 'Quem tem recomendação de sushi aqui pela ZN? 🍣',
      comment: 'Eu conheço um lugar ótimo! Te mando no privado',
      time: 'há 10 min'
    },
    {
      id: 3,
      type: 'like' as const,
      user: 'Mariana Costa',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      action: 'curtiu seu status',
      status: 'Quem tem recomendação de sushi aqui pela ZN? 🍣',
      time: 'há 15 min'
    },
    {
      id: 4,
      type: 'comment' as const,
      user: 'João Silva',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      action: 'comentou em seu status',
      status: 'Galera, acabei de chegar no Boteco da Maria! 🍻',
      comment: 'Que legal! Também estou pensando em ir hoje!',
      time: 'há 20 min'
    },
    {
      id: 5,
      type: 'like' as const,
      user: 'Patricia Lima',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      action: 'curtiu seu status',
      status: 'Galera, acabei de chegar no Boteco da Maria! 🍻',
      time: 'há 25 min'
    },
    {
      id: 6,
      type: 'comment' as const,
      user: 'Rafael Costa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      action: 'comentou em seu status',
      status: 'Alguém sabe onde tem um bom happy hour hoje? 🍺',
      comment: 'O Bar do Centro está com promoção até as 19h!',
      time: 'há 30 min'
    },
    {
      id: 7,
      type: 'like' as const,
      user: 'Lucas Oliveira',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      action: 'curtiu seu status',
      status: 'Alguém sabe onde tem um bom happy hour hoje? 🍺',
      time: 'há 35 min'
    }
  ];

  // Interest-based notifications with updated colors
  const interestNotifications = [
    {
      id: 1,
      type: 'promotion' as const,
      title: 'Promoção no seu restaurante favorito!',
      restaurant: 'Restaurante Bella Vista',
      promotion: '20% de desconto em pratos principais',
      validUntil: 'até amanhã',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      type: 'interest_match' as const,
      title: 'Evento baseado nos seus interesses',
      event: 'Champions League no Sports Bar',
      match: 'Real Madrid vs Barcelona',
      time: 'hoje às 21:00',
      venue: 'Sports Bar Champions',
      rsvpCount: 15
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Notificações</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            {/* Status Notifications */}
            <div className="p-4 border-b">
              <h3 className="font-semibold mb-3 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Seus Status
              </h3>
              <div className="space-y-3">
                {statusNotifications.map((notification) => (
                  <StatusNotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            </div>

            {/* Interest-based Notifications */}
            <div className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Baseado nos seus interesses
              </h3>
              <div className="space-y-3">
                {interestNotifications.map((notification) => (
                  <InterestNotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;
