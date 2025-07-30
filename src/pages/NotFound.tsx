
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-checkin-turquoise-50 via-white to-checkin-petrol-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-checkin-turquoise-500 to-checkin-petrol-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-4xl font-bold text-white">!</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text">404</h1>
          <h2 className="text-xl font-semibold text-gray-700">Página não encontrada</h2>
          <p className="text-gray-600 max-w-md">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/home"}
            className="bg-gradient-to-r from-checkin-turquoise-500 to-checkin-petrol-600 hover:from-checkin-turquoise-600 hover:to-checkin-petrol-700 flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Ir para o Feed</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
