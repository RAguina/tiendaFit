'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  createdAt: Date
  updatedAt: Date
  product: {
    id: string
    name: string
    price: number
    image: string
    stock: number
    isActive: boolean
  }
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalPrice: () => number
  getTotalItems: () => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()

  // Fetch cart from server when user is authenticated
  const refreshCart = async () => {
    if (status !== 'authenticated') {
      setItems([])
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      } else if (response.status === 401) {
        // User not authenticated
        setItems([])
      } else {
        console.error('Failed to fetch cart')
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load cart when session changes
  useEffect(() => {
    refreshCart()
  }, [status])

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (status !== 'authenticated') {
      throw new Error('You must be logged in to add items to cart')
    }

    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity
        }),
      })

      if (response.ok) {
        await refreshCart() // Refresh cart to get updated data
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add item to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (status !== 'authenticated') {
      throw new Error('You must be logged in to update cart')
    }

    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity
        }),
      })

      if (response.ok) {
        await refreshCart() // Refresh cart to get updated data
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update cart')
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    await updateQuantity(productId, 0) // Setting quantity to 0 removes the item
  }

  const clearCart = async () => {
    if (status !== 'authenticated') {
      throw new Error('You must be logged in to clear cart')
    }

    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setItems([])
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => 
      total + (Number(item.product.price) * item.quantity), 0
    )
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Legacy compatibility - for components not yet migrated
export interface LegacyCartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

// Helper function to convert server cart items to legacy format if needed
export function convertToLegacyFormat(items: CartItem[]): LegacyCartItem[] {
  return items.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image || '',
    quantity: item.quantity
  }))
}