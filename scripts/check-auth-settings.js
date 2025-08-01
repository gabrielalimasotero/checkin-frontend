console.log('🔍 Verificando configurações de autenticação...');
console.log('=============================================');
console.log('');

console.log('📋 Configurações que precisam ser verificadas no Supabase Dashboard:');
console.log('');

console.log('1️⃣ Authentication → Settings:');
console.log('   - Enable email confirmations: DEVE estar DESABILITADO para testes');
console.log('   - Enable phone confirmations: PODE estar DESABILITADO');
console.log('   - JWT expiry: 3600 (1 hora)');
console.log('');

console.log('2️⃣ Authentication → URL Configuration:');
console.log('   Site URL: http://localhost:8081');
console.log('   Redirect URLs:');
console.log('     - http://localhost:8081/auth/callback');
console.log('     - http://localhost:8081/welcome');
console.log('     - http://localhost:8081/home');
console.log('');

console.log('3️⃣ Authentication → Providers:');
console.log('   Email: HABILITADO');
console.log('   Google: HABILITADO (se necessário)');
console.log('');

console.log('4️⃣ Database → Policies:');
console.log('   Verificar se as políticas RLS estão aplicadas');
console.log('   - Users can view own profile');
console.log('   - Users can update own profile');
console.log('   - Users can create own checkins');
console.log('');

console.log('🔧 Como desabilitar confirmação de email:');
console.log('1. Vá para Supabase Dashboard');
console.log('2. Authentication → Settings');
console.log('3. Desabilite "Enable email confirmations"');
console.log('4. Salve as configurações');
console.log('');

console.log('🎯 Próximos passos:');
console.log('1. Verifique as configurações acima');
console.log('2. Desabilite confirmação de email (para testes)');
console.log('3. Teste o botão "Criar Conta" novamente');
console.log('4. Se funcionar, reabilite confirmação de email para produção');
console.log('');

console.log('📞 URLs importantes:');
console.log('- Dashboard: https://supabase.com/dashboard/project/nwikoaogixmhiiqcdxqs');
console.log('- Authentication Settings: https://supabase.com/dashboard/project/nwikoaogixmhiiqcdxqs/auth/settings');
console.log('- URL Configuration: https://supabase.com/dashboard/project/nwikoaogixmhiiqcdxqs/auth/url-configuration'); 