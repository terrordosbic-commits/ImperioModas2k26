'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { XCircle, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Pagamento Recusado</CardTitle>
          <CardDescription className="text-base">
            Houve um problema com seu pagamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Número do Pedido</p>
              <p className="font-mono text-lg font-semibold">{orderId}</p>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>O pagamento não foi aprovado.</p>
            <p>Verifique os dados do cartão ou tente outra forma de pagamento.</p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button asChild>
              <Link href="/carrinho">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar para a Loja
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
