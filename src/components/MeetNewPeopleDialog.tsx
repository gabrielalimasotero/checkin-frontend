
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Heart, MapPin, X, Filter } from "lucide-react";

interface MeetNewPeopleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MeetNewPeopleDialog = ({ isOpen, onClose }: MeetNewPeopleDialogProps) => {
  const [selectedFilter, setSelectedFilter] = useState<"grupos" | "homens" | "mulheres">("grupos");

  const getPeopleByFilter = (filter: string) => {
    const grupos = [
      {
        id: 1,
        name: "Grupo da Sinuca",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        description: "3 caras procurando mais um pra fechar uma mesa de sinuca",
        venue: "Bar do Bilhar",
        time: "agora",
        members: ["João", "Pedro", "Carlos"],
        type: "group"
      },
      {
        id: 2,
        name: "Galera da Cerveja",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        description: "Grupo procurando pessoas para dividir petiscos",
        venue: "Cervejaria Artesanal",
        time: "há 15 min",
        members: ["Ana", "Julia", "Marina"],
        type: "group"
      }
    ];

    const homens = [
      {
        id: 1,
        name: "Rafael Silva",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        venue: "Academia Fitness Pro",
        time: "há 1h",
        commonInterest: "Fitness",
        type: "individual"
      },
      {
        id: 2,
        name: "Diego Alves",
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=50&h=50&fit=crop&crop=face",
        venue: "Café Blues",
        time: "há 45 min",
        commonInterest: "Jazz",
        type: "individual"
      }
    ];

    const mulheres = [
      {
        id: 1,
        name: "Camila Santos",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
        venue: "Sushi Zen",
        time: "há 20 min",
        commonInterest: "Culinária Japonesa",
        type: "individual"
      },
      {
        id: 2,
        name: "Isabella Costa",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face",
        venue: "Restaurante Gourmet",
        time: "agora",
        commonInterest: "Fine Dining",
        type: "individual"
      }
    ];

    switch (filter) {
      case "grupos": return grupos;
      case "homens": return homens;
      case "mulheres": return mulheres;
      default: return [];
    }
  };

  const people = getPeopleByFilter(selectedFilter);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-checkin-ocean-700">Conhecer Pessoas Novas</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-checkin-ocean-500" />
            <div className="flex space-x-2 flex-1">
              <Button
                variant={selectedFilter === "grupos" ? "default" : "outline"}
                size="sm"
                className={`flex-1 text-xs ${selectedFilter === "grupos" ? "bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600" : "border-checkin-turquoise-300 text-checkin-turquoise-700 hover:bg-checkin-turquoise-50"}`}
                onClick={() => setSelectedFilter("grupos")}
              >
                Grupos
              </Button>
              <Button
                variant={selectedFilter === "homens" ? "default" : "outline"}
                size="sm"
                className={`flex-1 text-xs ${selectedFilter === "homens" ? "bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600" : "border-checkin-turquoise-300 text-checkin-turquoise-700 hover:bg-checkin-turquoise-50"}`}
                onClick={() => setSelectedFilter("homens")}
              >
                Homens
              </Button>
              <Button
                variant={selectedFilter === "mulheres" ? "default" : "outline"}
                size="sm"
                className={`flex-1 text-xs ${selectedFilter === "mulheres" ? "bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600" : "border-checkin-turquoise-300 text-checkin-turquoise-700 hover:bg-checkin-turquoise-50"}`}
                onClick={() => setSelectedFilter("mulheres")}
              >
                Mulheres
              </Button>
            </div>
          </div>

          {/* Lista de Pessoas */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {people.map((person) => (
              <Card key={person.id} className="p-3 border-checkin-pearl-200">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={person.avatar} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-checkin-ocean-700">{person.name}</h4>
                    <div className="flex items-center space-x-1 text-xs text-checkin-ocean-500">
                      <MapPin className="w-3 h-3" />
                      <span>{person.venue} • {person.time}</span>
                    </div>
                    {person.description && (
                      <p className="text-xs text-checkin-turquoise-600">{person.description}</p>
                    )}
                    {person.commonInterest && (
                      <p className="text-xs text-checkin-ocean-600">{person.commonInterest}</p>
                    )}
                    {person.members && (
                      <p className="text-xs text-checkin-turquoise-600">
                        {person.members.join(", ")} + você
                      </p>
                    )}
                  </div>
                  <Button size="sm" className="bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600 text-white text-xs">
                    Conectar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetNewPeopleDialog;
