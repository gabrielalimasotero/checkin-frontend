
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Users, DollarSign, Target } from "lucide-react";

interface SuggestionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuggestionsDialog = ({ isOpen, onClose }: SuggestionsDialogProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  const filterOptions = [
    { id: "route", label: "No caminho", icon: MapPin, active: startLocation || endLocation },
    { id: "friends", label: "Onde tem amigos", icon: Users, active: false },
    { id: "promotions", label: "Onde tem promoção", icon: DollarSign, active: false }
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId];
      
      // Clear route fields if "route" filter is removed
      if (filterId === "route" && !newFilters.includes("route")) {
        setStartLocation("");
        setEndLocation("");
      }
      
      return newFilters;
    });
  };

  const applyFilters = () => {
    console.log("Aplicando filtros:", { selectedFilters, startLocation, endLocation });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Sugestões Personalizadas</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Route Selection - Only show when "No caminho" is selected */}
          {selectedFilters.includes("route") && (
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                De onde está saindo e para onde vai
              </h4>
              <div className="space-y-2">
                <Input
                  placeholder="De onde você está saindo..."
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Para onde você vai..."
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  className="text-sm"
                />
              </div>
            </Card>
          )}

          {/* Filter Options */}
          <Card className="p-3">
            <h4 className="font-medium text-sm mb-3 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </h4>
            <div className="space-y-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedFilters.includes(option.id) ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => toggleFilter(option.id)}
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                  {option.active && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Ativo
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </Card>

          {/* Selected Filters Preview */}
          {selectedFilters.length > 0 && (
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-2">Filtros Selecionados:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedFilters.map((filterId) => {
                  const filter = filterOptions.find(f => f.id === filterId);
                  return (
                    <Badge key={filterId} variant="secondary" className="text-xs">
                      {filter?.label}
                    </Badge>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600"
              onClick={applyFilters}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionsDialog;
