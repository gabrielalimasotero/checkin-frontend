-- =====================================================
-- DADOS DE EXEMPLO PARA O PROJETO CHECKIN
-- =====================================================

-- Inserir estabelecimentos de exemplo
INSERT INTO public.venues (name, description, category, address, latitude, longitude, phone, website, hours, price_range, rating, total_reviews, image_url, tags) VALUES
('Boteco da Maria', 'Boteco tradicional com petiscos caseiros e ambiente familiar', 'bar', 'Rua das Flores, 123 - Boa Vista', -8.0476, -34.8770, '(81) 99999-9999', 'https://botecodamaria.com', 'Aberto até 01h', '$', 4.8, 156, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop', ARRAY['PetiscosTop', 'CervejaGelada', 'AmbienteFamiliar']),
('Café Central', 'Café artesanal com ambiente para trabalho e networking', 'cafe', 'Av. Conde da Boa Vista, 456 - Recife', -8.0476, -34.8770, '(81) 88888-8888', 'https://cafecentral.com', 'Aberto até 22h', '$$', 4.5, 89, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop', ARRAY['CaféArtesanal', 'Trabalho', 'Networking']),
('Bar do Rock', 'Bar especializado em rock com música ao vivo', 'bar', 'Rua do Rock, 789 - Graças', -8.0476, -34.8770, '(81) 77777-7777', 'https://bardorock.com', 'Aberto até 02h', '$$', 4.6, 234, 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=300&h=200&fit=crop', ARRAY['Rock', 'MúsicaAoVivo', 'DrinksAutorais']),
('Pizzaria Express', 'Pizzas tradicionais e delivery rápido', 'restaurant', 'Rua das Pizzas, 321 - Pina', -8.0476, -34.8770, '(81) 66666-6666', 'https://pizzariaexpress.com', 'Aberto até 23h', '$$', 4.3, 178, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop', ARRAY['Pizza', 'Delivery', 'Tradicional']),
('Academia Fitness Pro', 'Academia completa com personal trainers', 'fitness', 'Av. Fitness, 654 - Casa Forte', -8.0476, -34.8770, '(81) 55555-5555', 'https://fitnesspro.com', 'Aberto 24h', '$$$', 4.9, 445, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', ARRAY['Fitness', 'PersonalTrainer', '24h']),
('Club Underground', 'Balada com música eletrônica e ambiente underground', 'nightclub', 'Rua Underground, 987 - Santo Amaro', -8.0476, -34.8770, '(81) 44444-4444', 'https://clubunderground.com', 'Aberto até 04h', '$$$', 4.7, 89, 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop', ARRAY['Eletrônica', 'Underground', 'Balada']),
('Restaurante Bella Vista', 'Autêntica culinária italiana com vista panorâmica', 'restaurant', 'Rua da Vista, 147 - Boa Viagem', -8.0476, -34.8770, '(81) 33333-3333', 'https://bellavista.com', 'Aberto até 23h', '$$$', 4.8, 234, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop', ARRAY['Italiano', 'VistaPanorâmica', 'Romântico']),
('Cervejaria Artesanal', 'Cervejas artesanais e petiscos gourmet', 'bar', 'Rua das Cervejas, 258 - Parnamirim', -8.0476, -34.8770, '(81) 22222-2222', 'https://cervejaria.com', 'Aberto até 00h', '$$', 4.4, 167, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=200&fit=crop', ARRAY['CervejaArtesanal', 'PetiscosGourmet', 'CraftBeer'])
ON CONFLICT DO NOTHING;

-- Inserir promoções de exemplo
INSERT INTO public.promotions (venue_id, title, description, discount_percentage, discount_amount, min_purchase, start_date, end_date, is_active) 
SELECT 
    v.id,
    '2x1 em cappuccinos até 10h',
    'Promoção especial para o café da manhã',
    50,
    NULL,
    15.00,
    NOW(),
    NOW() + INTERVAL '30 days',
    true
FROM public.venues v WHERE v.name = 'Café Central'

UNION ALL

SELECT 
    v.id,
    '30% off em pedidos acima de R$ 50',
    'Desconto especial para pedidos grandes',
    30,
    NULL,
    50.00,
    NOW(),
    NOW() + INTERVAL '15 days',
    true
FROM public.venues v WHERE v.name = 'Pizzaria Express'

UNION ALL

SELECT 
    v.id,
    '1ª semana grátis para novos alunos',
    'Experimente nossa academia sem compromisso',
    NULL,
    0,
    0,
    NOW(),
    NOW() + INTERVAL '60 days',
    true
FROM public.venues v WHERE v.name = 'Academia Fitness Pro'

UNION ALL

SELECT 
    v.id,
    'Happy Hour - Drinks pela metade do preço',
    'Happy hour das 17h às 19h',
    50,
    NULL,
    0,
    NOW(),
    NOW() + INTERVAL '7 days',
    true
FROM public.venues v WHERE v.name = 'Bar do Rock'

UNION ALL

SELECT 
    v.id,
    'Combo família - 4 pizzas por 3',
    'Promoção especial para famílias',
    25,
    NULL,
    80.00,
    NOW(),
    NOW() + INTERVAL '20 days',
    true
FROM public.venues v WHERE v.name = 'Pizzaria Express';

-- Inserir grupos de exemplo
INSERT INTO public.groups (name, description, avatar_url, radius_km, is_public, max_members, created_by) VALUES
('Champions League ZN', 'Assistir jogos da Champions em bares da região', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=50&h=50&fit=crop', 5, true, 50, NULL),
('Amantes do Rock', 'Shows de rock e música ao vivo na região', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop', 3, true, 30, NULL),
('Cafés & Trabalho', 'Cafeterias para trabalhar e networking', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=50&h=50&fit=crop', 2, true, 25, NULL),
('Fitness Recife', 'Grupo para praticantes de fitness e academia', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop', 4, true, 40, NULL),
('Gastronomia PE', 'Explorando a gastronomia pernambucana', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop', 6, true, 60, NULL)
ON CONFLICT DO NOTHING;

-- Associar interesses aos grupos
INSERT INTO public.group_interests (group_id, interest_id)
SELECT g.id, i.id
FROM public.groups g, public.interests i
WHERE g.name = 'Champions League ZN' AND i.name = 'Champions League'

UNION ALL

SELECT g.id, i.id
FROM public.groups g, public.interests i
WHERE g.name = 'Amantes do Rock' AND i.name = 'Rock'

UNION ALL

SELECT g.id, i.id
FROM public.groups g, public.interests i
WHERE g.name = 'Cafés & Trabalho' AND i.name = 'Café'

UNION ALL

SELECT g.id, i.id
FROM public.groups g, public.interests i
WHERE g.name = 'Cafés & Trabalho' AND i.name = 'Trabalho'

UNION ALL

SELECT g.id, i.id
FROM public.groups g, public.interests i
WHERE g.name = 'Fitness Recife' AND i.name = 'Fitness'

UNION ALL

SELECT g.id, i.id
FROM public.groups g, public.interests i
WHERE g.name = 'Gastronomia PE' AND i.name = 'Pizza';

-- Inserir eventos de exemplo
INSERT INTO public.events (title, description, venue_id, group_id, created_by, start_time, end_time, max_attendees, is_public) VALUES
('Jogo da Champions - Final', 'Vamos assistir a final da Champions League juntos!', 
 (SELECT id FROM public.venues WHERE name = 'Boteco da Maria'),
 (SELECT id FROM public.groups WHERE name = 'Champions League ZN'),
 NULL,
 NOW() + INTERVAL '2 days',
 NOW() + INTERVAL '2 days' + INTERVAL '3 hours',
 20,
 true),

('Show de Rock ao Vivo', 'Noite de rock com bandas locais',
 (SELECT id FROM public.venues WHERE name = 'Bar do Rock'),
 (SELECT id FROM public.groups WHERE name = 'Amantes do Rock'),
 NULL,
 NOW() + INTERVAL '5 days',
 NOW() + INTERVAL '5 days' + INTERVAL '4 hours',
 30,
 true),

('Networking Café', 'Encontro para networking em ambiente descontraído',
 (SELECT id FROM public.venues WHERE name = 'Café Central'),
 (SELECT id FROM public.groups WHERE name = 'Cafés & Trabalho'),
 NULL,
 NOW() + INTERVAL '3 days',
 NOW() + INTERVAL '3 days' + INTERVAL '2 hours',
 15,
 true),

('Aula de Spinning', 'Aula especial de spinning para iniciantes',
 (SELECT id FROM public.venues WHERE name = 'Academia Fitness Pro'),
 (SELECT id FROM public.groups WHERE name = 'Fitness Recife'),
 NULL,
 NOW() + INTERVAL '1 day',
 NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
 12,
 true),

('Degustação de Pizzas', 'Experimente as melhores pizzas da cidade',
 (SELECT id FROM public.venues WHERE name = 'Pizzaria Express'),
 (SELECT id FROM public.groups WHERE name = 'Gastronomia PE'),
 NULL,
 NOW() + INTERVAL '7 days',
 NOW() + INTERVAL '7 days' + INTERVAL '3 hours',
 25,
 true);

-- Inserir check-ins de exemplo (apenas estrutura, sem usuários específicos)
-- Nota: Estes check-ins serão criados quando usuários reais fizerem check-in

-- Comentários sobre as tabelas
COMMENT ON COLUMN public.venues.tags IS 'Array de tags para categorização e busca';
COMMENT ON COLUMN public.checkins.photos IS 'Array de URLs das fotos do check-in';
COMMENT ON COLUMN public.notifications.data IS 'Dados JSON específicos do tipo de notificação';
COMMENT ON COLUMN public.badges.criteria IS 'Critérios JSON para ganhar o badge';
COMMENT ON COLUMN public.promotions.discount_percentage IS 'Percentual de desconto (NULL se usar discount_amount)';
COMMENT ON COLUMN public.promotions.discount_amount IS 'Valor fixo de desconto (NULL se usar discount_percentage)';

-- Estatísticas de exemplo (para demonstração)
-- Estas seriam calculadas dinamicamente em produção
SELECT 
    'Estatísticas do Sistema' as info,
    (SELECT COUNT(*) FROM public.venues) as total_venues,
    (SELECT COUNT(*) FROM public.groups) as total_groups,
    (SELECT COUNT(*) FROM public.events) as total_events,
    (SELECT COUNT(*) FROM public.promotions WHERE is_active = true) as active_promotions; 