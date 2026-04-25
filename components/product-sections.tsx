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
    <section className="container mx-auto px-3 md:px-4 py-6 md:py-8">
      {/* Mais Vendidos */}
      {bestSellers.length > 0 && (
        <div className="mb-8 md:mb-12">
          <div className="mb-4 md:mb-6 flex items-center gap-3">
            <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
            <h2 className="text-xl md:text-2xl font-bold lg:text-3xl">Mais Vendidos</h2>
          </div>
          <ProductGrid products={bestSellers} emptyMessage="Nenhum produto em destaque" />
        </div>
      )}

      {/* Novidades */}
      {newArrivals.length > 0 && (
        <div className="mb-8 md:mb-12">
          <div className="mb-4 md:mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-bold lg:text-3xl">Novidades</h2>
          </div>
          <ProductGrid products={newArrivals} emptyMessage="Nenhuma novidade no momento" />
        </div>
      )}
    </section>
  )
}

