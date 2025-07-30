
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
  groups: string[];
  preferences: {
    privacy: 'public' | 'friends' | 'community' | 'anonymous';
    notifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('checkin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular validação (em produção seria uma chamada real para API)
    if (email && password.length >= 6) {
      const userData: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email,
        verified: true,
        groups: [],
        preferences: {
          privacy: 'friends',
          notifications: true
        }
      };
      
      setUser(userData);
      localStorage.setItem('checkin_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular login com Google
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userData: User = {
      id: `google_${Date.now()}`,
      name: 'Usuário Google',
      email: 'usuario@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      verified: true,
      groups: ['UFMG', 'Tech Community'],
      preferences: {
        privacy: 'friends',
        notifications: true
      }
    };
    
    setUser(userData);
    localStorage.setItem('checkin_user', JSON.stringify(userData));
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular registro
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const userData: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      verified: false,
      groups: [],
      preferences: {
        privacy: 'friends',
        notifications: true
      }
    };
    
    setUser(userData);
    localStorage.setItem('checkin_user', JSON.stringify(userData));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('checkin_user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        loginWithGoogle, 
        register, 
        logout, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
