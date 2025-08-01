-- =====================================================
-- SCHEMA DO PROJETO CHECKIN - SUPABASE (APENAS ESTRUTURA)
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELAS PRINCIPAIS
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
    category TEXT NOT NULL, -- restaurant, bar, cafe, show, event, etc.
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
    tags TEXT[], -- array de tags como ['PetiscosTop', 'CervejaGelada']
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
    photos TEXT[], -- array de URLs de fotos
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

-- Tabela de relacionamento grupo-interesses
CREATE TABLE IF NOT EXISTS public.group_interests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES public.interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, interest_id)
);

-- Tabela de membros do grupo
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    max_attendees INTEGER,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de participantes do evento
CREATE TABLE IF NOT EXISTS public.event_attendees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Tabela de amizades/conexões
CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (sender_id != receiver_id)
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'friend_request', 'event_invite', 'group_invite', 'checkin', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- dados adicionais específicos do tipo de notificação
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de promoções
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage INTEGER,
    discount_amount DECIMAL(10, 2),
    min_purchase DECIMAL(10, 2),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de badges/conquistas
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    category TEXT, -- 'explorer', 'social', 'critic', 'photographer', etc.
    criteria JSONB, -- critérios para ganhar o badge
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de badges do usuário
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
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

-- Índices para grupos
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON public.groups(created_by);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_group_id ON public.events(group_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees(event_id);

-- Índices para amizades
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON public.friendships(status);

-- Índices para mensagens
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Índices para notificações
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Índices para promoções
CREATE INDEX IF NOT EXISTS idx_promotions_venue_id ON public.promotions(venue_id);
CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON public.promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON public.promotions(start_date, end_date);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON public.friendships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON public.promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular rating médio do venue
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.venues 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM public.checkins 
            WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id) 
            AND rating IS NOT NULL
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM public.checkins 
            WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id) 
            AND rating IS NOT NULL
        )
    WHERE id = COALESCE(NEW.venue_id, OLD.venue_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger para atualizar rating do venue
CREATE TRIGGER update_venue_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.checkins 
    FOR EACH ROW EXECUTE FUNCTION update_venue_rating();

-- Função para calcular distância entre dois pontos (fórmula de Haversine)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    R DECIMAL := 6371; -- Raio da Terra em km
    dlat DECIMAL;
    dlon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    -- Converter graus para radianos
    dlat := RADIANS(lat2 - lat1);
    dlon := RADIANS(lon2 - lon1);
    
    -- Fórmula de Haversine
    a := SIN(dlat/2) * SIN(dlat/2) + 
         COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
         SIN(dlon/2) * SIN(dlon/2);
    c := 2 * ATAN2(SQRT(a), SQRT(1-a));
    
    RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Função para buscar venues próximos
CREATE OR REPLACE FUNCTION get_nearby_venues(
    user_lat DECIMAL,
    user_lon DECIMAL,
    radius_km DECIMAL DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    category TEXT,
    distance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.name,
        v.description,
        v.category,
        calculate_distance(user_lat, user_lon, v.latitude, v.longitude) as distance
    FROM public.venues v
    WHERE calculate_distance(user_lat, user_lon, v.latitude, v.longitude) <= radius_km
    AND v.is_active = true
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql STABLE;

-- Função para buscar grupos próximos baseado no raio
CREATE OR REPLACE FUNCTION get_nearby_groups(
    user_lat DECIMAL,
    user_lon DECIMAL,
    user_interests TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    avatar_url TEXT,
    radius_km INTEGER,
    members_count BIGINT,
    distance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,
        g.name,
        g.description,
        g.avatar_url,
        g.radius_km,
        COUNT(gm.user_id) as members_count,
        calculate_distance(user_lat, user_lon, 
            (SELECT AVG(v.latitude) FROM public.venues v 
             JOIN public.events e ON v.id = e.venue_id 
             WHERE e.group_id = g.id LIMIT 1), 
            (SELECT AVG(v.longitude) FROM public.venues v 
             JOIN public.events e ON v.id = e.venue_id 
             WHERE e.group_id = g.id LIMIT 1)
        ) as distance
    FROM public.groups g
    LEFT JOIN public.group_members gm ON g.id = gm.group_id
    WHERE g.is_public = true
    AND (
        user_interests IS NULL OR 
        EXISTS (
            SELECT 1 FROM public.group_interests gi
            JOIN public.interests i ON gi.interest_id = i.id
            WHERE gi.group_id = g.id AND i.name = ANY(user_interests)
        )
    )
    GROUP BY g.id, g.name, g.description, g.avatar_url, g.radius_km
    ORDER BY distance NULLS LAST;
END;
$$ LANGUAGE plpgsql STABLE;

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
ALTER TABLE public.group_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (você pode ajustar conforme necessário)
-- Usuários podem ver e editar apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Check-ins públicos podem ser vistos por todos
CREATE POLICY "Checkins are viewable by everyone" ON public.checkins FOR SELECT USING (true);
CREATE POLICY "Users can create own checkins" ON public.checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checkins" ON public.checkins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checkins" ON public.checkins FOR DELETE USING (auth.uid() = user_id);

-- Venues são públicos
CREATE POLICY "Venues are viewable by everyone" ON public.venues FOR SELECT USING (true);

-- Grupos públicos podem ser vistos por todos
CREATE POLICY "Public groups are viewable by everyone" ON public.groups FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group admins can update groups" ON public.groups FOR UPDATE USING (
    auth.uid() = created_by OR 
    EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = id AND user_id = auth.uid() AND role = 'admin'
    )
);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE public.users IS 'Perfis dos usuários do sistema';
COMMENT ON TABLE public.venues IS 'Estabelecimentos/ lugares para check-in';
COMMENT ON TABLE public.checkins IS 'Check-ins dos usuários nos estabelecimentos';
COMMENT ON TABLE public.groups IS 'Grupos baseados em interesses';
COMMENT ON TABLE public.events IS 'Eventos organizados por grupos ou usuários';
COMMENT ON TABLE public.friendships IS 'Conexões de amizade entre usuários';
COMMENT ON TABLE public.promotions IS 'Promoções oferecidas pelos estabelecimentos';
COMMENT ON TABLE public.badges IS 'Conquistas/badges que os usuários podem ganhar'; 