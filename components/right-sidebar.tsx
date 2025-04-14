"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, ChevronRight, ChevronLeft } from "lucide-react"
import { useAppContext } from "./app-provider"

export function RightSidebar() {
  const { tasks, teamMembers, messages } = useAppContext()
  const [isOpen, setIsOpen] = useState(false)

  const upcomingDeadlines = tasks
    .filter((task) => new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const recentActivity = [...tasks, ...messages]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-background border-l transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="p-4 space-y-4 h-full overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {upcomingDeadlines.map((task) => (
                  <li key={task.id} className="text-sm">
                    <span className="font-semibold">{task.title}</span>
                    <br />
                    <span className="text-muted-foreground">{task.dueDate}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentActivity.map((item) => (
                  <li key={item.id} className="text-sm">
                    <span className="font-semibold">{item.title || item.content}</span>
                    <br />
                    <span className="text-muted-foreground">{item.timestamp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {teamMembers.map((member) => (
                  <li key={member.id} className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Quick Add
          </Button>
        </div>
      </div>
    </>
  )
}
