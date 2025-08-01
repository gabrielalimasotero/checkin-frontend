import { supabase, User } from '../lib/supabase';

export interface UpdateUserProfileData {
  name?: string;
  bio?: string;
  location?: string;
  phone?: string;
  avatar_url?: string;
  is_connectable?: boolean;
  profile_visibility?: 'friends' | 'network' | 'public';
  auto_checkin_visibility?: 'public' | 'anonymous';
  allow_messages_from?: 'friends' | 'network' | 'everyone';
  notifications_enabled?: boolean;
}

export class UserService {
  /**
   * Busca o perfil de um usuário por ID
   */
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }
  }

  /**
   * Atualiza o perfil do usuário
   */
  static async updateUserProfile(userId: string, data: UpdateUserProfileData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar perfil do usuário:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      return false;
    }
  }

  /**
   * Busca usuários próximos baseado em localização
   */
  static async getNearbyUsers(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<User[]> {
    try {
      // Usar a função personalizada do banco para calcular distância
      const { data, error } = await supabase
        .rpc('get_nearby_users', {
          user_lat: latitude,
          user_lon: longitude,
          radius_km: radiusKm
        });

      if (error) {
        console.error('Erro ao buscar usuários próximos:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários próximos:', error);
      return [];
    }
  }

  /**
   * Busca usuários por nome ou email
   */
  static async searchUsers(query: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }

  /**
   * Verifica se um usuário existe
   */
  static async userExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (error) {
        return false;
      }

      return !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Deleta o perfil do usuário (soft delete)
   */
  static async deleteUserProfile(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_connectable: false,
          profile_visibility: 'public' // Tornar perfil público mas inativo
        })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao deletar perfil do usuário:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar perfil do usuário:', error);
      return false;
    }
  }
} 