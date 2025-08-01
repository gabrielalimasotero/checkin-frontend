import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Listando usuários autenticados...');
console.log('==================================');
console.log('');

async function listAuthUsers() {
    try {
        // Tentar criar um usuário de teste para verificar se funciona
        console.log('🧪 Criando usuário de teste...');
        
        const testEmail = `test${Date.now()}@example.com`;
        const testPassword = 'TestPassword123!';
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    name: 'Test User',
                    email: testEmail,
                }
            }
        });
        
        if (signUpError) {
            console.log('❌ Erro ao criar usuário de teste:', signUpError.message);
            return;
        }
        
        console.log('✅ Usuário de teste criado:', signUpData.user?.id);
        console.log('📋 Email:', signUpData.user?.email);
        console.log('📋 Metadata:', signUpData.user?.user_metadata);
        console.log('');
        
        // Tentar inserir na tabela users
        console.log('💾 Tentando inserir na tabela users...');
        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: signUpData.user?.id,
                    name: signUpData.user?.user_metadata?.name || 'Test User',
                    email: signUpData.user?.email,
                    is_connectable: true,
                    profile_visibility: 'friends',
                    auto_checkin_visibility: 'public',
                    allow_messages_from: 'friends',
                    review_delay: 'immediate',
                    notifications_enabled: true,
                }
            ])
            .select();
        
        if (insertError) {
            console.log('❌ Erro na inserção:', insertError.message);
            console.log('📋 Detalhes:', JSON.stringify(insertError, null, 2));
        } else {
            console.log('✅ Inserção bem-sucedida!');
            console.log('📋 Dados:', insertData);
        }
        
        // Verificar se o usuário foi inserido
        console.log('');
        console.log('🔍 Verificando se o usuário foi inserido...');
        const { data: checkData, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('id', signUpData.user?.id);
        
        if (checkError) {
            console.log('❌ Erro ao verificar usuário:', checkError.message);
        } else {
            console.log('✅ Usuário encontrado na tabela!');
            console.log('📋 Dados:', checkData);
        }
        
        // Listar todos os usuários
        console.log('');
        console.log('📋 Listando todos os usuários na tabela...');
        const { data: allUsers, error: allUsersError } = await supabase
            .from('users')
            .select('id, name, email, created_at')
            .order('created_at', { ascending: false });
        
        if (allUsersError) {
            console.log('❌ Erro ao listar usuários:', allUsersError.message);
        } else {
            console.log(`✅ Encontrados ${allUsers.length} usuários:`);
            allUsers.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.created_at}`);
            });
        }
        
    } catch (err) {
        console.log('❌ Erro geral:', err.message);
    }
}

async function testDirectInsert() {
    console.log('');
    console.log('🧪 Testando inserção direta...');
    console.log('=============================');
    
    try {
        // Tentar inserir diretamente sem autenticação
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    id: 'test-direct-insert',
                    name: 'Direct Insert Test',
                    email: 'direct@test.com',
                    is_connectable: true,
                    profile_visibility: 'friends',
                    auto_checkin_visibility: 'public',
                    allow_messages_from: 'friends',
                    review_delay: 'immediate',
                    notifications_enabled: true,
                }
            ])
            .select();
        
        if (error) {
            console.log('❌ Erro na inserção direta:', error.message);
            console.log('📋 Isso é esperado - RLS está funcionando');
        } else {
            console.log('⚠️ Inserção direta funcionou - RLS pode não estar ativo');
            console.log('📋 Dados:', data);
        }
        
    } catch (err) {
        console.log('❌ Erro na inserção direta:', err.message);
    }
}

async function runTests() {
    await listAuthUsers();
    await testDirectInsert();
    
    console.log('');
    console.log('🎯 Análise:');
    console.log('===========');
    console.log('1. Se a inserção com usuário autenticado funcionou, o problema está no frontend');
    console.log('2. Se não funcionou, as políticas RLS ainda estão incorretas');
    console.log('3. Se a inserção direta funcionou, RLS não está ativo');
}

runTests(); 