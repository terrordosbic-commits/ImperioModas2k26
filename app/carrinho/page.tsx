import { Cart } from '@/components/cart'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Carrinho | Império Modas',
  description: 'Finalize seu pedido na Império Modas',
}

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Cart />
      </main>
      <Footer />
    </div>
  )
}
