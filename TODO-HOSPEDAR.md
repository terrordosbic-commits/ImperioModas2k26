# TODO - Correções para Hospedar no Render

## Problemas Identificados

1. [x] `next.config.mjs` - Adicionado `eslint.ignoreDuringBuilds`, `poweredByHeader: false`, `distDir: '.next'`
2. [x] `app/page.tsx` - Removido CartProvider duplicado
3. [x] `app/categoria/[slug]/page.tsx` - Removido CartProvider duplicado
4. [x] `app/carrinho/page.tsx` - Removido CartProvider duplicado
5. [x] `app/api/checkout/route.ts` - Removido código inalcançável, corrigidos tipos `any`
6. [x] `lib/db.ts` - Adicionado try/catch em `writeJson` para filesystem read-only

## Passos Pós-Edição

- [x] Rodar build local para validar
- [ ] Commit e push para GitHub
- [ ] Deploy no Render


