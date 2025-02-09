"use client"

import { SessionProvider } from "next-auth/react"
import { AppProvider } from "@/components/app-provider"
import type React from "react" // Added import for React

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppProvider>{children}</AppProvider>
    </SessionProvider>
  )
}

