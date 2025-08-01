import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔧 Atualizando perfil do usuário atual...');
console.log('=======================================');
console.log('');

async function updateCurrentUser() {
    try {
        // Buscar o usuário que foi criado com dados incorretos
        const userId = '1bbbb9bd-c278-4c96-81d5-8b82f2083831';
        
        console.log('🔍 Buscando usuário:', userId);
        
        // Primeiro, vamos verificar se o usuário existe no Supabase Auth
        console.log('📋 Verificando dados do Supabase Auth...');
        
        // Como não podemos acessar diretamente o Supabase Auth, vamos tentar fazer login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'testecriarconta@gmail.com',
            password: 'TestPassword123!' // Assumindo que você usou esta senha
        });
        
        if (authError) {
            console.log('❌ Erro no login:', authError.message);
            console.log('💡 Vamos tentar atualizar o perfil diretamente');
        } else {
            console.log('✅ Login bem-sucedido!');
            console.log('📋 Dados do usuário:', authData.user);
            console.log('📋 Metadata:', authData.user.user_metadata);
        }
        
        // Atualizar o perfil na tabela users
        console.log('');
        console.log('💾 Atualizando perfil na tabela users...');
        
        const { data: updateData, error: updateError } = await supabase
            .from('users')
            .update({
                name: 'Teste Criar Conta', // Nome que deveria ter sido usado
                email: 'testecriarconta@gmail.com' // Email correto
            })
            .eq('id', userId)
            .select();
        
        if (updateError) {
            console.log('❌ Erro ao atualizar perfil:', updateError.message);
        } else {
            console.log('✅ Perfil atualizado com sucesso!');
            console.log('📋 Dados atualizados:', updateData);
        }
        
        // Verificar o resultado
        console.log('');
        console.log('🔍 Verificando perfil atualizado...');
        const { data: checkData, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (checkError) {
            console.log('❌ Erro ao verificar perfil:', checkError.message);
        } else {
            console.log('✅ Perfil verificado:');
            console.log('📋 ID:', checkData.id);
            console.log('📋 Nome:', checkData.name);
            console.log('📋 Email:', checkData.email);
            console.log('📋 Criado em:', checkData.created_at);
        }
        
    } catch (err) {
        console.log('❌ Erro geral:', err.message);
    }
}

async function listAllUsers() {
    console.log('');
    console.log('📋 Listando todos os usuários...');
    console.log('==============================');
    
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, name, email, created_at')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.log('❌ Erro ao listar usuários:', error.message);
        } else {
            console.log(`✅ Encontrados ${users.length} usuários:`);
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.created_at}`);
            });
        }
    } catch (err) {
        console.log('❌ Erro ao listar usuários:', err.message);
    }
}

async function runUpdate() {
    await updateCurrentUser();
    await listAllUsers();
    
    console.log('');
    console.log('🎯 Próximos passos:');
    console.log('===================');
    console.log('1. Se o perfil foi atualizado, teste o frontend novamente');
    console.log('2. Agora teste criar uma nova conta para ver se os dados corretos são salvos');
}

runUpdate(); 