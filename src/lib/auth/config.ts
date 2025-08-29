import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db"
import { logger, securityLogger } from "@/lib/logger"

logger.log("Auth Config Loading")

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("🔐 SignIn Callback:", { 
          hasUser: !!user, 
          provider: account?.provider
        })
      }
      return true
    },
    // Note: signOut callback is not available in NextAuth v4
    // Session invalidation is handled automatically by NextAuth
    jwt: async ({ token, user, account }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("🎫 JWT Callback:", { 
          hasToken: !!token, 
          hasUser: !!user
        })
      }
      if (user) {
        token.role = user.role || "USER"
      }
      return token
    },
    session: async ({ session, token }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("👤 Session Callback:", { 
          hasSession: !!session, 
          hasToken: !!token
        })
      }
      if (session?.user && token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
    redirect: async ({ url, baseUrl }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("🔄 Redirect Callback:", { 
          urlType: url.startsWith("/") ? "relative" : "absolute",
          sameOrigin: new URL(url).origin === baseUrl
        })
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days - improved security
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Removing domain to avoid issues with subdomains/deployment URLs
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
}