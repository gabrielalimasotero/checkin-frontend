import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase - Projeto CheckIn
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

// Configuração de redirecionamento
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL || "http://localhost:8081";

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          birth_date: string | null;
          phone: string | null;
          is_connectable: boolean;
          profile_visibility: 'friends' | 'network' | 'public';
          auto_checkin_visibility: 'public' | 'anonymous';
          allow_messages_from: 'friends' | 'network' | 'everyone';
          review_delay: 'immediate' | '1h' | '1d' | '7d';
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          birth_date?: string | null;
          phone?: string | null;
          is_connectable?: boolean;
          profile_visibility?: 'friends' | 'network' | 'public';
          auto_checkin_visibility?: 'public' | 'anonymous';
          allow_messages_from?: 'friends' | 'network' | 'everyone';
          review_delay?: 'immediate' | '1h' | '1d' | '7d';
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          birth_date?: string | null;
          phone?: string | null;
          is_connectable?: boolean;
          profile_visibility?: 'friends' | 'network' | 'public';
          auto_checkin_visibility?: 'public' | 'anonymous';
          allow_messages_from?: 'friends' | 'network' | 'everyone';
          review_delay?: 'immediate' | '1h' | '1d' | '7d';
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      venues: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          phone: string | null;
          website: string | null;
          hours: string | null;
          price_range: '$' | '$$' | '$$$' | '$$$$' | null;
          rating: number;
          total_reviews: number;
          image_url: string | null;
          tags: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: string;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          website?: string | null;
          hours?: string | null;
          price_range?: '$' | '$$' | '$$$' | '$$$$' | null;
          rating?: number;
          total_reviews?: number;
          image_url?: string | null;
          tags?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          website?: string | null;
          hours?: string | null;
          price_range?: '$' | '$$' | '$$$' | '$$$$' | null;
          rating?: number;
          total_reviews?: number;
          image_url?: string | null;
          tags?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      checkins: {
        Row: {
          id: string;
          user_id: string;
          venue_id: string;
          rating: number | null;
          review: string | null;
          amount_spent: number | null;
          photos: string[] | null;
          is_anonymous: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          venue_id: string;
          rating?: number | null;
          review?: string | null;
          amount_spent?: number | null;
          photos?: string[] | null;
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          venue_id?: string;
          rating?: number | null;
          review?: string | null;
          amount_spent?: number | null;
          photos?: string[] | null;
          is_anonymous?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          avatar_url: string | null;
          radius_km: number;
          is_public: boolean;
          max_members: number | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          avatar_url?: string | null;
          radius_km?: number;
          is_public?: boolean;
          max_members?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          avatar_url?: string | null;
          radius_km?: number;
          is_public?: boolean;
          max_members?: number | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Cliente Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos úteis
export type User = Database['public']['Tables']['users']['Row'];
export type Venue = Database['public']['Tables']['venues']['Row'];
export type Checkin = Database['public']['Tables']['checkins']['Row'];
export type Group = Database['public']['Tables']['groups']['Row']; 