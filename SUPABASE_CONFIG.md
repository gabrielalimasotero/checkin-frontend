# 🔐 Configuração Supabase - CheckIn

## 📋 Credenciais do Projeto

### Host e Conexão
- **Host**: `db.nwikoaogixmhiiqcdxqs.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: `checkinvinicius123456`

### Chaves de API
- **URL**: `https://db.nwikoaogixmhiiqcdxqs.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzkwNTA0MSwiZXhwIjoyMDY5NDgxMDQxfQ.6SGFIM4he-yifJ_Y-ZrOX7bNyzsMdQ2BS8xjoZSHgoY`

## 🚀 Configuração Local

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://db.nwikoaogixmhiiqcdxqs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ
```

### 2. Aplicar Schema
Execute o arquivo `database/schema_only.sql` no SQL Editor do Supabase.

### 3. Configurar Autenticação
No dashboard do Supabase:
1. **Authentication** > **Providers**
2. Habilitar **Email** e **Google**
3. **URLs de Redirecionamento**:
   - `http://localhost:8080/auth/callback`
   - `http://localhost:8080/welcome`

## 🔧 Status da Configuração

- ✅ **Projeto Criado**: `nwikoaogixmhiiqcdxqs`
- ✅ **Credenciais Configuradas**: No código
- ⏳ **Schema**: Precisa ser aplicado
- ⏳ **Autenticação**: Precisa ser configurada
- ⏳ **Testes**: Pendente

## 📝 Próximos Passos

1. **Aplicar Schema**: Execute `database/schema_only.sql`
2. **Configurar Auth**: Habilite providers no dashboard
3. **Testar**: Registre um usuário e teste login
4. **Verificar**: Confirme se as rotas protegidas funcionam 