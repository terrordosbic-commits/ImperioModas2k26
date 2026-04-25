'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Menu, Heart, User, Sun, Moon, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useCartAnimation } from '@/lib/cart-animation-context'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { getCurrentUser, logoutUser, type UserAccount } from '@/lib/user-auth'
import { useBusinessHours } from '@/hooks/use-business-hours'

const categories: Category[] = ['conjuntos', 'camisas', 'tenis', 'calcas', 'bermudas', 'vestidos', 'moletons', 'acessorios']

export function Header() {
  const router = useRouter()
  const { totalItems, setLoading } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { cartIconRef, flyingItems } = useCartAnimation()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserAccount | null>(null)
  const [bounceKey, setBounceKey] = useState(0)
  const prevTotalRef = useRef(totalItems)
  const { status, countdown } = useBusinessHours()

  // Bounce animation when cart items change
  useEffect(() => {
    if (totalItems > prevTotalRef.current && prevTotalRef.current >= 0) {
      setBounceKey((k) => k + 1)
    }
    prevTotalRef.current = totalItems
  }, [totalItems])

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    router?.refresh()
  }

  return (
    <>
    {/* Barra de horário de atendimento */}
    <div
      className={`w-full text-center text-xs font-medium py-1.5 ${
        status.isOpen
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      <div className="container mx-auto flex items-center justify-center gap-2 px-4">
        <Clock className="h-3 w-3" />
        {status.isOpen ? (
          <>
            <CheckCircle2 className="h-3 w-3" />
            <span>ABERTO — Fecha em {countdown}</span>
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3" />
            <span>FECHADO — Abre em {countdown}</span>
          </>
        )}
      </div>
    </div>

    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-primary">IMPÉRIO MODAS</span>
          <span className="text-xs text-muted-foreground">Moda com estilo e preço justo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/">
            <Button variant="ghost" size="sm">Início</Button>
          </Link>

          {categories.map((cat) => (
            <Link key={cat} href={`/categoria/${cat}`}>
              <Button variant="ghost" size="sm">
                {CATEGORY_LABELS[cat]}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Alternar tema"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Wishlist */}
          <Link href="/wishlist" className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Heart className="h-4 w-4" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Account */}
          {user ? (
            <Link href="/conta" className="hidden sm:flex">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="max-w-[80px] truncate">{user.nome.split(' ')[0]}</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:flex">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 1500)
            }}
          >
            <Link href="/carrinho" className="flex items-center gap-2">
              <div ref={cartIconRef}>
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline">Carrinho</span>

              {totalItems > 0 && (
                <span
                  key={bounceKey}
                  className="animate-bounce-badge absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-2">

                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Início
                  </Button>
                </Link>

                {categories.map((cat) => (
                  <Link key={cat} href={`/categoria/${cat}`} onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      {CATEGORY_LABELS[cat]}
                    </Button>
                  </Link>
                ))}

                <div className="my-2 border-t" />

                <Link href="/wishlist" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Heart className="h-4 w-4" />
                    Favoritos ({wishlistItems.length})
                  </Button>
                </Link>

                {user ? (
                  <>
                    <Link href="/conta" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <User className="h-4 w-4" />
                        Minha Conta
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={() => { handleLogout(); setIsOpen(false); }}>
                      Sair
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Entrar / Criar conta
                    </Button>
                  </Link>
                )}

                <div className="my-2 border-t" />

                <Link href="/carrinho" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className="w-full">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Ver Carrinho ({totalItems})
                  </Button>
                </Link>

              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>

    {/* Fly-to-cart overlay */}
    {flyingItems.map((item) => (
      <div
        key={item.id}
        className="animate-fly-to-cart pointer-events-none fixed z-[9999] h-12 w-12 overflow-hidden rounded-full shadow-lg"
        style={{
          left: item.startX - 24,
          top: item.startY - 24,
          backgroundImage: `url(${item.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transform: `translate(${item.endX - item.startX}px, ${item.endY - item.startY}px) scale(0.2)`,
        }}
      />
    ))}
    </>
  )
}
