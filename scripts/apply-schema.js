// Script para aplicar o schema no Supabase
import fs from 'fs';
import path from 'path';

console.log('🔧 Script para aplicar schema no Supabase');
console.log('==========================================');
console.log('');

console.log('📋 Passos para aplicar o schema:');
console.log('');
console.log('1. Acesse o Supabase Dashboard:');
console.log('   https://supabase.com');
console.log('');
console.log('2. Faça login e acesse o projeto:');
console.log('   nwikoaogixmhiiqcdxqs');
console.log('');
console.log('3. No dashboard, vá para SQL Editor');
console.log('');
console.log('4. Clique em "New Query"');
console.log('');
console.log('5. Cole o conteúdo do arquivo:');
console.log('   database/schema_only.sql');
console.log('');
console.log('6. Clique em "Run" para executar');
console.log('');

// Verificar se o arquivo existe
const schemaPath = path.join(process.cwd(), 'database', 'schema_only.sql');
if (fs.existsSync(schemaPath)) {
  console.log('✅ Arquivo schema_only.sql encontrado!');
  console.log('');
  console.log('📄 Conteúdo do arquivo:');
  console.log('========================');
  console.log('');
  
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  console.log(schemaContent);
} else {
  console.log('❌ Arquivo schema_only.sql não encontrado!');
  console.log('Verifique se o arquivo existe em database/schema_only.sql');
}

console.log('');
console.log('🎯 Após aplicar o schema:');
console.log('1. Execute: npm run test-supabase');
console.log('2. Teste o botão "Criar Conta" no app');
console.log('3. Verifique se o registro funciona'); 