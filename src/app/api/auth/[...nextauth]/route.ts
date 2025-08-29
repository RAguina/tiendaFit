import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/config"

export const runtime = "nodejs"

// Ensure NEXTAUTH_URL is set for production
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`
}

// Environment validation (without logging sensitive info)
if (process.env.NODE_ENV === 'development') {
  const requiredVars = ['NEXTAUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'DATABASE_URL']
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`)
  } else {
    console.log("✅ All required environment variables are set")
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }