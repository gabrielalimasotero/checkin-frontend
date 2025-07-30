import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Camera, MapPin, Users, Eye, EyeOff } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import MainNavigation from "@/components/MainNavigation";

const Post = () => {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("");
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "friends" | "private">("friends");

  const handlePost = () => {
    if (statusText.trim()) {
      console.log("Status posted:", {
        text: statusText,
        location: isLocationEnabled,
        visibility
      });
      setStatusText("");
      navigate("/home");
    }
  };

  const visibilityOptions = [
    { id: "public", label: "Público", icon: Eye, description: "Visível para todos" },
    { id: "friends", label: "Amigos", icon: Users, description: "Apenas amigos" },
    { id: "private", label: "Privado", icon: EyeOff, description: "Só você vê" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      <div className="max-w-sm mx-auto p-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Novo Status</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate("/home")}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium mb-2">Carlos Santos</div>
              <Textarea
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                placeholder="No que você está pensando?"
                className="min-h-[120px] resize-none border-0 p-0 focus:ring-0 text-base"
                autoFocus
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPhotoMode(!isPhotoMode)}
                className={isPhotoMode ? "text-primary" : ""}
              >
                <Camera className="w-4 h-4 mr-2" />
                Foto
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLocationEnabled(!isLocationEnabled)}
                className={isLocationEnabled ? "text-primary" : ""}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Localização
              </Button>
            </div>

            {isLocationEnabled && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                📍 São Paulo, SP
              </div>
            )}

            {/* Visibility Settings */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Visibilidade</div>
              <div className="flex space-x-2">
                {visibilityOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Button
                      key={option.id}
                      variant={visibility === option.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVisibility(option.id as any)}
                      className="flex-1"
                    >
                      <IconComponent className="w-4 h-4 mr-1" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                {visibilityOptions.find(o => o.id === visibility)?.description}
              </div>
            </div>
          </div>

          {/* Character Count and Post Button */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              {statusText.length}/280
            </div>
            <Button 
              onClick={handlePost}
              disabled={!statusText.trim()}
              className="px-6"
            >
              Publicar
            </Button>
          </div>
        </Card>
      </div>

      <MainNavigation />
    </div>
  );
};

export default Post;