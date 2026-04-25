import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { OrderStatus } from '@/lib/types'

// GET /api/orders/[id] - Buscar pedido por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()

  if (!session || session.role !== 'admin') {
    return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 })
  }

  const order = await getOrderById(parseInt(id))

  if (!order) {
    return NextResponse.json({ ok: false, error: 'Pedido não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, order })
}

// PATCH /api/orders/[id] - Atualizar status do pedido
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()

  if (!session || session.role !== 'admin') {
    return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status } = body as { status: OrderStatus }

    const validStatuses: OrderStatus[] = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ ok: false, error: 'Status inválido' }, { status: 400 })
    }

    const order = await updateOrderStatus(parseInt(id), status)

    if (!order) {
      return NextResponse.json({ ok: false, error: 'Pedido não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, order })
  } catch {
    return NextResponse.json({ ok: false, error: 'Erro ao atualizar pedido' }, { status: 500 })
  }
}
