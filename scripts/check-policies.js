import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Verificando políticas RLS...');
console.log('=============================');
console.log('');

async function checkPolicies() {
    try {
        // Verificar se RLS está habilitado
        console.log('📋 Verificando se RLS está habilitado...');
        
        const { data: rlsData, error: rlsError } = await supabase
            .rpc('get_rls_status', { table_name: 'users' });
        
        if (rlsError) {
            console.log('⚠️ Não foi possível verificar RLS via RPC');
        } else {
            console.log('✅ RLS status:', rlsData);
        }
        
        // Tentar uma inserção simples para testar
        console.log('');
        console.log('🧪 Testando inserção com usuário autenticado...');
        
        // Primeiro, vamos tentar fazer login com um usuário existente
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'test@example.com',
            password: 'TestPassword123!'
        });
        
        if (authError) {
            console.log('❌ Erro no login:', authError.message);
            console.log('💡 Vamos tentar criar um novo usuário para teste');
            
            // Criar um novo usuário
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: `test${Date.now()}@example.com`,
                password: 'TestPassword123!'
            });
            
            if (signUpError) {
                console.log('❌ Erro ao criar usuário:', signUpError.message);
                return;
            }
            
            console.log('✅ Usuário criado:', signUpData.user?.id);
            
            // Agora tentar inserir na tabela users
            const { data: insertData, error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        id: signUpData.user?.id,
                        name: 'Test User',
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
        } else {
            console.log('✅ Login bem-sucedido:', authData.user?.id);
            
            // Tentar inserir na tabela users
            const { data: insertData, error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        id: authData.user?.id,
                        name: 'Test User',
                        email: authData.user?.email,
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
        }
        
    } catch (err) {
        console.log('❌ Erro geral:', err.message);
    }
}

async function listTables() {
    console.log('');
    console.log('📋 Verificando tabelas...');
    console.log('========================');
    
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            console.log('❌ Erro ao acessar tabela users:', error.message);
        } else {
            console.log('✅ Tabela users acessível');
        }
        
        const { data: venuesData, error: venuesError } = await supabase
            .from('venues')
            .select('count')
            .limit(1);
        
        if (venuesError) {
            console.log('❌ Erro ao acessar tabela venues:', venuesError.message);
        } else {
            console.log('✅ Tabela venues acessível');
        }
        
    } catch (err) {
        console.log('❌ Erro ao verificar tabelas:', err.message);
    }
}

async function runChecks() {
    await checkPolicies();
    await listTables();
    
    console.log('');
    console.log('🎯 Próximos passos:');
    console.log('===================');
    console.log('1. Se a inserção funcionou, o problema está resolvido');
    console.log('2. Se não funcionou, as políticas RLS ainda estão incorretas');
    console.log('3. Verifique se o SQL foi aplicado corretamente no Supabase');
}

runChecks(); 