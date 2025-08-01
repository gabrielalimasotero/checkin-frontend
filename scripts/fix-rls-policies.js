console.log('🔧 Corrigindo políticas RLS...');
console.log('============================');
console.log('');

console.log('❌ Problema identificado: "new row violates row-level security policy"');
console.log('💡 As políticas RLS estão impedindo a inserção de usuários.');
console.log('');

console.log('📋 SQL para corrigir as políticas:');
console.log('==================================');
console.log('');

const fixRLSSQL = `
-- =====================================================
-- CORREÇÃO DAS POLÍTICAS RLS
-- =====================================================

-- Remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Criar políticas corretas
CREATE POLICY "Users can view own profile" ON public.users 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users 
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users 
FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para checkins
DROP POLICY IF EXISTS "Checkins are viewable by everyone" ON public.checkins;
DROP POLICY IF EXISTS "Users can create own checkins" ON public.checkins;
DROP POLICY IF EXISTS "Users can update own checkins" ON public.checkins;

CREATE POLICY "Checkins are viewable by everyone" ON public.checkins 
FOR SELECT USING (true);

CREATE POLICY "Users can create own checkins" ON public.checkins 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins" ON public.checkins 
FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para venues
DROP POLICY IF EXISTS "Venues are viewable by everyone" ON public.venues;

CREATE POLICY "Venues are viewable by everyone" ON public.venues 
FOR SELECT USING (true);

-- Políticas para groups
DROP POLICY IF EXISTS "Public groups are viewable by everyone" ON public.groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;

CREATE POLICY "Public groups are viewable by everyone" ON public.groups 
FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create groups" ON public.groups 
FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Políticas para interests
DROP POLICY IF EXISTS "Interests are viewable by everyone" ON public.interests;

CREATE POLICY "Interests are viewable by everyone" ON public.interests 
FOR SELECT USING (true);

-- Políticas para user_interests
DROP POLICY IF EXISTS "Users can manage own interests" ON public.user_interests;

CREATE POLICY "Users can manage own interests" ON public.user_interests 
FOR ALL USING (auth.uid() = user_id);
`;

console.log(fixRLSSQL);

console.log('');
console.log('🎯 Como aplicar:');
console.log('1. Vá para Supabase Dashboard → SQL Editor');
console.log('2. Clique em "New Query"');
console.log('3. Cole o código acima');
console.log('4. Clique em "Run"');
console.log('');
console.log('5. Teste novamente: npm run test-insert');
console.log('6. Teste o botão "Criar Conta" no app');
console.log('');

console.log('💡 Explicação:');
console.log('- As políticas RLS estavam impedindo a inserção de usuários');
console.log('- Agora os usuários podem inserir seus próprios perfis');
console.log('- As políticas garantem que cada usuário só acesse seus próprios dados'); 