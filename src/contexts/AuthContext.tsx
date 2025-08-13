
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, User } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { backendLogin, backendRegister, clearBackendToken, getBackendToken, backendGetMe } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Garante que exista usuário no backend e que o token esteja válido
  const ensureBackendUserAndToken = async (session: any) => {
    const email = session?.user?.email ?? '';
    if (!email) return;
    // Primeiro, tenta registrar (idempotente). Depois, faz login para obter token.
    try {
      const googleName = session?.user?.user_metadata?.name || session?.user?.user_metadata?.full_name || 'Usuário';
      await backendRegister({
        id: session.user.id,
        email,
        name: googleName,
        is_connectable: true,
        profile_visibility: 'friends',
        auto_checkin_visibility: 'public',
        allow_messages_from: 'friends',
        review_delay: 'immediate',
        notifications_enabled: true,
      });
    } catch (e) {
      // Pode falhar se já existir — ignorar
      console.warn('Registro backend falhou/usuario pode já existir:', e);
    }
    try {
      await backendLogin(email);
    } catch (e2) {
      console.warn('Falha ao obter token do backend:', e2);
    }
  };

  // Verificar sessão atual e configurar listener
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseUser(session.user);
          // Garante usuário e token no backend e busca perfil
          await ensureBackendUserAndToken(session);
          await fetchUserProfile(session.user.id, session);
        }
      } catch (error) {
        console.error('Erro ao obter sessão inicial:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log('🚪 Usuário fez logout, limpando estados...');
          setSupabaseUser(null);
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          setSupabaseUser(session.user);
          
          // Garante usuário e token no backend e busca perfil
          await ensureBackendUserAndToken(session);
          await fetchUserProfile(session.user.id, session);
        } else {
          setSupabaseUser(null);
          setUser(null);
          clearBackendToken();
        }
        console.log('🔄 Finalizando auth state change, isLoading = false');
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Buscar perfil do usuário no backend (fonte de verdade)
  const fetchUserProfile = async (_userId: string, session?: any) => {
    try {
      console.log('🔍 Buscando perfil no backend');
      const data = await backendGetMe();
      console.log('✅ Perfil do backend:', data);
      setUser(data);
    } catch (error) {
      console.error('❌ Erro ao buscar perfil (backend):', error);
    }
  };

  // Criar perfil do usuário no backend
  const createUserProfile = async (userId: string, userData: { name: string; email: string }) => {
    try {
      await backendRegister({
        id: userId,
        name: userData.name,
        email: userData.email,
        is_connectable: true,
        profile_visibility: 'friends',
        auto_checkin_visibility: 'public',
        allow_messages_from: 'friends',
        review_delay: 'immediate',
        notifications_enabled: true,
      });
      return true;
    } catch (error) {
      console.error('Erro ao criar perfil do usuário (backend):', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setSupabaseUser(data.user);
        // Backend: obter token e perfil
        try {
          await backendLogin(email);
        } catch (e: any) {
          console.warn('Falha ao realizar login no backend:', e?.message || e);
        }
        await fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Erro desconhecido no login' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `http://localhost:8081/auth/callback`
        }
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Não retornar success imediatamente - o redirecionamento vai acontecer
      // O sucesso será tratado no callback
      return { success: false, error: 'Redirecionando para Google...' };
    } catch (error) {
      console.error('Erro no login com Google:', error);
      setIsLoading(false);
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  // Registro manual removido do contexto; o cadastro ocorrerá através do Google

  const refreshUser = async () => {
    try {
      console.log('🔄 Atualizando dados do usuário...');
      if (supabaseUser?.id) {
        await fetchUserProfile(supabaseUser.id);
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Iniciando logout...');
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro no logout:', error);
        setIsLoading(false);
        return;
      }
      
      console.log('✅ Logout realizado com sucesso');
      
      // Limpar estados imediatamente
      setSupabaseUser(null);
      setUser(null);
      clearBackendToken();
      
      // Aguardar um pouco para garantir que o onAuthStateChange seja processado
      setTimeout(() => {
        setIsLoading(false);
        console.log('🔄 Logout finalizado');
      }, 500);
      
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        supabaseUser,
        loginWithGoogle, 
        logout, 
        refreshUser,
        isLoading,
        isAuthenticated: !!supabaseUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
