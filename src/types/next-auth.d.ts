import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN"
  }
  
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
}