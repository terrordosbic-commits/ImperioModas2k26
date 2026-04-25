import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductGrid } from '@/components/product-grid'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getProductsByCategory } from '@/lib/data/products'
import { CATEGORY_LABELS, type Category } from '@/lib/types'

const validCategories: Category[] = ['conjuntos', 'camisas', 'tenis', 'calcas', 'bermudas', 'vestidos', 'moletons', 'acessorios']

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return validCategories.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = slug as Category

  if (!validCategories.includes(category)) {
    return { title: 'Categoria não encontrada' }
  }

  return {
    title: `${CATEGORY_LABELS[category]} | Império Modas`,
    description: `Veja nossa coleção de ${CATEGORY_LABELS[category].toLowerCase()} na Império Modas`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = slug as Category

  if (!validCategories.includes(category)) {
    notFound()
  }

  const categoryProducts = getProductsByCategory(category)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="mt-4 text-3xl font-bold">{CATEGORY_LABELS[category]}</h1>
            <p className="mt-2 text-muted-foreground">
              {categoryProducts.length} produto{categoryProducts.length !== 1 && 's'} disponíve
              {categoryProducts.length !== 1 ? 'is' : 'l'}
            </p>
          </div>

          <ProductGrid
            products={categoryProducts}
            emptyMessage={`Nenhum produto em ${CATEGORY_LABELS[category]} no momento`}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
