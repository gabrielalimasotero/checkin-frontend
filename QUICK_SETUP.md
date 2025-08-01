# 🚀 Configuração Rápida - Supabase CheckIn

## ⚡ Passos para Configurar

### 1. Acesse o Dashboard do Supabase
- Vá para [supabase.com](https://supabase.com)
- Faça login e acesse o projeto: `nwikoaogixmhiiqcdxqs`

### 2. Aplique o Schema
1. No dashboard, vá para **SQL Editor**
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `database/schema_only.sql`
4. Clique em **Run** para executar

### 3. Configure Autenticação
1. Vá para **Authentication** > **Providers**
2. Habilite **Email** (já deve estar habilitado)
3. Habilite **Google** se quiser login social
4. Vá para **Authentication** > **URL Configuration**
5. Configure:
   - **Site URL**: `http://localhost:8080`
   - **Redirect URLs**: 
     - `http://localhost:8080/auth/callback`
     - `http://localhost:8080/welcome`

### 4. Teste a Conexão
```bash
npm run test-supabase
```

### 5. Execute o App
```bash
npm run dev
```

## 🔍 Verificação

Após aplicar o schema, você deve ver:
- ✅ Tabelas criadas: `users`, `venues`, `checkins`, `groups`, etc.
- ✅ Funções criadas: `calculate_distance`, `get_nearby_venues`, etc.
- ✅ Políticas RLS aplicadas
- ✅ Índices criados

## 🎯 Próximos Passos

1. **Teste o Registro**: Crie uma conta no app
2. **Teste o Login**: Faça login com a conta criada
3. **Verifique Rotas**: Confirme que as rotas protegidas funcionam
4. **Teste Logout**: Verifique se o logout funciona

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o schema foi aplicado completamente
2. Confirme se as URLs de redirecionamento estão corretas
3. Teste a conexão com `npm run test-supabase` 