
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, User } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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

  // Verificar sessão atual e configurar listener
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseUser(session.user);
          await fetchUserProfile(session.user.id);
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
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          
          if (!user) {
            // Buscar perfil existente (não criar novo)
            await fetchUserProfile(session.user.id);
          }
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        console.log('🔄 Finalizando auth state change, isLoading = false');
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Buscar perfil do usuário no banco
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Buscando perfil do usuário:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('📋 Resposta da busca:', { data, error });

      if (error) {
        console.log('⚠️ Perfil não encontrado, isso é normal para novos usuários:', error.message);
        console.log('💡 Tentando criar perfil automaticamente...');
        
        // Tentar criar o perfil automaticamente
        const profileCreated = await createUserProfile(userId, { 
          name: 'Usuário', 
          email: supabaseUser?.email || 'user@example.com' 
        });
        
        if (profileCreated) {
          console.log('✅ Perfil criado automaticamente');
          // Buscar novamente
          const { data: newData, error: newError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (newData) {
            console.log('✅ Perfil encontrado após criação:', newData);
            setUser(newData);
          }
        }
        return;
      }

      if (data) {
        console.log('✅ Perfil encontrado:', data);
        setUser(data);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar perfil do usuário:', error);
    }
  };

  // Criar perfil do usuário no banco
  const createUserProfile = async (userId: string, userData: { name: string; email: string }) => {
    try {
      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            name: userData.name,
            email: userData.email,
            is_connectable: true,
            profile_visibility: 'friends',
            auto_checkin_visibility: 'public',
            allow_messages_from: 'friends',
            review_delay: 'immediate',
            notifications_enabled: true,
          }
        ]);

      if (error) {
        console.error('Erro ao criar perfil do usuário:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao criar perfil do usuário:', error);
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
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro no login com Google:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔍 Iniciando registro:', { name, email });
      console.log('📋 Dados recebidos:', { name, email, password: '***' });
      setIsLoading(true);
      
      console.log('📋 Enviando dados para registro:', { name, email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            email: email,
          },
          emailRedirectTo: 'http://localhost:8081/welcome'
        }
      });

      console.log('📋 Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ Erro no registro:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ Usuário criado:', data.user.id);
        
        // Criar perfil imediatamente com os dados corretos
        console.log('💾 Criando perfil com dados corretos...');
        const profileCreated = await createUserProfile(data.user.id, { name, email });
        
        if (profileCreated) {
          console.log('✅ Perfil criado com sucesso');
          setSupabaseUser(data.user);
          
          // Buscar o perfil criado para definir o estado
          const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (profileData) {
            console.log('✅ Perfil carregado:', profileData);
            setUser(profileData);
          }
          
          return { success: true };
        } else {
          console.error('❌ Erro ao criar perfil');
          return { success: false, error: 'Erro ao criar perfil do usuário' };
        }
      }

      console.error('❌ Nenhum usuário retornado');
      return { success: false, error: 'Erro desconhecido no registro' };
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro no logout:', error);
      }
      
      setSupabaseUser(null);
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        supabaseUser,
        login, 
        loginWithGoogle, 
        register, 
        logout, 
        isLoading,
        isAuthenticated: !!supabaseUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
