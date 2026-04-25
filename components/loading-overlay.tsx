'use client'

import { useCart } from '@/lib/cart-context'

export function LoadingOverlay() {
  const { isLoading } = useCart()

  if (!isLoading) return null

  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center" />
      <div className="fixed inset-0 z-[1001] flex items-center justify-center">
        <div className="bg-background rounded-2xl p-8 shadow-2xl border flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="text-lg font-semibold text-primary">Adicionando ao carrinho...</div>
        </div>
      </div>
    </>
  )
}

