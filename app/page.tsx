import { Hero } from '@/components/hero'
import { ProductSections } from '@/components/product-sections'
import { CategoryTabs } from '@/components/category-tabs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { products } from '@/lib/data/products'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProductSections products={products} />
        <CategoryTabs products={products} />
      </main>
      <Footer />
    </div>
  )
}
