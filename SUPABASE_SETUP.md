# 🔐 Configuração do Supabase - Projeto CheckIn

Este documento explica como configurar o Supabase para autenticação no projeto CheckIn.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase
3. Schema do banco de dados aplicado

## 🚀 Configuração

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login e crie um novo projeto
3. Anote a URL e a chave anônima do projeto

### 2. Aplicar Schema do Banco

1. No dashboard do Supabase, vá para **SQL Editor**
2. Execute o arquivo `database/schema_only.sql`
3. Verifique se todas as tabelas foram criadas

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://db.nwikoaogixmhiiqcdxqs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWtvYW9naXhtaGlpcWNkeHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDUwNDEsImV4cCI6MjA2OTQ4MTA0MX0.d279Vz-X33ps9P1Sx7iTgsH87oz55HMzm8U0_uukoOQ
```

**Nota**: As credenciais já estão configuradas no código como fallback, mas é recomendado usar variáveis de ambiente em produção.

### 4. Configurar Autenticação

#### 4.1 Habilitar Providers

No dashboard do Supabase:
1. Vá para **Authentication** > **Providers**
2. Habilite **Email** e **Google**
3. Configure o Google OAuth se necessário

#### 4.2 Configurar URLs de Redirecionamento

Para desenvolvimento local:
- **Site URL**: `http://localhost:8080`
- **Redirect URLs**: 
  - `http://localhost:8080/auth/callback`
  - `http://localhost:8080/welcome`

### 5. Configurar Políticas RLS

As políticas básicas já estão incluídas no schema, mas você pode ajustá-las conforme necessário.

## 🔧 Funcionalidades Implementadas

### ✅ Autenticação
- Login com email/senha
- Login com Google
- Registro de usuários
- Logout
- Proteção de rotas

### ✅ Perfil do Usuário
- Criação automática do perfil no registro
- Busca do perfil no login
- Sincronização com auth.users

### ✅ Proteção de Rotas
- Componente `ProtectedRoute`
- Redirecionamento automático
- Loading states

## 🧪 Testando

1. Execute o projeto: `npm run dev`
2. Acesse `http://localhost:8082`
3. Teste o registro e login
4. Verifique se as rotas protegidas funcionam

## 🔍 Troubleshooting

### Erro de CORS
- Verifique se as URLs estão configuradas corretamente no Supabase
- Certifique-se de que o domínio está na lista de sites permitidos

### Erro de Políticas RLS
- Verifique se as políticas estão aplicadas corretamente
- Teste as consultas diretamente no SQL Editor

### Erro de Autenticação
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o provider está habilitado no Supabase

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Autenticação](https://supabase.com/docs/guides/auth)
- [Políticas RLS](https://supabase.com/docs/guides/auth/row-level-security) 