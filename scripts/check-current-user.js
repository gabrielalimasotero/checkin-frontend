import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Verificando usuário atual...');
console.log('=============================');
console.log('');

async function checkCurrentUser() {
    try {
        // Verificar sessão atual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.log('❌ Erro ao obter sessão:', sessionError.message);
            return;
        }
        
        if (!session) {
            console.log('❌ Nenhuma sessão ativa');
            return;
        }
        
        console.log('✅ Sessão ativa encontrada');
        console.log('📋 ID do usuário:', session.user.id);
        console.log('📋 Email:', session.user.email);
        console.log('📋 Metadata:', session.user.user_metadata);
        console.log('');
        
        // Verificar perfil na tabela users
        console.log('🔍 Verificando perfil na tabela users...');
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (profileError) {
            console.log('❌ Erro ao buscar perfil:', profileError.message);
            console.log('💡 Tentando criar perfil...');
            
            // Criar perfil
            const { data: newProfile, error: createError } = await supabase
                .from('users')
                .insert([
                    {
                        id: session.user.id,
                        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
                        email: session.user.email,
                        is_connectable: true,
                        profile_visibility: 'friends',
                        auto_checkin_visibility: 'public',
                        allow_messages_from: 'friends',
                        review_delay: 'immediate',
                        notifications_enabled: true,
                    }
                ])
                .select()
                .single();
            
            if (createError) {
                console.log('❌ Erro ao criar perfil:', createError.message);
            } else {
                console.log('✅ Perfil criado com sucesso!');
                console.log('📋 Dados do perfil:', newProfile);
            }
        } else {
            console.log('✅ Perfil encontrado!');
            console.log('📋 Dados do perfil:', profile);
            
            // Verificar se os dados estão corretos
            const expectedName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário';
            if (profile.name !== expectedName) {
                console.log('⚠️ Nome do perfil não corresponde aos dados do usuário');
                console.log('📋 Nome atual:', profile.name);
                console.log('📋 Nome esperado:', expectedName);
                
                // Atualizar perfil
                console.log('💡 Atualizando perfil...');
                const { data: updatedProfile, error: updateError } = await supabase
                    .from('users')
                    .update({
                        name: expectedName,
                        email: session.user.email
                    })
                    .eq('id', session.user.id)
                    .select()
                    .single();
                
                if (updateError) {
                    console.log('❌ Erro ao atualizar perfil:', updateError.message);
                } else {
                    console.log('✅ Perfil atualizado com sucesso!');
                    console.log('📋 Dados atualizados:', updatedProfile);
                }
            } else {
                console.log('✅ Dados do perfil estão corretos!');
            }
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

async function runChecks() {
    await checkCurrentUser();
    await listAllUsers();
    
    console.log('');
    console.log('🎯 Próximos passos:');
    console.log('===================');
    console.log('1. Se o perfil foi criado/atualizado, teste o frontend novamente');
    console.log('2. Se ainda há problemas, verifique os logs do console do navegador');
}

runChecks(); 