"use client"

import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<{
    hasSession: boolean
    userEmail?: string
    userRole?: string
  } | null>(null)
  const router = useRouter()

  useEffect(() => {
    console.log("🔧 NextAuth URLs:", {
      clientOrigin: typeof window !== 'undefined' ? window.location.origin : 'server-side',
      note: 'NEXTAUTH_URL is server-side only, not visible in client'
    })
    
    getSession().then(session => {
      console.log("🔍 Current session:", session)
      setDebugInfo({ 
        hasSession: !!session,
        userEmail: session?.user?.email || undefined,
        userRole: session?.user?.role || undefined 
      })
      if (session) {
        router.push("/")
      }
    }).catch(error => {
      console.error("❌ Error getting session:", error)
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    console.log("🚀 Starting Google sign in...")
    console.log("🔧 Current URL:", window.location.href)
    console.log("🔧 Current origin:", window.location.origin)
    setLoading(true)
    
    try {
      const result = await signIn("google", { 
        callbackUrl: "/",
        redirect: false
      })
      console.log("🎯 SignIn result:", result)
      console.log("🎯 SignIn result type:", typeof result)
      console.log("🎯 SignIn result keys:", result ? Object.keys(result) : 'null')
      
      // Wait a moment and check session again
      setTimeout(async () => {
        const newSession = await getSession()
        console.log("🔄 Session after sign in:", newSession)
      }, 1000)
      
    } catch (error) {
      console.error("❌ SignIn error:", error)
      console.error("❌ Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : typeof error
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a TiendaFit con tu cuenta de Google
          </p>
        </div>
        <div>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Conectando..." : "Continuar con Google"}
          </button>
          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md text-xs">
              <strong>Debug Info:</strong>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}