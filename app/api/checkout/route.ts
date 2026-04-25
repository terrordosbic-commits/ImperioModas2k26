import { NextRequest, NextResponse } from 'next/server'
import type { CartItem, Customer } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customer } = body as {
      items: CartItem[]
      customer: Customer
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
    }

    // Pagamento online removido — fallback via WhatsApp no frontend
    return NextResponse.json(
      {
        success: false,
        error: 'Pagamento online indisponível no momento. Usando WhatsApp.',
      },
      { status: 503 }
    )
  } catch (error) {
    console.error('Erro no checkout:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
