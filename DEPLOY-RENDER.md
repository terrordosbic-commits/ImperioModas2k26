# Guia de Deploy - Render

## O que voce precisa saber

O Render e uma otima escolha! Mas assim como Netlify e Vercel, ele tambem precisa que seu projeto esteja no **GitHub** para fazer o deploy automatico.

Se voce nao quer usar GitHub, o Render NAO tem opcao de "arrastar e soltar" para sites Next.js com backend (carrinho, login, etc.).

---

## Passo a Passo - Deploy no Render

### 1. Criar conta no Render
- Va em https://render.com
- Clique em "Get Started for Free"
- Crie conta com Google, GitHub ou email

### 2. Colocar seu projeto no GitHub
Se voce ainda nao colocou o projeto no GitHub, precisa fazer isso primeiro:

**Opcao A - Pelo site do GitHub (mais facil, sem comandos):**
1. Va em https://github.com/new
2. Nomeie o repositorio (ex: imperio-modas)
3. Deixe "Public" marcado
4. Clique "Create repository"
5. Na pagina que abrir, procure a opcao "uploading an existing file"
6. Clique nesse link
7. Arraste os arquivos do seu projeto (menos a pasta `node_modules` e o `.env.local`)
8. Clique em "Commit changes"

**Opcao B - Pelo terminal (se souber usar):**
```bash
git init
git add .
git commit -m "deploy"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/imperio-modas.git
git push -u origin main
```

### 3. Conectar no Render
1. No Render, clique em "New +"
2. Escolha "Web Service"
3. Conecte sua conta do GitHub
4. Escolha o repositorio que voce acabou de criar

### 4. Configurar o deploy
Preencha assim:

| Campo | Valor |
|-------|-------|
| Name | imperio-modas (ou o nome que quiser) |
| Region | Ohio (US East) ou a mais proxima |
| Branch | main |
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

### 5. Configurar variaveis de ambiente
Na mesma pagina, va em "Environment" e adicione:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
OPENAI_API_KEY=(deixe em branco se nao tiver)
```

### 6. Criar o servico
- Clique em "Create Web Service"
- O Render vai fazer o build sozinho (demora 3-5 minutos)
- Quando terminar, ele te da um link (ex: https://imperio-modas.onrender.com)

### 7. Testar
- Abra o link
- Faca um pedido de teste
- Va no Supabase e confirme se o pedido apareceu

---

## Se nao quiser usar GitHub

Se voce NAO quer usar GitHub de jeito nenhum, o Render nao e a melhor opcao. Neste caso, a sugestao e:

1. **Usar um VPS** (servidor virtual) como Contabo, Hetzner ou DigitalOcean
   - Voce aluga um servidor por ~R$ 20-30/mes
   - Faz upload dos arquivos via FTP (FileZilla)
   - E mais trabalhoso, mas nao precisa de GitHub

2. **Pedir ajuda para alguem**
   - Leva 10 minutos para quem sabe
   - Voce so precisa criar as contas (Render + GitHub)

---

## Precisa de ajuda?

Se travar em algum passo, me diga qual numero que eu te ajudo!

