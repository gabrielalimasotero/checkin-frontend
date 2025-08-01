// Script para testar conexão com Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://nwikoaogixmhiiqcdxqs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  try {
    // Teste 1: Verificar se consegue conectar
    console.log('1. Testando conexão básica...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message);
      console.log('💡 Dica: Verifique se o schema foi aplicado no Supabase');
      return;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Teste 2: Verificar se as tabelas existem
    console.log('2. Verificando tabelas...');
    const tables = ['users', 'venues', 'checkins', 'groups'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ Tabela ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabela ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Tabela ${table}: Erro - ${err.message}`);
      }
    }
    
    // Teste 3: Verificar autenticação
    console.log('3. Testando autenticação...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Erro na autenticação:', authError.message);
    } else {
      console.log('✅ Autenticação configurada corretamente');
    }
    
    console.log('\n🎉 Teste concluído!');
    console.log('📝 Próximos passos:');
    console.log('1. Execute o schema em database/schema_only.sql');
    console.log('2. Configure os providers de autenticação no dashboard');
    console.log('3. Teste o registro e login no app');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o teste
testSupabaseConnection(); 