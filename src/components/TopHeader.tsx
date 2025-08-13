import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { listNotifications } from "@/lib/api";

const TopHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [invitesCount, setInvitesCount] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listNotifications({ limit: 50 });
        const count = (data || []).filter((n) => !n.is_read).length;
        setUnreadCount(count);
        
        // Implementar contagem de convites quando API estiver disponível
        setInvitesCount(0);
      } catch (e) {
        // Em caso de erro, não mostrar badge
        setUnreadCount(0);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-sm mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg font-bold text-primary font-ubuntu">CheckIn</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 relative"
              onClick={() => navigate('/invites')}
              title="Meus convites"
            >
              <Mail className="w-5 h-5" />
              {invitesCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-destructive rounded-full flex items-center justify-center">
                  <span className="text-[10px] leading-none text-white font-bold">{invitesCount}</span>
                </div>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => navigate('/messages')}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 relative"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-destructive rounded-full flex items-center justify-center">
                  <span className="text-[10px] leading-none text-white font-bold">{unreadCount}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;