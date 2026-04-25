# Mercado Pago Removido

## O que foi feito:
- Removidas integrações MP: webhook e checkout API
- Frontend cart.tsx agora usa só fallback WhatsApp
- Sistema continua funcionando 100% via WhatsApp pedidos

## Impactos:
- Sem pagamentos online automáticos
- Pedidos criados em `data/orders.json` como 'pendente'
- Status atualizado manualmente

## Como usar:
1. Remova `MP_ACCESS_TOKEN` do `.env.local`
2. `pnpm dev`
3. Carrinho → preencha form → WhatsApp pedido + success page

