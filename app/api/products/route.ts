import { NextRequest, NextResponse } from 'next/server'
import { products, getProductsByCategory } from '@/lib/data/products'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  let filtered = category ? getProductsByCategory(category) : [...products]

  if (search) {
    const term = search.toLowerCase()
    filtered = filtered.filter(
      (p) => p.nome.toLowerCase().includes(term) || p.descricao?.toLowerCase().includes(term)
    )
  }

  return NextResponse.json({
    ok: true,
    total: filtered.length,
    products: filtered,
  })
}
