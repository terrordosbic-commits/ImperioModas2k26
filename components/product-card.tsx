'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ShoppingBag, Package, Heart, ZoomIn } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useCartAnimation } from '@/lib/cart-animation-context'
import { isUserLoggedIn } from '@/lib/user-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_LABELS, type Product } from '@/lib/types'
import { toast } from 'sonner'
import { LoginModal } from './login-modal'
import { ProductDetailModal } from './product-detail-modal'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, items } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { triggerFly } = useCartAnimation()
  const [detailOpen, setDetailOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Fade-in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const cartItem = items.find((item) => item.id === product.id)
  const currentQty = cartItem?.qtd || 0
  const liked = isInWishlist(product.id)
  const description =
    product.descricao || 'Peça infantil com acabamento caprichado, conforto no uso e visual pensado para destacar o look.'

  const handleAdd = () => {
    if (!isUserLoggedIn()) {
      setLoginOpen(true)
      return
    }
    // Trigger fly-to-cart animation
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      triggerFly(product.img || '', rect)
    }
    addItem(product)
    toast.success(`${product.nome} adicionado à sacola`)
  }

  const handleWishlist = () => {
    toggleWishlist(product)
    toast.success(liked ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
  }

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <>
      <Card
        ref={cardRef}
        className={`group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}
        style={{ animationDelay: `${(index % 8) * 80}ms` }}
      >
        {/* Image */}
        <div ref={imageRef} className="relative aspect-square overflow-hidden bg-muted">
          {product.img ? (
            <Image
              src={product.img}
              alt={product.nome}
              fill
              className="cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onClick={() => setDetailOpen(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
              <Package className="h-12 w-12" />
              <span className="text-xs">Imagem em breve</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            <Badge variant="secondary">{CATEGORY_LABELS[product.cat]}</Badge>
            {product.isNew && <Badge className="bg-blue-500 text-white hover:bg-blue-600">Novo</Badge>}
            {product.isBestSeller && <Badge className="bg-orange-500 text-white hover:bg-orange-600">Top</Badge>}
          </div>



          {/* Zoom hint */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleWishlist()
            }}
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sm shadow-md backdrop-blur transition-colors hover:bg-white dark:bg-black/70 dark:hover:bg-black"
            aria-label={liked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </button>
        </div>


        <CardContent className="flex flex-1 flex-col p-2 md:p-4">
          <h3 className="line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] font-medium leading-tight text-xs md:text-base">{product.nome}</h3>
          <div className="hidden md:block description-effect mt-2 md:mt-3 p-2 md:p-3">
            <p className="line-clamp-3 text-xs md:text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          <div className="mt-auto pt-1.5 md:pt-3">
            <span className="text-sm md:text-lg font-bold text-primary">{formatPrice(product.preco)}</span>
          </div>
        </CardContent>

        <CardFooter className="p-2 pt-0 md:p-4 md:pt-0">
          <Button onClick={handleAdd} className="w-full" size="sm">
            <ShoppingBag className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm">Adicionar</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal product={product} open={detailOpen} onOpenChange={setDetailOpen} />

      {/* Login Modal */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
}
