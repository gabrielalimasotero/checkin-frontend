
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const { user, login, loginWithGoogle, register, isLoading } = useAuth();
  const { toast } = useToast();

  const [isVisible, setIsVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setIsVisible(true);
    
    // Se já estiver logado, redirecionar
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      toast({
        title: "Login realizado!",
      });
      navigate("/home");
    } else {
      // Verificar se é um erro de usuário não encontrado
      const errorMessage = result.error || "";
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

  const handleEmailLogin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    const result = await login(formData.email, formData.password);
    console.log('🔍 Resultado do login:', result);
    
    if (result.success) {
      toast({
        title: "Login realizado!",
      });
      navigate("/home");
    } else {
      // Verificar se é um erro de usuário não encontrado
      const errorMessage = result.error || "";
      console.log('❌ Erro do login:', errorMessage);
      
      let title = "Erro no login";
      let description = "Email ou senha incorretos.";
      
      if (errorMessage.includes("Invalid login credentials")) {
        // Como o Supabase não diferencia entre usuário não cadastrado e senha incorreta,
        // vamos usar uma mensagem genérica que funciona para ambos os casos
        title = "Dados inválidos";
        description = "Email ou senha incorretos. Verifique seus dados.";
      } else if (errorMessage.includes("Email not confirmed")) {
        title = "Email não confirmado";
        description = "Confirme seu email antes de fazer login.";
      } else if (errorMessage.includes("User not found")) {
        title = "Usuário não cadastrado";
        description = "Este email não está cadastrado. Crie uma conta primeiro.";
      }
      
      console.log('📋 Título final:', title);
      console.log('📋 Descrição final:', description);
      
      toast({
        title: title,
        description: description,
        variant: "destructive",
      });
    }
  };

  const validatePassword = (password: string) => {
    if (password.length > 0 && password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
    } else {
      setPasswordError('');
    }
  };

  const handleRegister = async () => {
    // Limpar erro anterior
    setPasswordError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      toast({
        title: "Conta criada!",
        description: "Bem-vindo ao CheckIn!",
      });
      navigate("/home");
    } else {
      // Verificar se é um erro de usuário já registrado
      const errorMessage = result.error || "";
      let title = "Erro no cadastro";
      let description = "Tente novamente.";
      
      if (errorMessage.includes("already registered") || 
          errorMessage.includes("User already registered") ||
          errorMessage.includes("already exists")) {
        title = "Usuário já cadastrado";
        description = "Este email já está cadastrado. Tente fazer login.";
      } else {
        description = result.error || "Tente novamente.";
      }
      
      toast({
        title: title,
        description: description,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      <div className="safe-area-top flex-1 flex flex-col justify-center px-6 py-4">
        <div className={`w-full flex flex-col justify-center transform transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
              <span className="text-3xl font-bold text-white">C</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2 font-ubuntu">CheckIn</h1>
          <p className="text-lg text-gray-600">Sua Vida Social Inteligente</p>
        </div>

        {!showLogin && !showRegister ? (
          /* Social Login Buttons */
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continuar com Google
              </Button>

              <div className="relative">
                <Separator className="my-4" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                  ou
                </span>
              </div>

              <Button 
                onClick={() => setShowLogin(true)}
                variant="outline" 
                className="w-full h-12 border-2 border-checkin-turquoise-300 text-checkin-turquoise-700 hover:bg-checkin-turquoise-50"
              >
                Entrar com E-mail
              </Button>
            </div>
          </Card>
        ) : showLogin ? (
          /* Email Login Form */
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com"
                  className="mt-1"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="mt-1"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleEmailLogin}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-checkin-turquoise-500 to-checkin-petrol-600 hover:from-checkin-turquoise-600 hover:to-checkin-petrol-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

              <div className="text-center">
                <Button 
                  variant="link" 
                  className="text-checkin-turquoise-600 p-0"
                  onClick={() => setShowLogin(false)}
                >
                  ← Voltar
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          /* Register Form */
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Seu nome"
                  className="mt-1"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com"
                  className="mt-1"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className={`mt-1 ${passwordError ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    validatePassword(e.target.value);
                  }}
                />
                {passwordError ? (
                  <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                )}
              </div>

              <Button 
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-checkin-turquoise-500 to-checkin-petrol-600 hover:from-checkin-turquoise-600 hover:to-checkin-petrol-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>

              <div className="text-center">
                <Button 
                  variant="link" 
                  className="text-checkin-turquoise-600 p-0"
                  onClick={() => setShowRegister(false)}
                >
                  ← Voltar
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {showLogin ? (
              <>
                Não tem conta? <span 
                  className="text-checkin-turquoise-600 font-medium cursor-pointer"
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                >
                  Criar conta
                </span>
              </>
            ) : showRegister ? (
              <>
                Já tem conta? <span 
                  className="text-checkin-turquoise-600 font-medium cursor-pointer"
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                >
                  Entrar
                </span>
              </>
            ) : (
              <>
                Não tem conta? <span 
                  className="text-checkin-turquoise-600 font-medium cursor-pointer"
                  onClick={() => setShowRegister(true)}
                >
                  Criar conta
                </span>
              </>
            )}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
