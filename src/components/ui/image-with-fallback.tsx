import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbacks?: string[];
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  fallbackSrc = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Sem+Imagem',
  fallbacks = [
    'https://picsum.photos/400/300?random=1',
    'https://via.placeholder.com/400x300/f1f5f9/64748b?text=Restaurante',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW0gSW5kaXNwb27DrXZlbDwvdGV4dD48L3N2Zz4='
  ],
  onError,
  ...props 
}) => {
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(-1);
  
  const getCurrentSrc = () => {
    if (currentFallbackIndex === -1) {
      return src || fallbackSrc;
    }
    if (currentFallbackIndex < fallbacks.length) {
      return fallbacks[currentFallbackIndex];
    }
    return fallbackSrc;
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const nextIndex = currentFallbackIndex + 1;
    
    if (currentFallbackIndex === -1) {
      console.warn(`🖼️ Original image failed to load: "${src}"`);
    }
    
    if (nextIndex < fallbacks.length) {
      console.warn(`🔄 Trying fallback ${nextIndex}: ${fallbacks[nextIndex]}`);
      setCurrentFallbackIndex(nextIndex);
      e.currentTarget.src = fallbacks[nextIndex];
    } else if (currentFallbackIndex !== -2) {
      console.warn(`❌ All fallbacks failed, using final fallback: ${fallbackSrc}`);
      setCurrentFallbackIndex(-2);
      e.currentTarget.src = fallbackSrc;
    }
    
    onError?.(e);
  };

  return (
    <img
      {...props}
      src={getCurrentSrc()}
      onError={handleError}
    />
  );
};

export { ImageWithFallback };
export default ImageWithFallback;
