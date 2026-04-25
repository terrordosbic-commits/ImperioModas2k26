'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductGrid } from '@/components/product-grid'
import { CATEGORY_LABELS, type Category, type Product } from '@/lib/types'

interface CategoryTabsProps {
  products: Product[]
}

const categories: (Category | 'todos')[] = ['todos', 'conjuntos', 'camisas', 'tenis', 'calcas', 'bermudas', 'vestidos', 'moletons', 'acessorios']

export function CategoryTabs({ products }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('todos')

  const filteredProducts = activeTab === 'todos' ? products : products.filter((p) => p.cat === activeTab)

  return (
    <section id="produtos" className="container mx-auto px-3 md:px-4 py-8 md:py-12">
      <h2 className="mb-6 md:mb-8 text-center text-xl md:text-2xl font-bold lg:text-3xl">Nossos Produtos</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 md:mb-8 flex h-auto w-full flex-wrap justify-center gap-1.5 md:gap-2 bg-transparent">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="rounded-full border bg-background px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {cat === 'todos' ? 'Todos' : CATEGORY_LABELS[cat as Category]}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-0">
            <ProductGrid
              products={cat === 'todos' ? products : products.filter((p) => p.cat === cat)}
              emptyMessage={`Nenhum produto disponível em ${cat === 'todos' ? 'exibição' : CATEGORY_LABELS[cat as Category]}`}
            />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
