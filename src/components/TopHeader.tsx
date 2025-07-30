import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopHeader = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-sm mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg font-bold text-primary">CheckIn</h1>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Buscar lugares, pessoas, eventos..."
              className="pl-10 bg-muted/50 border-0 focus:bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
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
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;