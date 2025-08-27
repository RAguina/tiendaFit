import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

interface UserStats {
  totalOrders: number
  totalSpent: number
  totalAddresses: number
}

interface UserData {
  stats: UserStats
  recentOrders: any[]
  addresses: any[]
  loading: boolean
  error: string | null
}

export function useUserData(): UserData {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    totalAddresses: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // TODO: Fetch real data from API
        // const [statsRes, ordersRes, addressesRes] = await Promise.all([
        //   fetch(`/api/users/${session.user.id}/stats`),
        //   fetch(`/api/users/${session.user.id}/orders?limit=5`),
        //   fetch(`/api/users/${session.user.id}/addresses`)
        // ])

        // For now, return mock data
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
        
        setStats({
          totalOrders: 0,
          totalSpent: 0,
          totalAddresses: 0
        })
        setRecentOrders([])
        setAddresses([])
      } catch (err) {
        setError('Error al cargar datos del usuario')
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [session?.user?.id])

  return {
    stats,
    recentOrders,
    addresses,
    loading,
    error
  }
}