'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Clock, Home, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

function PendingContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl text-yellow-600">Pagamento Pendente</CardTitle>
          <CardDescription className="text-base">
            Aguardando confirmação do pagamento
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
            <p>Se você pagou via Pix ou boleto, aguarde a confirmação.</p>
            <p>Assim que o pagamento for aprovado, você será notificado.</p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Voltar para a Loja
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/pedido/acompanhar?id=${orderId}`}>
                <Package className="mr-2 h-4 w-4" />
                Acompanhar Pedido
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    }>
      <PendingContent />
    </Suspense>
  )
}
