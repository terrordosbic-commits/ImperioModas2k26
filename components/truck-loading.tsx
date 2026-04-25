'use client'

import { useCart } from '@/lib/cart-context'

export function TruckLoading() {
  const { isLoading } = useCart()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="loader">
        {/* sua animação aqui */}
        🚚 Carregando...
      </div>
    </div>
  )
}