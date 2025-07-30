
import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

interface MapVenue {
  id: number;
  name: string;
  rating: number;
  type: string;
  coordinates: [number, number];
  hasFriends: boolean;
  hasEvent?: boolean;
}

interface MapProps {
  venues: MapVenue[];
  onVenueClick: (venueId: number) => void;
}

const Map = ({ venues, onVenueClick }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mockupReady, setMockupReady] = useState(false);

  useEffect(() => {
    // Mockup do mapa - simula carregamento
    setTimeout(() => setMockupReady(true), 500);
  }, []);

  return (
    <div className="relative">
      <div ref={mapContainer} className="h-48 rounded-lg shadow-sm bg-gray-200 relative overflow-hidden">
        {/* Imagem de mapa aproximado do bairro */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=200&fit=crop" 
            alt="Mapa do bairro"
            className="w-full h-full object-cover"
          />
          {/* Overlay para dar contraste */}
          <div className="absolute inset-0 bg-blue-900/20"></div>
        </div>
        
        {/* Ruas do bairro mais realistas */}
        <div className="absolute inset-0">
          {/* Ruas principais */}
          <div className="absolute top-8 left-0 w-full h-0.5 bg-white/90 rounded"></div>
          <div className="absolute top-16 left-0 w-full h-0.5 bg-white/90 rounded"></div>
          <div className="absolute top-24 left-0 w-full h-0.5 bg-white/90 rounded"></div>
          <div className="absolute top-32 left-0 w-full h-0.5 bg-white/90 rounded"></div>
          
          {/* Ruas verticais */}
          <div className="absolute top-0 left-12 h-full w-0.5 bg-white/90 rounded"></div>
          <div className="absolute top-0 left-24 h-full w-0.5 bg-white/90 rounded"></div>
          <div className="absolute top-0 left-36 h-full w-0.5 bg-white/90 rounded"></div>
          <div className="absolute top-0 right-12 h-full w-0.5 bg-white/90 rounded"></div>
          
          {/* Ruas menores */}
          <div className="absolute top-12 left-6 w-20 h-0.5 bg-white/70 rounded rotate-45"></div>
          <div className="absolute top-20 left-20 w-16 h-0.5 bg-white/70 rounded -rotate-12"></div>
          <div className="absolute top-28 right-8 w-24 h-0.5 bg-white/70 rounded rotate-12"></div>
          
          {/* Markers dos venues */}
          {mockupReady && venues.map((venue) => {
            let pinColor = 'bg-blue-500';
            let pinIcon = '⭐';
            
            if (venue.hasEvent) {
              pinColor = 'bg-purple-500';
              pinIcon = '🎉';
            } else if (venue.hasFriends) {
              pinColor = 'bg-green-500';
              pinIcon = '👥';
            }
            
            return (
              <div
                key={venue.id}
                className={`absolute w-8 h-8 rounded-full flex flex-col items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${pinColor}`}
                style={{
                  left: `${15 + (venue.id * 18)}%`,
                  top: `${25 + (venue.id * 12)}%`,
                }}
                onClick={() => onVenueClick(venue.id)}
              >
                <span className="text-xs">{pinIcon}</span>
              </div>
            );
          })}
          
          {/* Indicador de localização */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
          </div>
        </div>
        
        {/* Loading overlay */}
        {!mockupReady && (
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
            <div className="text-sm text-gray-600">Carregando mapa...</div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute top-2 right-2 bg-white/90 rounded-lg p-2 text-xs">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">⭐</div>
          <span>Lugares</span>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">👥</div>
          <span>Conexões</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">🎉</div>
          <span>Com evento</span>
        </div>
      </div>
    </div>
  );
};

export default Map;
