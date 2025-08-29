"use client"

import { SessionProvider } from "next-auth/react"

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={5} // Check session every 5 seconds during logout debugging
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}