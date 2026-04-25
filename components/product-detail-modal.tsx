'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, Heart, X, Package, Star, Tag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useCartAnimation } from '@/lib/cart-animation-context'
import { isUserLoggedIn } from '@/lib/user-auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CATEGORY_LABELS, type Product } from '@/lib/types'
import { toast } from 'sonner'
import { LoginModal } from './login-modal'

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const { addItem, items } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { triggerFly } = useCartAnimation()
  const [loginOpen, setLoginOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [imageHover, setImageHover] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onOpenChange(false)
    }, 250)
  }

  const handleAddToCart = () => {
    if (!product) return
    if (!isUserLoggedIn()) {
      setLoginOpen(true)
      return
    }
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      triggerFly(product.img || '', rect)
    }
    addItem(product)
    toast.success(product.nome + ' adicionado à sacola')
  }

  const handleWishlist = () => {
    if (!product) return
    toggleWishlist(product)
    const liked = isInWishlist(product.id)
    toast.success(liked ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
  }

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (!product) return null

  const liked = isInWishlist(product.id)
  const cartItem = items.find((item) => item.id === product.id)
  const currentQty = cartItem?.qtd || 0

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-50 transition-all duration-300',
          open && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />
        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className={[
              'relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-card transition-all duration-300',
              open && !isClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4',
            ].join(' ')}
          >
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 hover:scale-110"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col md:flex-row max-h-[90vh]">
              {/* Image Section */}
              <div
                ref={imageRef}
                className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[500px] overflow-hidden bg-muted group cursor-zoom-in"
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
              >
                {product.img ? (
                  <Image
                    src={product.img}
                    alt={product.nome}
                    fill
                    className={[
                      'object-cover transition-transform duration-500',
                      imageHover ? 'scale-110' : 'scale-100',
                    ].join(' ')}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted text-muted-foreground">
                    <Package className="h-16 w-16 opacity-50" />
                    <span className="text-sm">Imagem em breve</span>
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    {CATEGORY_LABELS[product.cat]}
                  </Badge>
                </div>
                <div className="absolute left-3 top-10 flex flex-col gap-1">
                  {product.isNew && (
                    <Badge className="bg-blue-500 text-white hover:bg-blue-600">Novo</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge className="bg-orange-500 text-white hover:bg-orange-600">Top</Badge>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="flex flex-1 flex-col overflow-y-auto p-5 md:p-8">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  <span>{CATEGORY_LABELS[product.cat]}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
                  {product.nome}
                </h2>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.preco)}
                  </span>
                </div>

                <Separator className="my-4" />

                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Descrição
                  </h3>
                  <div className="description-effect p-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {product.descricao || 'Produto de alta qualidade da Império Modas. Conforto e estilo para o seu pequeno.'}
                    </p>
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Produto de qualidade premium</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4 text-primary" />
                    <span>Categoria: {CATEGORY_LABELS[product.cat]}</span>
                  </div>
                  {currentQty > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <ShoppingBag className="h-4 w-4" />
                      <span>{currentQty} no carrinho</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-3 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                    size="lg"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Adicionar ao Carrinho
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleWishlist}
                    className={[
                      'w-full h-12 text-base transition-all hover:scale-[1.02] active:scale-[0.98]',
                      liked ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/20' : '',
                    ].join(' ')}
                    size="lg"
                  >
                    <Heart className={liked ? 'mr-2 h-5 w-5 fill-red-500 text-red-500' : 'mr-2 h-5 w-5'} />
                    {liked ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
}

