import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔧 Corrigindo perfil do usuário...');
console.log('================================');
console.log('');

async function fixUserProfile() {
    try {
        const userId = '1bbbb9bd-c278-4c96-81d5-8b82f2083831';
        
        console.log('🔍 Buscando usuário atual...');
        const { data: currentUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (fetchError) {
            console.log('❌ Erro ao buscar usuário:', fetchError.message);
            return;
        }
        
        console.log('📋 Usuário atual:', currentUser);
        console.log('');
        
        // Atualizar com os dados corretos
        console.log('💾 Atualizando perfil com dados corretos...');
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
                name: 'Teste Criar Conta', // Nome que você digitou
                email: 'testecriarconta@gmail.com' // Email que você digitou
            })
            .eq('id', userId)
            .select()
            .single();
        
        if (updateError) {
            console.log('❌ Erro ao atualizar:', updateError.message);
        } else {
            console.log('✅ Perfil atualizado com sucesso!');
            console.log('📋 Dados atualizados:', updatedUser);
        }
        
        // Verificar se foi atualizado
        console.log('');
        console.log('🔍 Verificando atualização...');
        const { data: checkUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (checkError) {
            console.log('❌ Erro ao verificar:', checkError.message);
        } else {
            console.log('✅ Verificação final:');
            console.log('📋 ID:', checkUser.id);
            console.log('📋 Nome:', checkUser.name);
            console.log('📋 Email:', checkUser.email);
            console.log('📋 Criado em:', checkUser.created_at);
            console.log('📋 Atualizado em:', checkUser.updated_at);
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
            .select('id, name, email, created_at, updated_at')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.log('❌ Erro ao listar usuários:', error.message);
        } else {
            console.log(`✅ Encontrados ${users.length} usuários:`);
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email})`);
                console.log(`   Criado: ${user.created_at}`);
                console.log(`   Atualizado: ${user.updated_at}`);
                console.log('');
            });
        }
    } catch (err) {
        console.log('❌ Erro ao listar usuários:', err.message);
    }
}

async function runFix() {
    await fixUserProfile();
    await listAllUsers();
    
    console.log('');
    console.log('🎯 Próximos passos:');
    console.log('===================');
    console.log('1. Se o perfil foi atualizado, recarregue a página no navegador');
    console.log('2. O perfil deve mostrar os dados corretos agora');
    console.log('3. Teste criar uma nova conta para verificar se funciona corretamente');
}

runFix(); 