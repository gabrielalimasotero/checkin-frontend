
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Image, Users, X } from "lucide-react";

interface PostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onPost?: (content: string, tags: string[], location?: string) => void;
}

const PostComposer = ({ isOpen, onClose, onPost }: PostComposerProps) => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [location, setLocation] = useState("");

  if (!isOpen) return null;

  const handlePost = () => {
    if (!content.trim()) return;
    onPost?.(content, tags, location);
    setContent("");
    setTags([]);
    setLocation("");
    setShowTagInput(false);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 max-w-sm mx-auto">
      <Card className="w-full m-3 mb-20 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Nova avaliação</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-start space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face" />
            <AvatarFallback>EU</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="Como foi sua experiência?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] resize-none text-sm"
            />
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <span key={tag} className="bg-checkin-turquoise-100 text-checkin-turquoise-700 px-2 py-1 rounded-full text-xs flex items-center">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {showTagInput && (
              <div className="flex space-x-2 mt-2">
                <input
                  type="text"
                  placeholder="Adicionar tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 text-xs border rounded px-2 py-1"
                />
                <Button size="sm" onClick={addTag} className="text-xs">
                  Adicionar
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-3">
                <button className="text-gray-500 hover:text-checkin-turquoise-600">
                  <Image className="w-4 h-4" />
                </button>
                <button 
                  className="text-gray-500 hover:text-checkin-turquoise-600"
                  onClick={() => setShowTagInput(!showTagInput)}
                >
                  #
                </button>
                <button className="text-gray-500 hover:text-checkin-turquoise-600">
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
              
              <Button 
                size="sm" 
                onClick={handlePost}
                disabled={!content.trim()}
                className="bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600 text-xs"
              >
                Avaliar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostComposer;
