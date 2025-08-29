import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"

interface UserStats {
  totalOrders: number
  totalSpent: number
  totalAddresses: number
}

interface Address {
  id: string
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

interface UserData {
  stats: UserStats
  recentOrders: any[]
  addresses: Address[]
  loading: boolean
  error: string | null
  refreshAddresses: () => Promise<void>
  addAddress: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateAddress: (id: string, address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  deleteAddress: (id: string) => Promise<void>
}

export function useUserData(): UserData {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    totalAddresses: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshAddresses = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/addresses')
      if (!response.ok) {
        throw new Error('Error al cargar direcciones')
      }
      const addressesData = await response.json()
      setAddresses(addressesData)
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalAddresses: addressesData.length
      }))
    } catch (err) {
      console.error('Error fetching addresses:', err)
      setError('Error al cargar direcciones')
    }
  }, [session?.user?.id])

  const addAddress = useCallback(async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la dirección')
      }

      await refreshAddresses()
    } catch (err) {
      console.error('Error adding address:', err)
      throw err
    }
  }, [refreshAddresses])

  const updateAddress = useCallback(async (id: string, addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar la dirección')
      }

      await refreshAddresses()
    } catch (err) {
      console.error('Error updating address:', err)
      throw err
    }
  }, [refreshAddresses])

  const deleteAddress = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar la dirección')
      }

      await refreshAddresses()
    } catch (err) {
      console.error('Error deleting address:', err)
      throw err
    }
  }, [refreshAddresses])

  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user?.id) {
        // Reset all user data when session is null (logout)
        setStats({ totalOrders: 0, totalSpent: 0, totalAddresses: 0 })
        setRecentOrders([])
        setAddresses([])
        setError(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch addresses
        await refreshAddresses()
        
        // TODO: Fetch real orders from API, using mock data for now
        const { mockOrders } = await import('@/lib/mock-data')
        const totalSpent = mockOrders.reduce((sum, order) => sum + order.total, 0)
        
        setStats(prev => ({
          ...prev,
          totalOrders: mockOrders.length,
          totalSpent: totalSpent
        }))
        setRecentOrders(mockOrders)
      } catch (err) {
        setError('Error al cargar datos del usuario')
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [session?.user?.id, refreshAddresses])

  return {
    stats,
    recentOrders,
    addresses,
    loading,
    error,
    refreshAddresses,
    addAddress,
    updateAddress,
    deleteAddress
  }
}