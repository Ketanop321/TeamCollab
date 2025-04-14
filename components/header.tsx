"use client"

import { Search, Settings, Menu, User, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "./mode-toggle"
import { Notifications } from "./notifications"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export default function Header() {
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })

      // Force a hard navigation to ensure session is properly updated
      window.location.href = "/login"
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => document.querySelector("aside")?.classList.toggle("-translate-x-full")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center">
        <Input type="search" placeholder="Search..." className="w-[200px] lg:w-[300px] mr-4" />
        <Button variant="ghost" size="icon" className="hidden lg:inline-flex">
          <Search className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <Notifications />
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        {status === "authenticated" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="font-medium">{session?.user?.name}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
