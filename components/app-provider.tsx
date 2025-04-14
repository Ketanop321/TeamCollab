"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

// Add proper type definitions
export type Task = {
  id: string
  title: string
  status: "todo" | "inProgress" | "done"
  priority: "Low" | "Medium" | "High"
  assignee: string
  dueDate: string
  description: string
  timeSpent?: number
  dependencies?: string[]
  tags?: string[]
  timestamp?: string
}

export type Project = {
  id: string
  name: string
  start: Date
  end: Date
  description: string
  progress: number
  milestones: { id: string; name: string; dueDate: Date; completed: boolean }[]
}

export type TeamMember = {
  id: number
  name: string
  email: string
  role: string
  permissions?: string[]
  achievements?: string[]
  points: number
}

export type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
  chat?: string
  threadId?: string
}

export type File = {
  id: string
  name: string
  url: string
  uploadedBy: string
  uploadedAt: Date
}

export type Reminder = {
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

// Mock data for development
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Design new landing page",
    status: "todo",
    priority: "High",
    assignee: "Jane Smith",
    dueDate: "2023-12-15",
    description: "Create a modern landing page design for the new product launch",
    timeSpent: 0,
    tags: ["design", "marketing"],
  },
  {
    id: "task-2",
    title: "Implement authentication",
    status: "inProgress",
    priority: "Medium",
    assignee: "John Doe",
    dueDate: "2023-12-10",
    description: "Set up user authentication with NextAuth.js",
    timeSpent: 120,
    tags: ["development", "security"],
  },
  {
    id: "task-3",
    title: "Write API documentation",
    status: "done",
    priority: "Low",
    assignee: "Bob Johnson",
    dueDate: "2023-12-05",
    description: "Document all API endpoints for the developer portal",
    timeSpent: 180,
    tags: ["documentation", "api"],
  },
]

const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Website Redesign",
    start: new Date("2023-11-01"),
    end: new Date("2023-12-31"),
    description: "Complete overhaul of the company website",
    progress: 65,
    milestones: [
      {
        id: "ms-1",
        name: "Design Approval",
        dueDate: new Date("2023-11-15"),
        completed: true,
      },
      {
        id: "ms-2",
        name: "Development Complete",
        dueDate: new Date("2023-12-15"),
        completed: false,
      },
    ],
  },
  {
    id: "proj-2",
    name: "Mobile App Launch",
    start: new Date("2023-12-01"),
    end: new Date("2024-02-28"),
    description: "Develop and launch the new mobile application",
    progress: 30,
    milestones: [
      {
        id: "ms-3",
        name: "Alpha Release",
        dueDate: new Date("2023-12-31"),
        completed: false,
      },
    ],
  },
]

const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Project Manager",
    permissions: ["create_project", "assign_tasks", "view_reports"],
    points: 150,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Designer",
    permissions: ["create_tasks", "upload_files"],
    points: 120,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Developer",
    permissions: ["create_tasks", "commit_code"],
    points: 180,
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    role: "Marketing",
    permissions: ["comment", "upload_files"],
    points: 90,
  },
]

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "John Doe",
    content: "When will the design be ready?",
    timestamp: "10:30 AM",
    chat: "general",
  },
  {
    id: 2,
    sender: "Jane Smith",
    content: "I'll have it ready by tomorrow",
    timestamp: "10:35 AM",
    chat: "general",
  },
  {
    id: 3,
    sender: "Bob Johnson",
    content: "Has anyone started on the API integration?",
    timestamp: "11:15 AM",
    chat: "project-alpha",
  },
]

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [notifications, setNotifications] = useState<any[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(mockTeamMembers[0])
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    // In a production environment, we would fetch data from the API
    // For now, we'll use the mock data
    if (status === "authenticated" && session?.user) {
      // If we have a real user, we could set the current user based on the session
      // For now, we'll just use the mock data
    }
  }, [status, session])

  // This function would save tasks to the API in a production environment
  const saveTasks = async (tasks: Task[]) => {
    // In a production environment, we would save to the API
    // For now, we'll just log to the console
    console.log("Saving tasks:", tasks)
  }

  const setTasksAndSave = (newTasks: React.SetStateAction<Task[]>) => {
    setTasks((prevTasks) => {
      const updatedTasks = typeof newTasks === "function" ? newTasks(prevTasks) : newTasks
      // In a production environment, we would save to the API
      // For now, we'll just log to the console
      console.log("Updated tasks:", updatedTasks)
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
