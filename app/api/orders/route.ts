import { NextRequest, NextResponse } from 'next/server'
import { getOrders, createOrder } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { Customer, OrderItem } from '@/lib/types'

// GET /api/orders - Listar pedidos (apenas admin)
export async function GET() {
  const session = await getSession()

  if (!session || session.role !== 'admin') {
    return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 })
  }

  const orders = await getOrders()
  return NextResponse.json({
    ok: true,
    total: orders.length,
    orders: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  })
}

// POST /api/orders - Criar novo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, items, total } = body as {
      customer: Customer
      items: OrderItem[]
      total: number
    }

    // Validação
    const required: (keyof Customer)[] = ['cpf', 'nomeCompleto', 'endereco', 'rua', 'numeroCasa', 'referencia']
    const missing = required.some((k) => !customer?.[k]?.toString().trim())

    const cpfDigits = (customer?.cpf || '').replace(/\D/g, '')

    if (missing) {
      return NextResponse.json({ ok: false, error: 'Preencha todos os campos obrigatórios' }, { status: 400 })
    }

    if (cpfDigits.length !== 11) {
      return NextResponse.json({ ok: false, error: 'CPF inválido' }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Adicione itens ao pedido' }, { status: 400 })
    }

    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ ok: false, error: 'Total inválido' }, { status: 400 })
    }

    const order = await createOrder({ customer, items, total })

    return NextResponse.json({ ok: true, order }, { status: 201 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Erro ao processar pedido' }, { status: 500 })
  }
}
