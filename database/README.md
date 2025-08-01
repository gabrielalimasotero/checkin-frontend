# Database Schema - Projeto CheckIn

Este diretório contém os arquivos SQL necessários para configurar o banco de dados do projeto CheckIn no Supabase.

## 📁 Arquivos

- `schema.sql` - Schema completo do banco de dados
- `seed_data.sql` - Dados de exemplo para popular o banco
- `README.md` - Este arquivo com instruções

## 🚀 Como usar no Supabase

### 1. Acesse o Supabase Dashboard

1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto ou crie um novo

### 2. Execute o Schema

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie e cole o conteúdo do arquivo `schema.sql`
4. Clique em **Run** para executar

### 3. Popule com Dados de Exemplo

1. Crie uma nova query no SQL Editor
2. Copie e cole o conteúdo do arquivo `seed_data.sql`
3. Clique em **Run** para executar

### 4. Configure as Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## 📊 Estrutura do Banco

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Perfis dos usuários |
| `venues` | Estabelecimentos/lugares |
| `checkins` | Check-ins dos usuários |
| `groups` | Grupos baseados em interesses |
| `events` | Eventos organizados |
| `friendships` | Conexões de amizade |
| `promotions` | Promoções dos estabelecimentos |
| `badges` | Conquistas/badges |

### Relacionamentos Principais

- **Users** ↔ **Interests** (many-to-many via `user_interests`)
- **Users** ↔ **Groups** (many-to-many via `group_members`)
- **Users** ↔ **Events** (many-to-many via `event_attendees`)
- **Users** ↔ **Users** (many-to-many via `friendships`)
- **Venues** ↔ **Checkins** (one-to-many)
- **Groups** ↔ **Events** (one-to-many)
- **Venues** ↔ **Promotions** (one-to-many)

## 🔐 Segurança

O schema inclui:

- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Políticas de acesso** configuradas
- **Triggers** para atualização automática de timestamps
- **Índices** para performance otimizada

## 🎯 Funcionalidades Suportadas

### Usuários
- ✅ Perfis completos com configurações de privacidade
- ✅ Sistema de interesses
- ✅ Conexões de amizade
- ✅ Notificações

### Estabelecimentos
- ✅ Cadastro completo com localização
- ✅ Sistema de avaliações e reviews
- ✅ Promoções ativas
- ✅ Tags para categorização

### Grupos e Eventos
- ✅ Criação de grupos por interesses
- ✅ Eventos organizados por grupos
- ✅ Sistema de participantes
- ✅ Raio de atividade configurável

### Check-ins
- ✅ Check-ins com fotos e avaliações
- ✅ Modo anônimo
- ✅ Cálculo automático de ratings

### Gamificação
- ✅ Sistema de badges/conquistas
- ✅ Critérios configuráveis
- ✅ Tracking de progresso

## 🔧 Personalizações

### Adicionar Novos Interesses

```sql
INSERT INTO public.interests (name, category, icon) VALUES
('Novo Interesse', 'categoria', '🎯');
```

### Adicionar Novos Badges

```sql
INSERT INTO public.badges (name, description, icon, category, criteria) VALUES
('Novo Badge', 'Descrição do badge', '🏆', 'categoria', '{"criteria": "valor"}');
```

### Configurar Novas Políticas RLS

```sql
CREATE POLICY "Nova política" ON public.tabela 
FOR SELECT USING (condição);
```

## 📈 Monitoramento

### Queries Úteis

```sql
-- Estatísticas gerais
SELECT 
    (SELECT COUNT(*) FROM public.users) as total_users,
    (SELECT COUNT(*) FROM public.venues) as total_venues,
    (SELECT COUNT(*) FROM public.checkins) as total_checkins;

-- Check-ins por categoria
SELECT 
    v.category,
    COUNT(*) as total_checkins
FROM public.checkins c
JOIN public.venues v ON c.venue_id = v.id
GROUP BY v.category
ORDER BY total_checkins DESC;

-- Grupos mais ativos
SELECT 
    g.name,
    COUNT(gm.user_id) as members,
    COUNT(e.id) as events
FROM public.groups g
LEFT JOIN public.group_members gm ON g.id = gm.group_id
LEFT JOIN public.events e ON g.id = e.group_id
GROUP BY g.id, g.name
ORDER BY members DESC;

-- Buscar venues próximos (usando função personalizada)
SELECT * FROM get_nearby_venues(-8.0476, -34.8770, 5);

-- Buscar grupos próximos baseado em interesses
SELECT * FROM get_nearby_groups(-8.0476, -34.8770, ARRAY['Champions League', 'Rock']);

-- Calcular distância entre dois pontos
SELECT calculate_distance(-8.0476, -34.8770, -8.0500, -34.8800) as distance_km;
```

## 🐛 Troubleshooting

### Erro de Permissão
Se encontrar erros de permissão, verifique se:
- O RLS está configurado corretamente
- As políticas de acesso estão adequadas
- O usuário tem as permissões necessárias

### Erro de Chave Estrangeira
Se encontrar erros de FK, verifique se:
- As tabelas foram criadas na ordem correta
- Os dados de referência existem
- As constraints estão corretas

### Performance Lenta
Para melhorar a performance:
- Verifique se os índices foram criados
- Use EXPLAIN ANALYZE para otimizar queries
- Considere particionamento para tabelas grandes

### Erro de Função Geográfica
Se encontrar erro com `ll_to_earth`:
- O schema foi atualizado para usar funções personalizadas
- Use `calculate_distance()` para cálculos de distância
- Use `get_nearby_venues()` para buscar lugares próximos
- Use `get_nearby_groups()` para buscar grupos próximos

### Erro de ON CONFLICT
Se encontrar erro `there is no unique or exclusion constraint`:
- O schema foi atualizado para usar `ON CONFLICT DO NOTHING`
- Constraints UNIQUE foram adicionadas nas tabelas necessárias
- Verifique se as tabelas foram criadas corretamente

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Supabase
2. Consulte os logs do banco
3. Teste as queries no SQL Editor
4. Verifique as políticas RLS

---

**Nota**: Este schema é compatível com Supabase e inclui todas as funcionalidades necessárias para o projeto CheckIn. 