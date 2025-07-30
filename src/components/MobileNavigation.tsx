
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Search, User } from "lucide-react";

interface MobileNavigationProps {
  currentPage: string;
}

const MobileNavigation = ({ currentPage }: MobileNavigationProps) => {
  const navigate = useNavigate();

  const navItems = [
    { id: "home", label: "Feed", icon: Home, path: "/home" },
    { id: "checkin", label: "Check-in", icon: MapPin, path: "/checkin" },
    { id: "social", label: "Explorar", icon: Search, path: "/social" },
    { id: "profile", label: "Perfil", icon: User, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 max-w-sm mx-auto">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center space-y-0.5 h-12 py-1 px-2 min-w-0 ${
                isActive 
                  ? 'text-checkin-turquoise-600 bg-checkin-turquoise-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => navigate(item.path)}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'fill-checkin-turquoise-600' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
