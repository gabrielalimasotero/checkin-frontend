console.log('🔧 Corrigindo políticas RLS para interesses...');
console.log('=============================================\n');

console.log('📋 Execute este SQL no Supabase SQL Editor:\n');

console.log(`
-- Corrigir políticas RLS para tabela interests
DROP POLICY IF EXISTS "Enable read access for all users" ON public.interests;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.interests;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.interests;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON public.interests;

-- Política para permitir leitura de todos os interesses
CREATE POLICY "Enable read access for all users" ON public.interests
    FOR SELECT USING (true);

-- Política para permitir inserção de interesses por usuários autenticados
CREATE POLICY "Enable insert for authenticated users only" ON public.interests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir atualização de interesses por usuários autenticados
CREATE POLICY "Enable update for authenticated users only" ON public.interests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir exclusão de interesses por usuários autenticados
CREATE POLICY "Enable delete for authenticated users only" ON public.interests
    FOR DELETE USING (auth.role() = 'authenticated');

-- Corrigir políticas RLS para tabela user_interests
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_interests;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_interests;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_interests;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.user_interests;

-- Política para permitir leitura dos próprios interesses
CREATE POLICY "Enable read access for own interests" ON public.user_interests
    FOR SELECT USING (auth.uid() = user_id);

-- Política para permitir inserção dos próprios interesses
CREATE POLICY "Enable insert for own interests" ON public.user_interests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para permitir atualização dos próprios interesses
CREATE POLICY "Enable update for own interests" ON public.user_interests
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir exclusão dos próprios interesses
CREATE POLICY "Enable delete for own interests" ON public.user_interests
    FOR DELETE USING (auth.uid() = user_id);

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('interests', 'user_interests')
ORDER BY tablename, policyname;
`);

console.log('\n🎯 Instruções:');
console.log('1. Vá para o Supabase Dashboard');
console.log('2. Acesse SQL Editor');
console.log('3. Cole o SQL acima');
console.log('4. Execute o comando');
console.log('5. Teste novamente a funcionalidade de interesses'); 