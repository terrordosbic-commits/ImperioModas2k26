'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Product, CartItem } from './types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, delta: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = 'imperio-cart'

export function CartProvider({ children }: { children: ReactNode }) {
const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) {
        try {
          setItems(JSON.parse(stored))
        } catch {
          setItems([])
        }
      }
    } catch {
      // Safari modo privado pode lançar exceção ao acessar localStorage
      setItems([])
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items))
      } catch {
        // Safari modo privado pode lançar exceção ao gravar localStorage
      }
    }
  }, [items, mounted])

const addItem = (product: Product) => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, qtd: item.qtd + 1 } : item))
      }
      return [...current, { ...product, qtd: 1 }]
    })
  }

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, delta: number) => {
    setItems((current) => {
      return current
        .map((item) => {
          if (item.id !== id) return item
          const newQtd = item.qtd + delta
          if (newQtd <= 0) return null
          return { ...item, qtd: newQtd }
        })
        .filter((item): item is CartItem => item !== null)
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.qtd, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.preco * item.qtd, 0)

  return (
    <CartContext.Provider
    value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        setLoading: setIsLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
