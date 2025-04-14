import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { Toaster } from "@/components/ui/toaster"
import ClientWrapper from "@/components/client-wrapper"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TeamCollaboration Platform",
  description: "Manage projects and collaborate with your team efficiently",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientWrapper>
            <div className="flex flex-col h-screen lg:flex-row">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4">{children}</main>
              </div>
              <RightSidebar />
            </div>
            <Toaster />
          </ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'