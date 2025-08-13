import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Users, MapPin, Hash } from "lucide-react";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Friend {
  id: number;
  name: string;
  avatar: string;
  isSelected: boolean;
}

const CreateGroupDialog = ({ isOpen, onClose }: CreateGroupDialogProps) => {
  const [groupName, setGroupName] = useState("");
  const [radius, setRadius] = useState("5");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [availableFriends, setAvailableFriends] = useState<Friend[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  // Carregar amigos da API quando o dialog abrir
  useEffect(() => {
    const loadFriends = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoadingFriends(true);
        // Implementar chamada da API para listar amigos
        // const friends = await listFriends();
        // setAvailableFriends(friends.map(f => ({ ...f, isSelected: false })));
        setAvailableFriends([]); // Por enquanto, lista vazia até implementar API
      } catch (error) {
        console.error('Erro ao carregar amigos:', error);
        setAvailableFriends([]);
      } finally {
        setIsLoadingFriends(false);
      }
    };

    loadFriends();
  }, [isOpen]);

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      // Aqui você implementaria a lógica para criar o grupo
      console.log("Criando grupo:", {
        name: groupName,
        radius: parseInt(radius),
        interests,
        invitedFriends: selectedFriends
      });
      
      // Reset form
      setGroupName("");
      setRadius("5");
      setInterests([]);
      setSelectedFriends([]);
      
      onClose();
    }
  };

  const isFormValid = groupName.trim() && interests.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Criar Novo Grupo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Nome do Grupo */}
          <div className="space-y-2">
            <Label htmlFor="groupName">Nome do Grupo</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Galera da Champions"
              className="w-full"
            />
          </div>

          {/* Raio */}
          <div className="space-y-2">
            <Label htmlFor="radius">Raio de Atividade</Label>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 km</SelectItem>
                <SelectItem value="3">3 km</SelectItem>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="20">20 km</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Pessoas dentro deste raio poderão ver e participar do grupo
            </p>
          </div>

          {/* Interesses */}
          <div className="space-y-2">
            <Label>Interesses do Grupo</Label>
            <div className="flex space-x-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Adicionar interesse"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={addInterest}
                disabled={!newInterest.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <Hash className="w-3 h-3" />
                    <span>{interest}</span>
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Convidar Amigos */}
          <div className="space-y-2">
            <Label>Convidar Amigos</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {isLoadingFriends ? (
                <div className="text-sm text-gray-500 p-4 text-center">
                  Carregando amigos...
                </div>
              ) : availableFriends.length === 0 ? (
                <div className="text-sm text-gray-500 p-4 text-center">
                  Nenhum amigo encontrado. Faça amizades no app para convidá-los para grupos!
                </div>
              ) : (
                availableFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                      selectedFriends.includes(friend.id)
                        ? 'bg-primary/10 border-primary/30'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => toggleFriendSelection(friend.id)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm font-medium">{friend.name}</span>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedFriends.includes(friend.id)
                        ? 'bg-primary border-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedFriends.includes(friend.id) && (
                        <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {selectedFriends.length > 0 && (
              <p className="text-xs text-gray-500">
                {selectedFriends.length} amigo{selectedFriends.length !== 1 ? 's' : ''} selecionado{selectedFriends.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Botões */}
          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!isFormValid}
              className="flex-1"
            >
              Criar Grupo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog; 