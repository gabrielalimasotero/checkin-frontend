
import { useState, useEffect } from "react";
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
  const [grupos, setGrupos] = useState<any[]>([]);
  const [homens, setHomens] = useState<any[]>([]);
  const [mulheres, setMulheres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados da API quando o dialog abrir
  useEffect(() => {
    const loadPeopleData = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        // Implementar chamadas da API para grupos e pessoas próximas
        // const gruposData = await listNearbyGroups();
        // const peopleData = await listNearbyPeople();
        // setGrupos(gruposData || []);
        // setHomens(peopleData?.filter(p => p.gender === 'male') || []);
        // setMulheres(peopleData?.filter(p => p.gender === 'female') || []);
        
        // Por enquanto, arrays vazios até implementar API
        setGrupos([]);
        setHomens([]);
        setMulheres([]);
      } catch (error) {
        console.error('Erro ao carregar dados de pessoas:', error);
        setGrupos([]);
        setHomens([]);
        setMulheres([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPeopleData();
  }, [isOpen]);

  const getPeopleByFilter = (filter: string) => {
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
            {isLoading ? (
              <div className="text-sm text-gray-500 p-4 text-center">
                Procurando pessoas próximas...
              </div>
            ) : people.length === 0 ? (
              <div className="text-sm text-gray-500 p-4 text-center">
                {selectedFilter === "grupos" 
                  ? "Nenhum grupo próximo encontrado. Que tal criar um novo grupo?"
                  : `Nenhuma pessoa próxima encontrada na categoria ${selectedFilter}.`}
              </div>
            ) : (
              people.map((person) => (
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
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetNewPeopleDialog;
