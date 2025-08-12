
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, isLoading } = useAuth();
  const { toast } = useToast();

  const [isVisible, setIsVisible] = useState(false);
  // Removidos fluxos de email/senha e registro manual

  useEffect(() => {
    setIsVisible(true);
    
    // Se já estiver logado, redirecionar
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    
    // Se não for sucesso, verificar se é redirecionamento ou erro
    if (!result.success) {
      const errorMessage = result.error || "";
      
      // Se for redirecionamento, não mostrar toast
      if (errorMessage.includes("Redirecionando para Google")) {
        return; // Apenas aguardar o redirecionamento
      }
      
      // Para outros erros, mostrar toast
      let title = "Erro no login";
      let description = "Tente novamente.";
      
      if (errorMessage.includes("Invalid login credentials")) {
        title = "Dados inválidos";
        description = "Email ou senha incorretos. Verifique seus dados.";
      } else if (errorMessage.includes("Email not confirmed")) {
        title = "Email não confirmado";
        description = "Confirme seu email antes de fazer login.";
      } else if (errorMessage.includes("User not found")) {
        title = "Usuário não cadastrado";
        description = "Este email não está cadastrado. Crie uma conta primeiro.";
      } else if (errorMessage.includes("popup_closed")) {
        title = "Login cancelado";
        description = "O login com Google foi cancelado.";
      }
      
      toast({
        title: title,
        description: description,
        variant: "destructive",
      });
    }
  };

  // Fluxos de email/senha removidos

  return (
    <div className="mobile-viewport bg-background flex flex-col min-h-screen max-w-[430px] mx-auto">
      {/* Top section with logo and branding - optimized for iPhone 14 Pro Max */}
      <div className="flex-1 flex flex-col justify-center px-12 py-20">
        <div className={`w-full mx-auto transform transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          
          {/* Logo Section */}
          <div className="text-center mb-20">
            <div className="mb-8">
              <img 
                src="/checkin-logo.svg" 
                alt="CheckIn Logo" 
                className="w-32 h-32 mx-auto drop-shadow-lg"
              />
            </div>
            <h1 className="text-6xl font-bold gradient-text mb-4 font-ubuntu">CheckIn</h1>
            <p className="text-2xl text-gray-600 font-medium">Where are we going?</p>
          </div>
        </div>
      </div>

      {/* Bottom section with login */}
      <div className="px-12 pb-16">
        <div className="w-full mx-auto">
          <div className="p-6">
            <div className="space-y-6">
              <Button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-16 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-lg rounded-2xl text-lg font-medium transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className="w-7 h-7 mr-4 animate-spin" />
                ) : (
                  <svg className="w-7 h-7 mr-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
