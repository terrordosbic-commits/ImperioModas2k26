'use client'

import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from 'react'

interface FlyItem {
  id: string
  img: string
  startX: number
  startY: number
  endX: number
  endY: number
}

interface CartAnimationContextType {
  cartIconRef: React.RefObject<HTMLDivElement | null>
  flyingItems: FlyItem[]
  triggerFly: (img: string, startRect: DOMRect) => void
  removeFlyItem: (id: string) => void
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined)

export function CartAnimationProvider({ children }: { children: ReactNode }) {
  const cartIconRef = useRef<HTMLDivElement>(null)
  const [flyingItems, setFlyingItems] = useState<FlyItem[]>([])

  const triggerFly = useCallback((img: string, startRect: DOMRect) => {
    const cartRect = cartIconRef.current?.getBoundingClientRect()
    if (!cartRect) return

    const id = Math.random().toString(36).slice(2)
    const item: FlyItem = {
      id,
      img,
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
    }

    setFlyingItems((prev) => [...prev, item])

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((i) => i.id !== id))
    }, 850)
  }, [])

  const removeFlyItem = useCallback((id: string) => {
    setFlyingItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  return (
    <CartAnimationContext.Provider value={{ cartIconRef, flyingItems, triggerFly, removeFlyItem }}>
      {children}
    </CartAnimationContext.Provider>
  )
}

export function useCartAnimation() {
  const context = useContext(CartAnimationContext)
  if (!context) {
    throw new Error('useCartAnimation must be used within CartAnimationProvider')
  }
  return context
}

