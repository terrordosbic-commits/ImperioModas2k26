'use client'

import Link from 'next/link'
import { Heart, ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Image from 'next/image'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = (product: typeof items[0]) => {
    addItem(product)
    toast.success(`${product.nome} adicionado à sacola`)
  }

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Meus Favoritos</h1>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">Sua lista de desejos está vazia</h2>
              <p className="mb-6 text-muted-foreground">Adicione produtos aos favoritos para vê-los aqui</p>
              <Link href="/">
                <Button>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Ver Produtos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative aspect-square bg-muted">
                    {product.img ? (
                      <Image src={product.img} alt={product.nome} fill className="object-cover" sizes="300px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="line-clamp-2 font-medium">{product.nome}</h3>
                    <p className="mt-1 text-lg font-bold text-primary">{formatPrice(product.preco)}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => handleAddToCart(product)}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Comprar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

