import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, MapPin, User, Plus } from "lucide-react";
import { useState } from "react";
import CheckInDialog from "./CheckInDialog";

const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "checkin", label: "Check In", icon: MapPin, path: "/checkin" },
    { id: "plus", label: "", icon: Plus, isSpecial: true },
    { id: "social", label: "Explorar", icon: Users, path: "/social" },
    { id: "profile", label: "Perfil", icon: User, path: "/profile" },
  ];

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.startsWith('/home')) return 'home';
    if (path.startsWith('/social')) return 'social';
    if (path.startsWith('/checkin')) return 'checkin';
    if (path.startsWith('/profile')) return 'profile';
    return '';
  };

  const currentTab = getCurrentTab();

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-2 py-2 z-50 max-w-sm mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            
            if (item.isSpecial) {
              return (
                <Button
                  key={item.id}
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground p-0"
                  onClick={() => setShowCheckInDialog(true)}
                >
                  <IconComponent className="w-6 h-6" />
                </Button>
              );
            }
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex flex-col items-center space-y-1 h-14 py-2 px-3 min-w-0 ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => navigate(item.path)}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
      
      <CheckInDialog 
        open={showCheckInDialog} 
        onOpenChange={setShowCheckInDialog} 
      />
    </>
  );
};

export default MainNavigation;