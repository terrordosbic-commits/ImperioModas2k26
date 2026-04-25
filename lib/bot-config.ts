// Configuração do agente IA (localStorage)

import type { BotConfig, ChatSession } from './types'

const BOT_CONFIG_KEY = 'imperio-bot-config'
const CHAT_HISTORY_KEY = 'imperio-chat-history'

export const DEFAULT_BOT_CONFIG: BotConfig = {
  enabled: true,
  tone: 'friendly',
  systemPrompt: `Você é o assistente virtual da Império Modas, uma loja de moda infantil em Lages - SC.

INFORMAÇÕES DA LOJA:
- Nome: Império Modas
- Localização: Lages - SC
- WhatsApp: (49) 99988-2363
- Produtos: conjuntos, camisetas, tênis, calças, bermudas, vestidos, moletons e acessórios infantis
- Preços: Conjuntos R$120, Camisetas R$50, Tênis R$100, Calças R$80, Bermudas R$70, Vestidos R$100, Moletons R$120, Acessórios R$40
- Entrega: Lages e região via motoboy
- Pagamento: pedido via WhatsApp
- Trocas: até 7 dias com etiqueta

REGRAS:
- Seja prestativo, claro e direto
- Responda em português do Brasil
- Se não souber algo, sugira falar pelo WhatsApp (49) 99988-2363`,
  fallbackMessage: 'Olá! No momento estou com dificuldades técnicas. Entre em contato pelo WhatsApp (49) 99988-2363.',
  maxHistory: 10,
}

export function getBotConfig(): BotConfig {
  if (typeof window === 'undefined') return DEFAULT_BOT_CONFIG
  const stored = localStorage.getItem(BOT_CONFIG_KEY)
  if (!stored) return DEFAULT_BOT_CONFIG
  try {
    return { ...DEFAULT_BOT_CONFIG, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_BOT_CONFIG
  }
}

export function saveBotConfig(config: Partial<BotConfig>): void {
  if (typeof window === 'undefined') return
  const current = getBotConfig()
  localStorage.setItem(BOT_CONFIG_KEY, JSON.stringify({ ...current, ...config }))
}

export function getChatHistory(): ChatSession[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(CHAT_HISTORY_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveChatSession(session: ChatSession): void {
  if (typeof window === 'undefined') return
  const history = getChatHistory()
  const index = history.findIndex((s) => s.id === session.id)
  if (index >= 0) {
    history[index] = session
  } else {
    history.push(session)
  }
  // Manter apenas últimas 50 sessões
  if (history.length > 50) history.shift()
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history))
}

export function clearChatHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CHAT_HISTORY_KEY)
}

