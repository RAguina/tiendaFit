"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import AccountSidebar from "@/components/account/account-sidebar"
import ProfileSection from "@/components/account/profile-section"
import OrdersSection from "@/components/account/orders-section"
import AddressesSection from "@/components/account/addresses-section"
import SettingsSection from "@/components/account/settings-section"

function AccountContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Derive state from URL - no useState needed
  const activeSection = (() => {
    const section = searchParams.get('section')
    if (section && ['profile', 'orders', 'addresses', 'settings'].includes(section)) {
      return section
    }
    return 'profile'
  })()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  const handleSectionChange = (section: string) => {
    // Update URL using Next.js router - this will trigger re-render automatically
    const params = new URLSearchParams(searchParams.toString())
    params.set('section', section)
    router.replace(`/account?${params.toString()}`)
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
        return <SettingsSection />
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