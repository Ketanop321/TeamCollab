"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Plus, Trash2, UserPlus, Lock, Mail, Activity, Plug } from "lucide-react"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"
import { AITaskRecommendations } from "@/components/ai-task-recommendations"

export default function TeamPage() {
  const { teamMembers, setTeamMembers, projects } = useAppContext()
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "" })
  const { toast } = useToast()

  const addMember = () => {
    if (newMember.name && newMember.email && newMember.role) {
      setTeamMembers([...teamMembers, { ...newMember, id: teamMembers.length + 1 }])
      setNewMember({ name: "", email: "", role: "" })
      toast({
        title: "Team Member Added",
        description: `${newMember.name} has been added to the team`,
      })
    }
  }

  const removeMember = (id) => {
    const memberToRemove = teamMembers.find((member) => member.id === id)
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
    toast({
      title: "Team Member Removed",
      description: `${memberToRemove.name} has been removed from the team`,
      variant: "destructive",
    })
  }

  const roleDistribution = teamMembers.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1
    return acc
  }, {})

  const roleData = Object.entries(roleDistribution).map(([name, value]) => ({ name, value }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-64 bg-background border-r p-4">
        <nav className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Team Members
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View & manage all members</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Lock className="mr-2 h-4 w-4" />
                  Roles & Permissions
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Assign access control</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new users via email</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  Activity Log
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Track team actions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Plug className="mr-2 h-4 w-4" />
                  Integrations
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connect with third-party tools</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Team Management</h1>

        {/* Team Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{teamMembers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Team Role Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {teamMembers.map((member) => (
                  <li key={member.id} className="flex justify-between items-center">
                    <span>{member.name}</span>
                    <span className="font-bold">{projects.filter((project) => project[3] === member.id).length}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Team Members</h2>
          <Button onClick={addMember}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite New Member
          </Button>
        </div>

        <Card>
          <CardContent>
            <Tabs defaultValue="members" className="w-full">
              <TabsList>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="invite">Invite</TabsTrigger>
              </TabsList>
              <TabsContent value="members">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                            {member.role}
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => removeMember(member.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="invite">
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                  <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Team Member">Team Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addMember}>
                    <Plus className="mr-2 h-4 w-4" /> Add Member
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* AI Task Recommendations */}
        <div className="mt-6">
          <AITaskRecommendations />
        </div>
      </main>
    </div>
  )
}
