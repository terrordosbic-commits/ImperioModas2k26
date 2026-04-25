'use client'

import { Flame, Sparkles } from 'lucide-react'
import { ProductGrid } from './product-grid'
import type { Product } from '@/lib/types'

interface ProductSectionsProps {
  products: Product[]
}

export function ProductSections({ products }: ProductSectionsProps) {
  const bestSellers = products.filter((p) => p.isBestSeller)
  const newArrivals = products.filter((p) => p.isNew)

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Mais Vendidos */}
      {bestSellers.length > 0 && (
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <Flame className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold md:text-3xl">Mais Vendidos</h2>
          </div>
          <ProductGrid products={bestSellers} emptyMessage="Nenhum produto em destaque" />
        </div>
      )}

      {/* Novidades */}
      {newArrivals.length > 0 && (
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold md:text-3xl">Novidades</h2>
          </div>
          <ProductGrid products={newArrivals} emptyMessage="Nenhuma novidade no momento" />
        </div>
      )}
    </section>
  )
}

