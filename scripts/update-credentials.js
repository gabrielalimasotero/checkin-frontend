console.log('🔧 Verificando credenciais do Supabase...');
console.log('==========================================');
console.log('');

console.log('❌ Problema identificado: "certificate has expired"');
console.log('💡 Isso pode indicar credenciais desatualizadas ou problema temporário.');
console.log('');

console.log('🔍 Possíveis soluções:');
console.log('');

console.log('1️⃣ Verificar se o projeto ainda existe:');
console.log('   - Acesse: https://supabase.com/dashboard');
console.log('   - Verifique se o projeto "nwikoaogixmhiiqcdxqs" ainda está ativo');
console.log('   - Se não estiver, crie um novo projeto');
console.log('');

console.log('2️⃣ Obter novas credenciais:');
console.log('   - Vá para: Settings → API');
console.log('   - Copie a nova "Project URL"');
console.log('   - Copie a nova "anon public" key');
console.log('');

console.log('3️⃣ Atualizar arquivos de configuração:');
console.log('   - src/lib/supabase.ts');
console.log('   - scripts/test-supabase.js');
console.log('   - scripts/check-auth-config.js');
console.log('   - public/test-supabase.html');
console.log('');

console.log('4️⃣ Verificar configuração de autenticação:');
console.log('   - Authentication → URL Configuration');
console.log('   - Site URL: http://localhost:8081');
console.log('   - Redirect URLs:');
console.log('     * http://localhost:8081/auth/callback');
console.log('     * http://localhost:8081/welcome');
console.log('');

console.log('5️⃣ Aplicar schema novamente:');
console.log('   - SQL Editor → New Query');
console.log('   - Cole o schema do npm run fix-schema');
console.log('   - Execute');
console.log('');

console.log('🎯 Próximos passos:');
console.log('1. Verifique se o projeto Supabase ainda existe');
console.log('2. Se existir, obtenha novas credenciais');
console.log('3. Se não existir, crie um novo projeto');
console.log('4. Me informe as novas credenciais para atualizar os arquivos');
console.log('');

console.log('📋 Credenciais atuais (que podem estar expiradas):');
console.log('URL: https://db.nwikoaogixmhiiqcdxqs.supabase.co');
console.log('Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ');
console.log('');

console.log('🔗 Links úteis:');
console.log('- Dashboard: https://supabase.com/dashboard');
console.log('- Documentação: https://supabase.com/docs');
console.log('- Status: https://status.supabase.com'); 