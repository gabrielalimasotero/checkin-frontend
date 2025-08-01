import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Testando inserção de usuário na tabela...');
console.log('==========================================');
console.log('');

async function testUserInsert() {
    try {
        // Primeiro, criar um usuário via auth
        const testEmail = `test${Date.now()}@gmail.com`;
        const testPassword = 'TestPassword123!';
        
        console.log(`📧 Criando usuário: ${testEmail}`);
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword
        });
        
        if (authError) {
            console.log('❌ Erro na autenticação:', authError.message);
            return false;
        }
        
        if (!authData.user) {
            console.log('❌ Nenhum usuário retornado da autenticação');
            return false;
        }
        
        console.log('✅ Usuário criado via auth:', authData.user.id);
        
        // Agora tentar inserir na tabela users
        console.log('📝 Tentando inserir na tabela users...');
        
        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: authData.user.id,
                    name: 'Test User',
                    email: testEmail,
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
            return false;
        }
        
        console.log('✅ Usuário inserido na tabela com sucesso!');
        console.log('📋 Dados inseridos:', JSON.stringify(insertData, null, 2));
        
        return true;
    } catch (err) {
        console.log('❌ Erro geral:', err.message);
        return false;
    }
}

async function testUserSelect() {
    try {
        console.log('');
        console.log('🔍 Testando seleção de usuários...');
        
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(5);
        
        if (error) {
            console.log('❌ Erro na seleção:', error.message);
            return false;
        }
        
        console.log('✅ Seleção bem-sucedida!');
        console.log('📋 Usuários encontrados:', data.length);
        console.log('📋 Dados:', JSON.stringify(data, null, 2));
        
        return true;
    } catch (err) {
        console.log('❌ Erro na seleção:', err.message);
        return false;
    }
}

async function runTests() {
    console.log('🧪 Executando testes de inserção...');
    console.log('');
    
    const insertResult = await testUserInsert();
    const selectResult = await testUserSelect();
    
    console.log('');
    console.log('📊 Resultados:');
    console.log('==============');
    console.log(`✅ Inserção: ${insertResult ? 'OK' : 'FALHOU'}`);
    console.log(`✅ Seleção: ${selectResult ? 'OK' : 'FALHOU'}`);
    console.log('');
    
    if (insertResult && selectResult) {
        console.log('🎉 Todos os testes passaram!');
        console.log('💡 O problema pode estar no frontend.');
    } else {
        console.log('❌ Alguns testes falharam.');
        console.log('🔧 Verifique as políticas RLS no Supabase.');
    }
}

runTests(); 