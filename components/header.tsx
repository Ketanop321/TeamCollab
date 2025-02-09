"use client"

import { Search, Settings, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "./mode-toggle"
import { Notifications } from "./notifications"

export default function Header() {
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
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

