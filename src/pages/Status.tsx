
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";

interface StatusPost {
  id: number;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  time: string;
  likes: number;
  comments: number;
  location?: string;
}

const Status = () => {
  const navigate = useNavigate();
  const [statusInput, setStatusInput] = useState("");

  const statusFeed: StatusPost[] = [
    {
      id: 1,
      user: {
        name: "Ana Silva",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        verified: true
      },
      content: "Descobrindo novos sabores na cidade 🍕✨",
      time: "há 5 min",
      likes: 12,
      comments: 3,
      location: "São Paulo"
    },
    {
      id: 2,
      user: {
        name: "Carlos Santos",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
      },
      content: "Happy hour mode ativado! Quem topa? 🍻",
      time: "há 15 min",
      likes: 8,
      comments: 5
    },
    {
      id: 3,
      user: {
        name: "Mariana Costa",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
      },
      content: "Café da tarde perfeito para esse friozinho ☕",
      time: "há 30 min",
      likes: 15,
      comments: 2,
      location: "Vila Madalena"
    },
    {
      id: 4,
      user: {
        name: "Pedro Lima",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
      },
      content: "Procurando recomendações de restaurante japonês 🍣",
      time: "há 1h",
      likes: 6,
      comments: 8
    }
  ];

  const handlePostStatus = () => {
    if (statusInput.trim()) {
      setStatusInput("");
      // Aqui você adicionaria o post ao feed
    }
  };

  return (
    <div className="min-h-screen bg-checkin-pearl-50 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-checkin-turquoise-500 to-checkin-ocean-600 shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/home')}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-white">Status</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Compositor de Status */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-checkin-pearl-200">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face" />
              <AvatarFallback>EU</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-checkin-pearl-50 rounded-xl p-3 mb-3">
                <textarea
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  placeholder="No que você está pensando?"
                  className="w-full bg-transparent resize-none text-sm placeholder-checkin-ocean-400 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-checkin-ocean-400">
                  {statusInput.length}/280
                </div>
                <Button 
                  size="sm" 
                  onClick={handlePostStatus}
                  disabled={!statusInput.trim()}
                  className="bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600 text-white px-4"
                >
                  Postar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed de Status */}
        <div className="space-y-4">
          {statusFeed.map((post) => (
            <div key={post.id} className="bg-white rounded-lg p-4 shadow-sm border border-checkin-pearl-200">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-checkin-ocean-700">
                        {post.user.name}
                      </span>
                      {post.user.verified && (
                        <div className="w-4 h-4 bg-checkin-turquoise-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      <span className="text-xs text-checkin-ocean-400">•</span>
                      <span className="text-xs text-checkin-ocean-400">{post.time}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreHorizontal className="w-4 h-4 text-checkin-ocean-400" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-checkin-ocean-700 mb-2">{post.content}</p>
                  
                  {post.location && (
                    <p className="text-xs text-checkin-ocean-400 mb-2">📍 {post.location}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-checkin-ocean-400">
                    <Button variant="ghost" size="sm" className="p-1 hover:text-checkin-turquoise-600">
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-xs">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 hover:text-checkin-turquoise-600">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span className="text-xs">{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 hover:text-checkin-turquoise-600">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;
