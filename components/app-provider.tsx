"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

type Task = {
  id: string
  title: string
  status: "todo" | "inProgress" | "done"
  priority: "Low" | "Medium" | "High"
  assignee: string
  dueDate: string
  description: string
  timeSpent: number
  dependencies: string[]
}

type Project = {
  id: string
  name: string
  start: Date
  end: Date
  description: string
  progress: number
  milestones: { id: string; name: string; dueDate: Date; completed: boolean }[]
}

type TeamMember = {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
  achievements: string[]
  points: number
}

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
  threadId?: string
}

type File = {
  id: string
  name: string
  url: string
  uploadedBy: string
  uploadedAt: Date
}

type Reminder = {
  id: string
  taskId: string
  userId: string
  message: string
  dueDate: Date
}

type AppContextType = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  teamMembers: TeamMember[]
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>
  notifications: any[]
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  reminders: Reminder[]
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>
  currentUser: TeamMember | null
  setCurrentUser: React.Dispatch<React.SetStateAction<TeamMember | null>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated") {
        setLoading(true)
        try {
          const [tasksRes, projectsRes, messagesRes, teamMembersRes] = await Promise.all([
            fetch("/api/tasks"),
            fetch("/api/projects"),
            fetch("/api/messages"),
            fetch("/api/team-members"),
          ])

          const [tasksData, projectsData, messagesData, teamMembersData] = await Promise.all([
            tasksRes.json(),
            projectsRes.json(),
            messagesRes.json(),
            teamMembersRes.json(),
          ])

          setTasks(tasksData)
          setProjects(projectsData)
          setMessages(messagesData)
          setTeamMembers(teamMembersData)
        } catch (error) {
          console.error("Error fetching data:", error)
          toast({
            title: "Error",
            description: "Failed to fetch data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [status, toast])

  const saveTasks = async (tasks: Task[]) => {
    if (status === "authenticated") {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tasks),
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        console.error("Error saving tasks:", error)
        toast({
          title: "Error",
          description: "Failed to save tasks. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const setTasksAndSave = (newTasks: React.SetStateAction<Task[]>) => {
    setTasks((prevTasks) => {
      const updatedTasks = typeof newTasks === "function" ? newTasks(prevTasks) : newTasks
      saveTasks(updatedTasks)
      return updatedTasks
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks: setTasksAndSave,
        projects,
        setProjects,
        messages,
        setMessages,
        teamMembers,
        setTeamMembers,
        notifications,
        setNotifications,
        files,
        setFiles,
        reminders,
        setReminders,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

