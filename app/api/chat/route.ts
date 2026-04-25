import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage, BotConfig } from '@/lib/types'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const DEFAULT_SYSTEM_PROMPT = `Você é o assistente virtual da Império Modas, uma loja de moda infantil em Lages - SC.

INFORMAÇÕES DA LOJA:
- Nome: Império Modas
- Localização: Lages - SC
- WhatsApp: (49) 99988-2363
- Produtos: conjuntos, camisetas, tênis, calças, bermudas, vestidos, moletons e acessórios infantis
- Preços por categoria: Conjuntos R$120, Camisetas R$50, Tênis R$100, Calças R$80, Bermudas R$70, Vestidos R$100, Moletons R$120, Acessórios R$40
- Entrega: Lages e região
- Forma de pagamento: via WhatsApp (pedido manual)

REGRAS:
- Seja prestativo, claro e direto
- Sobre produtos: informe preço e tamanhos disponíveis
- Sobre entrega: informe que fazemos entrega em Lages e região via motoboy
- Sobre trocas: aceitamos trocas em até 7 dias com etiqueta
- Se não souber algo, sugira falar pelo WhatsApp (49) 99988-2363
- Responda em português do Brasil`

function getToneModifier(tone: BotConfig['tone']): string {
  switch (tone) {
    case 'formal':
      return 'Use linguagem formal, educada e profissional. Evite gírias e expressões coloquiais.'
    case 'salesy':
      return 'Use linguagem de vendedor entusiasmado. Destaque promoções, qualidade e urge a compra de forma sutil. Use emojis ocasionalmente.'
    case 'friendly':
    default:
      return 'Use linguagem amigável, acolhedora e informal. Seja como um amigo que entende de moda infantil.'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, config }: { messages: ChatMessage[]; config?: BotConfig } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 })
    }

    // Se não houver OPENAI_API_KEY, retorna fallback
    if (!OPENAI_API_KEY) {
      console.log('[Chat] OPENAI_API_KEY não configurada, usando resposta fallback')
      return NextResponse.json({
        reply: config?.fallbackMessage ||
          'Olá! No momento nosso assistente virtual está em manutenção. Entre em contato pelo WhatsApp (49) 99988-2363 para tirar suas dúvidas.',
        fallback: true,
      })
    }

    const systemPrompt = config?.systemPrompt || DEFAULT_SYSTEM_PROMPT
    const toneModifier = getToneModifier(config?.tone || 'friendly')

    const fullSystemPrompt = `${systemPrompt}\n\nTOM DE VOZ:\n${toneModifier}`

    const apiMessages = [
      { role: 'system', content: fullSystemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Chat] Erro OpenAI:', errorText)
      return NextResponse.json({
        reply: config?.fallbackMessage ||
          'Desculpe, estou com dificuldades técnicas no momento. Por favor, entre em contato pelo WhatsApp (49) 99988-2363.',
        fallback: true,
      })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return NextResponse.json({
        reply: config?.fallbackMessage ||
          'Desculpe, não consegui processar sua mensagem. Tente novamente ou fale pelo WhatsApp (49) 99988-2363.',
        fallback: true,
      })
    }

    return NextResponse.json({ reply, fallback: false })
  } catch (error) {
    console.error('[Chat] Erro:', error)
    return NextResponse.json({
      reply: 'Desculpe, ocorreu um erro. Tente novamente mais tarde ou fale pelo WhatsApp (49) 99988-2363.',
      fallback: true,
    }, { status: 500 })
  }
}

