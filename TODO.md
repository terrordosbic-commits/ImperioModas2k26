# Plano de Implementação - Layout, Auth e Agente IA

## 1. Ajuste de Layout (Cards de Produto)
- [x] Padronizar tamanho dos cards com `h-full flex flex-col`
- [x] Garantir mesma altura entre cards
- [x] Ajustar botões com tamanhos iguais
- [x] Melhorar espaçamento e alinhamento

## 2. Bloqueio de Compra sem Login
- [x] Criar modal de login reutilizável (`components/login-modal.tsx`)
- [x] Verificar login no `ProductCard` antes de add to cart
- [x] Verificar login no `Cart` antes de finalizar compra

## 3. Agente de IA (OpenAI API)
- [x] Criar `app/api/chat/route.ts` (integração real com OpenAI)
- [x] Criar `lib/chat-context.tsx` (estado global + memória)
- [x] Criar `lib/bot-config.ts` (configuração com localStorage)
- [x] Atualizar `components/chat-support.tsx` (chat real com IA)

## 4. Memória de Conversa
- [x] Histórico por sessão no localStorage
- [x] Enviar últimas N mensagens para contexto

## 5. Painel Admin do Bot
- [x] Adicionar aba no admin dashboard
- [x] Configurar tom, system prompt, fallback
- [x] Ativar/desativar bot
- [x] Ver histórico de conversas

## 6. Checkout WhatsApp
- [x] Criar `lib/whatsapp-checkout.ts` (link wa.me)
- [x] Modal de confirmação no carrinho
- [x] Redirecionamento para WhatsApp com pedido formatado
- [x] Responsividade mobile/tablet/desktop

## Animações Visuais
- [x] Fade-in ao carregar produtos (IntersectionObserver + stagger)
- [x] Slide lateral do carrinho (Sheet drawer)
- [x] Badge do carrinho com efeito de pulo (CSS bounce)
- [x] Animação "fly to cart" (imagem do produto voando até o ícone)
- [x] Resposta da IA com efeito typing (caractere por caractere)

## Sons e Vibração no Chat
- [x] Sistema de sons com Web Audio API (sem arquivos externos)
- [x] Som de digitação ao pressionar teclas no input
- [x] Som de envio ao enviar mensagem
- [x] Som de recebimento ao chegar resposta da IA
- [x] Som de digitação da IA (loop durante loading)
- [x] Vibração ao enviar mensagem (navigator.vibrate)
- [x] Vibração ao receber resposta da IA

## Horário de Atendimento
- [x] Card com status ABERTO/FECHADO em tempo real
- [x] Contador dinâmico até abrir ou fechar
- [x] Grade semanal completa com destaque no dia atual
- [x] Animação pulse no status e fade-in no card
- [x] Integrado no footer

## Validação
- [x] TypeScript sem erros (`tsc --noEmit`)

