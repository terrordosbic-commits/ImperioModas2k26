import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORY_PRICES } from '@/lib/types'

export function Hero() {
  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-8 md:py-20">
      <div className="container mx-auto px-3 md:px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs md:px-4 md:py-1.5 md:text-sm backdrop-blur">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span>Novidades toda semana</span>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Qualidade, Estilo e Conforto na{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Império Modas
            </span>
          </h1>

          <p className="mx-auto mt-4 md:mt-6 max-w-2xl text-pretty text-base md:text-lg text-muted-foreground">
            Moda infantil com preço justo. Entrega em Lages e região.
          </p>

          {/* Price Tags */}
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-medium">
              Conjuntos {formatPrice(CATEGORY_PRICES.conjuntos)}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-medium">
              Camisas {formatPrice(CATEGORY_PRICES.camisas)}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-medium">
              Tênis {formatPrice(CATEGORY_PRICES.tenis)}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-medium">
              Calças {formatPrice(CATEGORY_PRICES.calcas)}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-medium">
              Bermudas {formatPrice(CATEGORY_PRICES.bermudas)}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm font-medium">
              Acessórios {formatPrice(CATEGORY_PRICES.acessorios)}
            </span>
          </div>

          <div className="mt-8 md:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/#produtos">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Ver Produtos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://wa.me/554999882363" target="_blank">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </section>
  )
}
