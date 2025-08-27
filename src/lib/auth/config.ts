import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db"

console.log("🔧 Auth Config Loading - NEXTAUTH_URL:", process.env.NEXTAUTH_URL)

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log("🔐 SignIn Callback:", { 
        user: user?.email, 
        account: account?.provider, 
        profile: profile?.email 
      })
      return true
    },
    jwt: async ({ token, user, account }) => {
      console.log("🎫 JWT Callback:", { 
        hasToken: !!token, 
        hasUser: !!user, 
        userEmail: user?.email,
        tokenSub: token?.sub 
      })
      if (user) {
        token.role = user.role || "USER"
      }
      return token
    },
    session: async ({ session, token }) => {
      console.log("👤 Session Callback:", { 
        hasSession: !!session, 
        hasToken: !!token,
        userEmail: session?.user?.email,
        tokenRole: token?.role 
      })
      if (session?.user && token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
    redirect: async ({ url, baseUrl }) => {
      console.log("🔄 Redirect Callback:", { url, baseUrl })
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
      },
    },
  },
}