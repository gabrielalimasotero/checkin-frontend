import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para autenticação
 * Fornece métodos convenientes para operações de auth
 */
export const useAuthHook = () => {
  const auth = useAuth();

  /**
   * Verifica se o usuário está autenticado
   */
  const isAuthenticated = auth.isAuthenticated;

  /**
   * Verifica se está carregando
   */
  const isLoading = auth.isLoading;

  /**
   * Dados do usuário atual
   */
  const user = auth.user;

  /**
   * Dados do usuário do Supabase
   */
  const supabaseUser = auth.supabaseUser;

  /**
   * Login com Google
   */
  const loginWithGoogle = async () => {
    return await auth.loginWithGoogle();
  };

  /**
   * Logout
   */
  const logout = async () => {
    return await auth.logout();
  };

  /**
   * Verifica se o usuário tem permissão para acessar um recurso
   */
  const hasPermission = (permission: string) => {
    // Implementar lógica de permissões se necessário
    return isAuthenticated;
  };

  /**
   * Verifica se o usuário é o proprietário de um recurso
   */
  const isOwner = (resourceUserId: string) => {
    return user?.id === resourceUserId;
  };

  return {
    // Estado
    isAuthenticated,
    isLoading,
    user,
    supabaseUser,
    
    // Métodos
    loginWithGoogle,
    logout,
    
    // Utilitários
    hasPermission,
    isOwner,
  };
}; 