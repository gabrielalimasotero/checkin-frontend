import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nwikoaogixmhiiqcdxqs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testInterests() {
  console.log('🧪 Testando funcionalidade de interesses...');
  console.log('==========================================\n');

  try {
    // 1. Criar um usuário de teste
    console.log('1️⃣ Criando usuário de teste...');
    const testEmail = `test${Date.now()}@example.com`;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpassword123'
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário:', authError);
      return;
    }

    const userId = authData.user.id;
    console.log('✅ Usuário criado:', userId);

    // 2. Criar perfil do usuário
    console.log('\n2️⃣ Criando perfil do usuário...');
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: testEmail,
        name: 'Test User'
      });

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      return;
    }

    console.log('✅ Perfil criado');

    // 3. Testar criação de interesses
    console.log('\n3️⃣ Testando criação de interesses...');
    const testInterests = ['Jazz ao vivo', 'Música ambiente', 'Voz e violão'];

    for (const interestName of testInterests) {
      // Verificar se o interesse já existe
      let { data: existingInterest, error: checkError } = await supabase
        .from('interests')
        .select('id')
        .eq('name', interestName)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Erro ao verificar interesse:', checkError);
        continue;
      }

      let interestId;

      if (!existingInterest) {
        // Criar novo interesse
        const { data: newInterest, error: createError } = await supabase
          .from('interests')
          .insert({ name: interestName })
          .select('id')
          .single();

        if (createError) {
          console.error('❌ Erro ao criar interesse:', createError);
          continue;
        }

        interestId = newInterest.id;
        console.log(`✅ Interesse criado: ${interestName} (ID: ${interestId})`);
      } else {
        interestId = existingInterest.id;
        console.log(`✅ Interesse já existe: ${interestName} (ID: ${interestId})`);
      }

      // Adicionar relacionamento usuário-interesse
      const { error: insertError } = await supabase
        .from('user_interests')
        .insert({
          user_id: userId,
          interest_id: interestId
        });

      if (insertError) {
        console.error('❌ Erro ao adicionar interesse do usuário:', insertError);
      } else {
        console.log(`✅ Interesse adicionado ao usuário: ${interestName}`);
      }
    }

    // 4. Testar carregamento de interesses
    console.log('\n4️⃣ Testando carregamento de interesses...');
    const { data: userInterests, error: loadError } = await supabase
      .from('user_interests')
      .select(`
        interest_id,
        interests (
          id,
          name
        )
      `)
      .eq('user_id', userId);

    if (loadError) {
      console.error('❌ Erro ao carregar interesses:', loadError);
      return;
    }

    console.log('📋 Dados brutos:', userInterests);
    
    const interestNames = userInterests?.map(item => {
      const interest = item.interests;
      return interest?.name;
    }).filter(Boolean) || [];

    console.log('✅ Interesses carregados:', interestNames);

    // 5. Testar remoção de interesse
    console.log('\n5️⃣ Testando remoção de interesse...');
    if (interestNames.length > 0) {
      const interestToRemove = interestNames[0];
      
      // Buscar ID do interesse
      const { data: interestData, error: interestError } = await supabase
        .from('interests')
        .select('id')
        .eq('name', interestToRemove)
        .single();

      if (interestError) {
        console.error('❌ Erro ao buscar interesse para remoção:', interestError);
      } else {
        // Remover relacionamento
        const { error: removeError } = await supabase
          .from('user_interests')
          .delete()
          .eq('user_id', userId)
          .eq('interest_id', interestData.id);

        if (removeError) {
          console.error('❌ Erro ao remover interesse:', removeError);
        } else {
          console.log(`✅ Interesse removido: ${interestToRemove}`);
        }
      }
    }

    // 6. Verificar estado final
    console.log('\n6️⃣ Verificando estado final...');
    const { data: finalInterests, error: finalError } = await supabase
      .from('user_interests')
      .select(`
        interest_id,
        interests (
          id,
          name
        )
      `)
      .eq('user_id', userId);

    if (finalError) {
      console.error('❌ Erro ao verificar estado final:', finalError);
    } else {
      const finalNames = finalInterests?.map(item => item.interests?.name).filter(Boolean) || [];
      console.log('✅ Estado final dos interesses:', finalNames);
    }

    console.log('\n🎉 Teste de interesses concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testInterests(); 