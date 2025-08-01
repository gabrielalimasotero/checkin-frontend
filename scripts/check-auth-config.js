import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Verificando configuração de autenticação...');
console.log('=============================================');
console.log('');

console.log('📋 Informações do projeto:');
console.log(`URL: ${SUPABASE_URL}`);
console.log(`Anon Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
console.log('');

console.log('🔧 Testando diferentes cenários...');
console.log('');

// Teste 1: Verificar se o projeto está acessível
async function testBasicConnection() {
    console.log('1️⃣ Testando conexão básica...');
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.log('❌ Erro na consulta:', error.message);
            return false;
        }
        console.log('✅ Conexão básica OK');
        return true;
    } catch (err) {
        console.log('❌ Erro de rede:', err.message);
        return false;
    }
}

// Teste 2: Verificar se a tabela users existe
async function testUsersTable() {
    console.log('2️⃣ Testando tabela users...');
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) {
            console.log('❌ Erro na tabela users:', error.message);
            return false;
        }
        console.log('✅ Tabela users OK');
        return true;
    } catch (err) {
        console.log('❌ Erro:', err.message);
        return false;
    }
}

// Teste 3: Testar registro de usuário
async function testUserRegistration() {
    console.log('3️⃣ Testando registro de usuário...');
    try {
        const testEmail = `test-${Date.now()}@example.com`;
        const testPassword = 'testpassword123';
        
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword
        });
        
        if (error) {
            console.log('❌ Erro no registro:', error.message);
            return false;
        }
        
        console.log('✅ Registro de usuário OK');
        
        // Limpar o usuário de teste
        if (data.user) {
            await supabase.auth.admin.deleteUser(data.user.id);
        }
        
        return true;
    } catch (err) {
        console.log('❌ Erro:', err.message);
        return false;
    }
}

// Teste 4: Verificar configuração de URLs
async function checkURLConfiguration() {
    console.log('4️⃣ Verificando configuração de URLs...');
    console.log('');
    console.log('⚠️  IMPORTANTE: Verifique manualmente no Supabase Dashboard:');
    console.log('');
    console.log('🔗 Authentication → URL Configuration');
    console.log('Site URL deve ser: http://localhost:8080');
    console.log('Redirect URLs devem incluir:');
    console.log('  - http://localhost:8080/auth/callback');
    console.log('  - http://localhost:8080/welcome');
    console.log('');
    console.log('🔗 Authentication → Providers');
    console.log('Email deve estar habilitado');
    console.log('Google deve estar configurado (se necessário)');
    console.log('');
}

async function runTests() {
    const results = [];
    
    results.push(await testBasicConnection());
    results.push(await testUsersTable());
    results.push(await testUserRegistration());
    
    console.log('');
    console.log('📊 Resultados dos testes:');
    console.log('========================');
    console.log(`✅ Conexão básica: ${results[0] ? 'OK' : 'FALHOU'}`);
    console.log(`✅ Tabela users: ${results[1] ? 'OK' : 'FALHOU'}`);
    console.log(`✅ Registro de usuário: ${results[2] ? 'OK' : 'FALHOU'}`);
    console.log('');
    
    if (results.every(r => r)) {
        console.log('🎉 Todos os testes passaram! O problema pode estar no frontend.');
    } else {
        console.log('❌ Alguns testes falharam. Verifique a configuração do Supabase.');
        checkURLConfiguration();
    }
    
    console.log('');
    console.log('🔧 Próximos passos:');
    console.log('1. Verifique as URLs de redirecionamento no Supabase');
    console.log('2. Teste o botão "Criar Conta" novamente');
    console.log('3. Verifique o console do navegador para erros');
}

runTests(); 