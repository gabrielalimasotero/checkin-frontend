import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Verificando perfil do usuário...');
console.log('==================================');
console.log('');

async function checkUserProfile() {
    const userId = "4c023075-02f8-4aef-aadc-330db046b455";
    
    console.log(`📋 Verificando usuário: ${userId}`);
    console.log('');
    
    try {
        // Verificar se o usuário existe na tabela users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (userError) {
            console.log('❌ Erro ao buscar usuário:', userError.message);
            console.log('💡 O perfil não foi criado automaticamente');
            
            // Tentar criar o perfil
            console.log('🔧 Tentando criar perfil...');
            const { data: insertData, error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        id: userId,
                        name: 'Usuário',
                        email: 'user@example.com',
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
                console.log('❌ Erro ao criar perfil:', insertError.message);
                return false;
            }
            
            console.log('✅ Perfil criado com sucesso!');
            console.log('📋 Dados:', insertData);
            return true;
        }
        
        console.log('✅ Perfil encontrado!');
        console.log('📋 Dados:', userData);
        return true;
        
    } catch (err) {
        console.log('❌ Erro geral:', err.message);
        return false;
    }
}

async function listAllUsers() {
    console.log('');
    console.log('📋 Listando todos os usuários:');
    console.log('=============================');
    
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (error) {
            console.log('❌ Erro ao listar usuários:', error.message);
            return;
        }
        
        console.log(`✅ Encontrados ${data.length} usuários:`);
        data.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.id}`);
        });
        
    } catch (err) {
        console.log('❌ Erro ao listar usuários:', err.message);
    }
}

async function runChecks() {
    const profileExists = await checkUserProfile();
    await listAllUsers();
    
    console.log('');
    console.log('📊 Resultado:');
    console.log('=============');
    console.log(`✅ Perfil existe: ${profileExists ? 'SIM' : 'NÃO'}`);
    
    if (profileExists) {
        console.log('💡 O problema pode estar no frontend');
        console.log('🔧 Recarregue a página e teste novamente');
    } else {
        console.log('💡 O perfil não foi criado automaticamente');
        console.log('🔧 Verifique as políticas RLS');
    }
}

runChecks(); 