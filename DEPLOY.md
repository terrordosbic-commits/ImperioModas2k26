# Guia de Deploy - Netlify

## Pre-requisitos
- Conta no Netlify: https://app.netlify.com
- Conta no Supabase: https://supabase.com
- Node.js 20+ instalado na maquina local

---

## Passo 1: Configurar o Supabase

1. Acesse https://supabase.com e crie uma conta (gratuito).
2. Crie um novo projeto.
3. No menu lateral, va em **SQL Editor** > **New query**.
4. Cole e execute o script abaixo para criar as tabelas:

```sql
-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir usuario admin padrao (senha: admin123)
INSERT INTO users (username, email, role, password_hash)
VALUES (
  'admin',
  'admin@imperiomodas.com',
  'admin',
  '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu8V2'
)
ON CONFLICT (username) DO NOTHING;
```

5. Va em **Project Settings** > **API**.
6. Copie os valores:
   - `URL` -> sera a `SUPABASE_URL`
   - `service_role secret` -> sera a `SUPABASE_SERVICE_ROLE_KEY`

---

## Passo 2: Configurar variaveis de ambiente no Netlify

1. No Netlify, va em **Site settings** > **Environment variables**.
2. Adicione as seguintes variaveis:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
OPENAI_API_KEY=sk-sua-chave-openai-aqui
```

> **IMPORTANTE:** Nunca use a `anon key` como `SUPABASE_SERVICE_ROLE_KEY`. A service role key deve ficar secreta no servidor.

---

## Passo 3: Deploy no Netlify

### Opcao A - Deploy via Git (recomendado)

1. Envie seu projeto para um repositorio GitHub/GitLab/Bitbucket.
2. No Netlify, clique em **Add new site** > **Import an existing project**.
3. Conecte sua conta do GitHub e escolha o repositorio.
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Clique em **Deploy site**.

### Opcao B - Deploy manual (drag and drop)

1. Na sua maquina local, execute:
   ```bash
   npm install
   npm run build
   ```
2. No Netlify, va em **Sites** > clique em **Add new site** > **Deploy manually**.
3. Arraste a pasta `.next` compactada ou use o Netlify CLI.

---

## Passo 4: Verificar se esta funcionando

1. Acesse a URL do seu site no Netlify.
2. Teste o carrinho: adicione um produto, preencha os dados e finalize o pedido.
3. Va no painel do Supabase > **Table Editor** > **orders** e confirme que o pedido apareceu.
4. Teste o login com:
   - Usuario: `admin`
   - Senha: `admin123`
5. No painel admin, verifique se os pedidos estao listados.

---

## Dados salvos no Supabase

| Tabela | Dados |
|--------|-------|
| `orders` | Todos os pedidos feitos pelos clientes |
| `users` | Usuarios cadastrados (admin e clientes) |

---

## Desenvolvimento local (sem Supabase)

Se quiser rodar localmente sem configurar o Supabase, basta nao adicionar as variaveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. O sistema vai usar automaticamente os arquivos JSON na pasta `data/`.

```bash
npm install
npm run dev
```

---

## Troubleshooting

**Erro: "Supabase URL is required"**
- Verifique se as variaveis de ambiente estao configuradas corretamente no Netlify.

**Pedidos nao aparecem no banco**
- Confira no Supabase SQL Editor se as tabelas foram criadas.
- Verifique os logs do Netlify em **Site settings** > **Logs**.

**Chatbot nao responde**
- Verifique se a `OPENAI_API_KEY` esta configurada nas variaveis de ambiente.

---

## Contato

Se precisar de ajuda, verifique os logs do Netlify e do Supabase. Ambos tem paineis de logs em tempo real.

