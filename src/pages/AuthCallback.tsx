import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processando callback de autenticação...');
        
        // Aguardar um pouco para garantir que o Supabase processe a sessão
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar se há uma sessão ativa
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Erro ao verificar sessão:', sessionError);
          setError('Erro ao verificar autenticação');
          return;
        }

        if (session?.user) {
          console.log('✅ Usuário autenticado:', session.user.email);
          
          // Mostrar toast de sucesso
          toast({
            title: "Login realizado!",
          });
          
          // Aguardar um pouco mais para garantir que o contexto seja atualizado
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Redirecionar para home
          console.log('🔄 Redirecionando para home...');
          navigate('/home', { replace: true });
        } else {
          console.log('❌ Nenhuma sessão encontrada');
          setError('Falha na autenticação');
        }
      } catch (error) {
        console.error('❌ Erro no callback:', error);
        setError('Erro interno');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  // Se o usuário já estiver autenticado, redirecionar imediatamente
  useEffect(() => {
    if (user && !isProcessing) {
      console.log('✅ Usuário já autenticado, redirecionando...');
      navigate('/home', { replace: true });
    }
  }, [user, isProcessing, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <h2 className="text-xl font-semibold">Erro na Autenticação</h2>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
          </div>
          <button
            onClick={() => navigate('/welcome')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-6">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold mb-2">Processando Login</h2>
        <p className="text-sm text-muted-foreground">
          Aguarde enquanto processamos sua autenticação...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback; 