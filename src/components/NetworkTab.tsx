import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, MapPin, Star, Verified, MoreHorizontal, Trash2 } from "lucide-react";

const NetworkTab = () => {
  const [statusText, setStatusText] = useState("");
  const [deletedPosts, setDeletedPosts] = useState<number[]>([]);

  const networkPosts = [
    {
      id: 1,
      type: "status",
      user: {
        name: "Ana Silva",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        verified: true,
      },
      time: "há 5 min",
      content: "Alguem tem recomendacao de rodizio de sushi na zn?",
      likes: 12,
      comments: 3,
      location: "São Paulo"
    },
    {
      id: 2,
      type: "checkin",
      user: {
        name: "Carlos Santos",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        verified: false,
      },
      time: "há 15 min",
      content: "Primeira vez no Sushi Zen e já virou meu favorito! 🍣",
      likes: 8,
      comments: 5,
      location: "Sushi Zen",
      rating: 5,
      image: "https://images.unsplash.com/photo-1563612192-facf969b0a94?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      type: "review",
      user: {
        name: "Maria Costa",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        verified: true,
      },
      time: "há 1 hora",
      content: "Pizza margherita perfeita! Massa fina e ingredientes frescos 🍕",
      likes: 15,
      comments: 4,
      location: "Pizzaria Roma",
      rating: 4
    }
  ];

  const filteredPosts = networkPosts.filter(post => !deletedPosts.includes(post.id));

  const handleUpdateStatus = () => {
    if (statusText.trim()) {
      console.log("Status atualizado:", statusText);
      setStatusText("");
    }
  };

  const handleDeletePost = (postId: number) => {
    setDeletedPosts(prev => [...prev, postId]);
  };

  return (
    <div className="p-4 space-y-4 pb-24">{/* Extra padding for bottom navigation */}
      {/* Status Composer */}
      <Card className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="No que você está pensando?"
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="text-xs text-muted-foreground">
                {statusText.length}/280
              </div>
              <Button 
                size="sm" 
                onClick={handleUpdateStatus}
                disabled={!statusText.trim()}
              >
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Network Feed */}
      {filteredPosts.map((post) => (
        <Card key={post.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-semibold">{post.user.name}</span>
                  {post.user.verified && (
                    <Verified className="w-4 h-4 text-primary" />
                  )}
                  {post.type === "checkin" && (
                    <Badge className="text-xs bg-green-100 text-green-700">
                      CHECK-IN
                    </Badge>
                  )}
                  {post.type === "review" && (
                    <Badge className="text-xs bg-blue-100 text-blue-700">
                      AVALIAÇÃO
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center">
                  {post.location && (
                    <>
                      <MapPin className="w-3 h-3 inline-block mr-1" />
                      {post.location} • 
                    </>
                  )}
                  {post.time}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-sm">{post.content}</p>
            
            {post.rating && (
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < post.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  {post.rating}/5
                </span>
              </div>
            )}

            {post.image && (
              <img 
                src={post.image} 
                alt="Post image"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.comments}</span>
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 text-muted-foreground hover:text-destructive"
                onClick={() => handleDeletePost(post.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NetworkTab;