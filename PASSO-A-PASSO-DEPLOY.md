# PASSO A PASSO - Subir seu site no Netlify (BEM SIMPLES)

## FASE 1: Criar o banco de dados (Supabase) - 5 minutos

### 1.1 Acesse o site
Va em: https://supabase.com
Clique em "Start your project" ou "Sign In"

### 1.2 Crie uma conta
- Pode usar Google, GitHub ou email.
- E gratuito.

### 1.3 Crie um projeto
- Clique em "New Project"
- Escolha um nome (ex: imperio-modas)
- Escolha a regiao mais proxima (South America - Sao Paulo)
- Clique "Create new project"

### 1.4 Crie as tabelas
- No menu lateral esquerdo, clique em "SQL Editor"
- Clique em "New query"
- Cole o texto abaixo (e exatamente assim):

```sql
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (username, email, role, password_hash)
VALUES (
  'admin',
  'admin@imperiomodas.com',
  'admin',
  '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu8V2'
)
ON CONFLICT (username) DO NOTHING;
```

- Clique no botao "Run" (ou "Run Query")
- Pronto, banco criado!

### 1.5 Pegue as chaves
- No menu lateral, clique em: Project Settings (engrenagem) > API
- Voce vera dois campos importantes:
  - **URL**: copie o link inteiro (ex: https://abcd1234.supabase.co)
  - **service_role secret**: clique em "Reveal" e copie o texto longo
- Cole esses dois valores num bloco de notas do Windows, voce vai precisar deles depois.

---

## FASE 2: Subir o site no Netlify - 5 minutos

### 2.1 Acesse o Netlify
Va em: https://app.netlify.com
Crie uma conta (pode usar GitHub ou email).

### 2.2 Conecte seu projeto
- Clique em "Add new site" (botao laranja)
- Escolha "Import an existing project"
- Conecte com GitHub
- **IMPORTANTE**: Se seu projeto ainda nao esta no GitHub, faca isso primeiro:
  - Va em https://github.com/new
  - Crie um repositorio novo (pode ser publico)
  - No seu PC, na pasta do projeto, execute:
    ```
    git init
    git add .
    git commit -m "primeiro commit"
    git branch -M main
    git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
    git push -u origin main
    ```
  - Depois volte no Netlify e escolha esse repositorio

### 2.3 Configure o deploy
- O Netlify vai detectar sozinho que e um projeto Next.js
- Verifique se esta assim:
  - Build command: `npm run build`
  - Publish directory: `.next`
- Clique em "Deploy site"

### 2.4 Configure as variaveis de ambiente
- No Netlify, va em: Site settings > Environment variables
- Clique em "Add a variable"
- Adicione uma por uma:

| Key | Value |
|-----|-------|
| SUPABASE_URL | Cole aqui a URL do Supabase (passo 1.5) |
| SUPABASE_SERVICE_ROLE_KEY | Cole aqui a chave secreta do Supabase (passo 1.5) |
| OPENAI_API_KEY | sk-sua-chave-da-openai (se tiver, senao pode deixar em branco) |

- Clique em "Save"

### 2.5 Redeploy
- Va em "Deploys" no menu superior
- Clique em "Trigger deploy" > "Deploy site"
- Espere 2-3 minutos

### 2.6 Pronto!
- O Netlify vai te dar um link (ex: https://seu-site-123.netlify.app)
- Clique no link e teste seu site!

---

## FASE 3: Testar se esta salvando os pedidos

1. Abra o site no link do Netlify
2. Adicione um produto no carrinho
3. Preencha os dados e finalize
4. Va no Supabase > Table Editor > orders
5. Se aparecer o pedido la = TUDO CERTO!

---

## PROBLEMAS COMUNS

**"Build failed" no Netlify**
- Va em Deploys > clique no deploy que falhou
- Leia o erro no log. Provavelmente esqueceu de colocar as variaveis de ambiente.

**Pedido nao aparece no Supabase**
- Verifique se colocou SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY corretamente
- Verifique se rodou o script SQL na Fase 1.4

**Chat nao responde**
- Normal se nao colocou OPENAI_API_KEY. O chat vai funcionar com resposta padrao.
- Se quiser o chat inteligente, crie uma conta em https://platform.openai.com e gere uma API key.

---

## AJUDA RAPIDA

Se travar em algum passo, me diga em qual numero voce parou que eu te ajudo!

