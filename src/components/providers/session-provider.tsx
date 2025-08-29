"use client"

import { SessionProvider } from "next-auth/react"

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={0} // Disable polling
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}