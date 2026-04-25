faz # Plano de Deploy - Netlify + Supabase

## Objetivo
Adaptar o projeto para ser hospedado no Netlify (ou Vercel) sem perder pedidos e usuarios, usando Supabase como banco de dados persistente.

## Problema Atual
- O projeto usa arquivos JSON locais (`data/orders.json`, `data/users.json`) via `fs.readFile`/`fs.writeFile`.
- No Netlify/Vercel o filesystem e efemero: dados sao perdidos a cada deploy ou cold start.

## Solucao
Migrar `lib/db.ts` para usar Supabase (PostgreSQL online, gratuito ate 500MB).

---

## Passos do Plano

### 1. Instalar dependencia
```bash
npm install @supabase/supabase-js
```

### 2. Configurar Supabase
- Criar conta em https://supabase.com
- Criar novo projeto
- No SQL Editor, executar script para criar tabelas `orders` e `users`
- Copiar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- Adicionar ao `.env.local`:
  ```
  SUPABASE_URL=https://seu-projeto.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=sua-chave-secreta
  OPENAI_API_KEY=sk-sua-chave-openai
  ```

### 3. Atualizar `lib/db.ts`
- Substituir todas as funcoes `fs.readFile`/`fs.writeFile` por chamadas ao Supabase.
- Manter a mesma interface (assinaturas das funcoes) para nao quebrar as API routes.
- Adicionar fallback para arquivo local caso Supabase nao esteja configurado (modo dev).

### 4. Atualizar variaveis de ambiente no projeto
- Remover dependencia de filesystem no deploy.
- Garantir que `data/` ainda funcione localmente sem Supabase.

### 5. Criar guia de deploy
- Criar `DEPLOY.md` com instrucoes passo a passo para subir no Netlify.

---

## Arquivos a Editar
- [x] `lib/db.ts` - migrado para Supabase com fallback local
- [x] `package.json` - `@supabase/supabase-js` instalado
- [x] `.env.local.example` (novo) - modelo de variaveis
- [x] `DEPLOY.md` (novo) - instrucoes de deploy no Netlify

## O que NAO muda
- Todas as telas e componentes (frontend)
- Todas as API routes (`app/api/*/route.ts`)
- Chat com OpenAI
- Carrinho, wishlist, login, admin dashboard
- Estilos, animacoes, sons

---

## Seguranca
- `SUPABASE_SERVICE_ROLE_KEY` so sera usada no servidor (API routes), nunca exposta no frontend.
- Usar Row Level Security (RLS) opcional no Supabase para reforcar permissoes.

