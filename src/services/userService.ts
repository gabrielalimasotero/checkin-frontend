import type { User } from '../lib/supabase';
import {
  getUser as apiGetUser,
  updateUser as apiUpdateUser,
  searchUsers as apiSearchUsers,
} from '@/lib/api';

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
      return await apiGetUser(userId);
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
      await apiUpdateUser(userId, data);
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
      return await apiSearchUsers(query);
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
      const user = await apiGetUser(userId);
      return !!user?.id;
    } catch (error) {
      return false;
    }
  }

  /**
   * Deleta o perfil do usuário (soft delete)
   */
  static async deleteUserProfile(userId: string): Promise<boolean> {
    try {
      await apiUpdateUser(userId, { is_connectable: false, profile_visibility: 'public' });
      return true;
    } catch (error) {
      console.error('Erro ao deletar perfil do usuário:', error);
      return false;
    }
  }
} 