'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { useSession } from 'next-auth/react'

interface UseAddToCartOptions {
  successDuration?: number
  onSuccess?: () => void
  onError?: (error: Error) => void
  redirectToAuth?: boolean
}

export function useAddToCart(options: UseAddToCartOptions = {}) {
  const { 
    successDuration = 2000, 
    onSuccess, 
    onError,
    redirectToAuth = true 
  } = options

  const { addToCart } = useCart()
  const { data: session } = useSession()
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())
  const [successItems, setSuccessItems] = useState<Set<string>>(new Set())

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    if (!session) {
      if (redirectToAuth) {
        window.location.href = '/auth/signin'
      }
      return
    }

    try {
      // Set loading state
      setLoadingItems(prev => new Set(prev).add(productId))

      // Add to cart
      await addToCart(productId, quantity)

      // Set success state
      setSuccessItems(prev => new Set(prev).add(productId))
      
      // Call success callback
      onSuccess?.()

      // Clear success state after duration
      setTimeout(() => {
        setSuccessItems(prev => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
      }, successDuration)

    } catch (error) {
      console.error('Error adding to cart:', error)
      onError?.(error as Error)
    } finally {
      // Clear loading state
      setLoadingItems(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const isLoading = (productId: string) => loadingItems.has(productId)
  const isSuccess = (productId: string) => successItems.has(productId)

  return {
    handleAddToCart,
    isLoading,
    isSuccess,
    loadingItems: Array.from(loadingItems),
    successItems: Array.from(successItems)
  }
}