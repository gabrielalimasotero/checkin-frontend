// Script para aplicar apenas as partes do schema que estão faltando
import fs from 'fs';
import path from 'path';

console.log('🔧 Script para corrigir schema do Supabase');
console.log('==========================================');
console.log('');

console.log('❌ Erro encontrado: "trigger already exists"');
console.log('💡 Isso significa que algumas partes do schema já existem.');
console.log('');

console.log('📋 Solução: Aplicar apenas o que está faltando');
console.log('');

// Schema simplificado sem triggers duplicados
const simplifiedSchema = `
-- =====================================================
-- SCHEMA SIMPLIFICADO - APENAS O QUE ESTÁ FALTANDO
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELAS PRINCIPAIS (apenas se não existirem)
-- =====================================================

-- Tabela de usuários (estende auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    birth_date DATE,
    phone TEXT,
    is_connectable BOOLEAN DEFAULT true,
    profile_visibility TEXT DEFAULT 'friends' CHECK (profile_visibility IN ('friends', 'network', 'public')),
    auto_checkin_visibility TEXT DEFAULT 'public' CHECK (auto_checkin_visibility IN ('public', 'anonymous')),
    allow_messages_from TEXT DEFAULT 'friends' CHECK (allow_messages_from IN ('friends', 'network', 'everyone')),
    review_delay TEXT DEFAULT 'immediate' CHECK (review_delay IN ('immediate', '1h', '1d', '7d')),
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de interesses
CREATE TABLE IF NOT EXISTS public.interests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento usuário-interesses
CREATE TABLE IF NOT EXISTS public.user_interests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, interest_id)
);

-- Tabela de estabelecimentos/venues
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    website TEXT,
    hours TEXT,
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    image_url TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de check-ins
CREATE TABLE IF NOT EXISTS public.checkins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    amount_spent DECIMAL(10, 2),
    photos TEXT[],
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de grupos
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    avatar_url TEXT,
    radius_km INTEGER DEFAULT 5,
    is_public BOOLEAN DEFAULT true,
    max_members INTEGER,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para check-ins
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_venue_id ON public.checkins(venue_id);
CREATE INDEX IF NOT EXISTS idx_checkins_created_at ON public.checkins(created_at);

-- Índices para venues
CREATE INDEX IF NOT EXISTS idx_venues_category ON public.venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_latitude ON public.venues(latitude);
CREATE INDEX IF NOT EXISTS idx_venues_longitude ON public.venues(longitude);
CREATE INDEX IF NOT EXISTS idx_venues_location ON public.venues(latitude, longitude);

-- =====================================================
-- FUNÇÕES (apenas se não existirem)
-- =====================================================

-- Função para calcular distância entre dois pontos
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    R DECIMAL := 6371;
    dlat DECIMAL;
    dlon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dlat := RADIANS(lat2 - lat1);
    dlon := RADIANS(lon2 - lon1);
    
    a := SIN(dlat/2) * SIN(dlat/2) + 
         COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
         SIN(dlon/2) * SIN(dlon/2);
    c := 2 * ATAN2(SQRT(a), SQRT(1-a));
    
    RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (apenas se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Checkins are viewable by everyone') THEN
        CREATE POLICY "Checkins are viewable by everyone" ON public.checkins FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own checkins') THEN
        CREATE POLICY "Users can create own checkins" ON public.checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Venues are viewable by everyone') THEN
        CREATE POLICY "Venues are viewable by everyone" ON public.venues FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public groups are viewable by everyone') THEN
        CREATE POLICY "Public groups are viewable by everyone" ON public.groups FOR SELECT USING (is_public = true);
    END IF;
END $$;
`;

console.log('📄 Schema simplificado (sem triggers duplicados):');
console.log('================================================');
console.log(simplifiedSchema);

console.log('');
console.log('🎯 Como aplicar:');
console.log('1. Vá para Supabase Dashboard → SQL Editor');
console.log('2. Clique em "New Query"');
console.log('3. Cole o código acima');
console.log('4. Clique em "Run"');
console.log('');
console.log('5. Teste a conexão: npm run test-supabase');
console.log('6. Teste o botão "Criar Conta" no app'); 