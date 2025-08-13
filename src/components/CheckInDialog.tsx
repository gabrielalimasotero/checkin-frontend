import { useState, useRef } from "react";
import { createCheckin } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Globe, Lock, Camera, X } from "lucide-react";

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckInDialog = ({ open, onOpenChange }: CheckInDialogProps) => {
  const [checkInType, setCheckInType] = useState("public");
  const [postText, setPostText] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { supabaseUser, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 4)); // Máximo 4 imagens
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!user?.id) return;
    try {
      setIsSubmitting(true);
      // Pegar venue_id real do contexto/rota
      const venueId = (window as any).CURRENT_VENUE_ID || '00000000-0000-0000-0000-000000000000';
      await createCheckin({
        user_id: user.id,
        venue_id: venueId,
        review: postText || null,
        photos: null,
        is_anonymous: checkInType !== 'public',
      });
      onOpenChange(false);
      setPostText("");
      setSelectedImages([]);
    } catch (e) {
      console.error('Erro ao publicar check-in:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCheckInType = () => {
    setCheckInType(prev => prev === "public" ? "private" : "public");
  };

  const characterCount = postText.length;
  const isOverLimit = characterCount > 280;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[85vh] overflow-y-auto w-[calc(100vw-2rem)]">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-primary">Você está em Boteco da Maria</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 px-1">
          {/* Toggle de Check-in Público/Privado */}
          <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2">
              {checkInType === "public" ? (
                <Globe className="w-4 h-4 text-primary" />
              ) : (
                <Lock className="w-4 h-4 text-primary" />
              )}
              <span className="font-medium text-sm">
                Check-in {checkInType === "public" ? "Público" : "Privado"}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs h-7"
              onClick={toggleCheckInType}
            >
              {checkInType === "public" ? "Tornar Privado" : "Tornar Público"}
            </Button>
          </div>

          {/* Área de Post */}
          <div className="space-y-3 p-3 rounded-lg border bg-muted/10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">
                Compartilhe algo sobre o Boteco da Maria
              </label>
              <Textarea
                placeholder="O que você está achando deste lugar? (máximo 280 caracteres)"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className={`min-h-[80px] resize-none text-sm ${isOverLimit ? "border-destructive" : ""}`}
                maxLength={300}
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  📍 Localização validada
                </span>
                <span className={`${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                  {characterCount}/280
                </span>
              </div>
            </div>

            {/* Seleção de Imagens */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={selectedImages.length >= 4}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Adicionar Fotos
                </Button>
                <span className="text-xs text-muted-foreground">
                  {selectedImages.length}/4
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Preview das Imagens */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-16 object-cover rounded border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botão Publicar dentro do bloco */}
            <div className="pt-1">
              <Button 
                onClick={handlePost} 
                className="w-full h-9 bg-primary hover:bg-primary/90"
                disabled={isOverLimit || isSubmitting}
              >
                Publicar
              </Button>
            </div>
          </div>

          {/* Botão Cancelar */}
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="w-full h-9"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInDialog;