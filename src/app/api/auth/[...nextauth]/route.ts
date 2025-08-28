import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/config"

export const runtime = "nodejs"

// Ensure NEXTAUTH_URL is set for production
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`
}

// Debug environment variables (dev only)
if (process.env.NODE_ENV === 'development') {
  console.log("🔧 NextAuth Environment Debug:")
  console.log({
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing",
    DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
    NODE_ENV: process.env.NODE_ENV,
  })
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }