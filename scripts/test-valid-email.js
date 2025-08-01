import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Testando registro com email válido...');
console.log('=====================================');
console.log('');

async function testValidEmailRegistration() {
    try {
        // Email válido para teste
        const testEmail = `test${Date.now()}@gmail.com`;
        const testPassword = 'TestPassword123!';
        
        console.log(`📧 Testando com email: ${testEmail}`);
        console.log(`🔑 Senha: ${testPassword}`);
        console.log('');
        
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                emailRedirectTo: 'http://localhost:8081/welcome'
            }
        });
        
        if (error) {
            console.log('❌ Erro no registro:', error.message);
            console.log('📋 Detalhes:', JSON.stringify(error, null, 2));
            return false;
        }
        
        console.log('✅ Registro bem-sucedido!');
        console.log('📋 Dados retornados:', JSON.stringify(data, null, 2));
        
        if (data.user) {
            console.log('👤 Usuário criado:', data.user.email);
            console.log('🆔 ID do usuário:', data.user.id);
        }
        
        if (data.session) {
            console.log('🔐 Sessão criada automaticamente');
        }
        
        return true;
    } catch (err) {
        console.log('❌ Erro de rede:', err.message);
        return false;
    }
}

async function testLogin() {
    try {
        console.log('');
        console.log('🔐 Testando login...');
        
        const testEmail = `test${Date.now()}@gmail.com`;
        const testPassword = 'TestPassword123!';
        
        // Primeiro registra
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword
        });
        
        if (signUpError) {
            console.log('❌ Erro no registro para teste de login:', signUpError.message);
            return false;
        }
        
        // Aguarda um pouco
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Tenta fazer login
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
        });
        
        if (signInError) {
            console.log('❌ Erro no login:', signInError.message);
            return false;
        }
        
        console.log('✅ Login bem-sucedido!');
        console.log('👤 Usuário logado:', signInData.user.email);
        
        return true;
    } catch (err) {
        console.log('❌ Erro:', err.message);
        return false;
    }
}

async function runTests() {
    console.log('🧪 Executando testes de autenticação...');
    console.log('');
    
    const registrationResult = await testValidEmailRegistration();
    const loginResult = await testLogin();
    
    console.log('');
    console.log('📊 Resultados:');
    console.log('==============');
    console.log(`✅ Registro: ${registrationResult ? 'OK' : 'FALHOU'}`);
    console.log(`✅ Login: ${loginResult ? 'OK' : 'FALHOU'}`);
    console.log('');
    
    if (registrationResult && loginResult) {
        console.log('🎉 Todos os testes passaram!');
        console.log('💡 O problema pode estar nas URLs de redirecionamento.');
        console.log('');
        console.log('🔧 Verifique no Supabase Dashboard:');
        console.log('   Authentication → URL Configuration');
        console.log('   Site URL: http://localhost:8081 (porta 8081)');
        console.log('   Redirect URLs:');
        console.log('     - http://localhost:8081/auth/callback');
        console.log('     - http://localhost:8081/welcome');
    } else {
        console.log('❌ Alguns testes falharam.');
        console.log('🔧 Verifique a configuração do Supabase.');
    }
}

runTests(); 