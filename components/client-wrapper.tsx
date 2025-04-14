"use client"

import { SessionProvider } from "next-auth/react"
import { AppProvider } from "@/components/app-provider"
import type React from "react"

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5} refetchOnWindowFocus={true}>
      <AppProvider>{children}</AppProvider>
    </SessionProvider>
  )
}
