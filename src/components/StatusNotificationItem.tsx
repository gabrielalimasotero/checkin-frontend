
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle } from 'lucide-react';

interface StatusNotificationItemProps {
  notification: {
    id: number;
    type: 'like' | 'comment';
    user: string;
    avatar: string;
    action: string;
    status: string;
    comment?: string;
    time: string;
  };
}

const StatusNotificationItem = ({ notification }: StatusNotificationItemProps) => {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={notification.avatar} />
          <AvatarFallback>{notification.user.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-sm font-medium">{notification.user}</span>
            <span className="text-sm text-gray-600">{notification.action}</span>
            {notification.type === 'like' && <Heart className="w-3 h-3 text-red-500" />}
            {notification.type === 'comment' && <MessageCircle className="w-3 h-3 text-blue-500" />}
          </div>
          <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 mb-1">
            "{notification.status}"
          </div>
          {notification.comment && (
            <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-1">
              💬 {notification.comment}
            </div>
          )}
          <span className="text-xs text-gray-500">{notification.time}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusNotificationItem;
