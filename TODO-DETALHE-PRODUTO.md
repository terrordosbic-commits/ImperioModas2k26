# Plano de Implementação - Modal de Detalhes do Produto

## Problema Atual
- `components/product-detail-modal.tsx` existe mas está **incompleto** (faltam fechamentos de tags div)
- Modal não está integrado em nenhum card de produto
- Cards atualmente só abrem um zoom simples de imagem

## Informação Gathered
- `product-card.tsx`: Cards com fade-in, wishlist, add to cart. Usa Dialog do shadcn para zoom de imagem.
- `product-grid.tsx` e `product-sections.tsx`: Renderizam ProductCard
- `lib/types.ts`: Product tem `id, nome, cat, preco, img, descricao?, isBestSeller?, isNew?`
- O modal precisa ser responsivo, com animações, overlay escuro + blur

## Plano de Edição

### 1. `components/product-detail-modal.tsx` — REESCREVER
**Problema:** Código incompleto, tags div não fechadas corretamente.
**Ações:**
- Reescrever com estrutura HTML completa e válida
- Manter todas as funcionalidades: imagem com zoom hover, badges, nome, preço, descrição, categoria
- Botões: "Adicionar ao Carrinho" (com fly animation + login check) e "Adicionar à Wishlist"
- Animações: fade + scale no open/close, overlay com backdrop-blur
- Bloqueio de scroll no body quando aberto
- Responsivo: mobile (empilhado) e desktop (lado a lado)
- Fechar ao clicar fora ou no X

### 2. `components/product-card.tsx` — EDITAR
**Ações:**
- Adicionar estado `detailOpen` para controlar o modal
- Trocar o `onClick` da imagem (que abre zoom) para abrir o modal de detalhes
- Manter o botão de wishlist no card funcionando
- Renderizar `<ProductDetailModal>` no final do componente
- Passar o product e callbacks para o modal

### 3. `app/globals.css` — VERIFICAR/ADICIONAR
**Ações:**
- Garantir que animações de fade-in-up e keyframes necessários existam
- Adicionar animação de scale/fade para o modal se necessário

### 4. `lib/types.ts` — NÃO ALTERAR
- Tipos já estão corretos

## Dependências
- Nenhuma instalação nova necessária (usa shadcn/ui, lucide, tailwind já existentes)

## Testes Pós-Edição
- `pnpm tsc --noEmit` para validar TypeScript
- Verificar se cards abrem modal ao clicar
- Verificar se botões de carrinho e wishlist funcionam no modal
- Verificar responsividade mobile/desktop
