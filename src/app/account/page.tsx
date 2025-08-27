"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import AccountSidebar from "@/components/account/account-sidebar"
import ProfileSection from "@/components/account/profile-section"
import OrdersSection from "@/components/account/orders-section"
import AddressesSection from "@/components/account/addresses-section"

function AccountContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('profile')

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  useEffect(() => {
    // Get section from URL hash instead of searchParams to avoid Suspense issues
    const hash = window.location.hash.slice(1)
    if (hash && ['profile', 'orders', 'addresses', 'settings'].includes(hash)) {
      setActiveSection(hash)
    }
    
    // Also check for query params for backward compatibility
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get('section')
    if (section && ['profile', 'orders', 'addresses', 'settings'].includes(section)) {
      setActiveSection(section)
    }
  }, [])

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    // Update URL without causing a page refresh
    const url = new URL(window.location.href)
    url.searchParams.set('section', section)
    window.history.replaceState({}, '', url.toString())
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Cargando tu cuenta...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />
      case 'orders':
        return <OrdersSection />
      case 'addresses':
        return <AddressesSection />
      case 'settings':
        return (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Configuración
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">⚙️</div>
                <p className="text-gray-600">
                  Esta sección estará disponible próximamente.
                </p>
              </div>
            </div>
          </div>
        )
      default:
        return <ProfileSection />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full ring-4 ring-blue-100"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Mi Cuenta
                </h1>
                <p className="text-gray-600 mt-1">
                  Bienvenido de vuelta, {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <AccountSidebar 
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Cargando tu cuenta...</div>
        </div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  )
}