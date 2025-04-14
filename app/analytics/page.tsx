"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BarChart2, Users, CheckSquare, Clock, Brain } from "lucide-react"
import { useAppContext } from "@/components/app-provider"
import { AIReportsInsights } from "@/components/ai-reports-insights"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const { tasks, projects, teamMembers } = useAppContext()
  const [activeTab, setActiveTab] = useState("performance")

  // Sample data - replace with real data in a production app
  const performanceData = [
    { name: "Jan", completed: 45, ongoing: 30 },
    { name: "Feb", completed: 50, ongoing: 25 },
    { name: "Mar", completed: 60, ongoing: 35 },
    { name: "Apr", completed: 55, ongoing: 40 },
    { name: "May", completed: 70, ongoing: 30 },
  ]

  const productivityData = [
    { name: "Mon", productivity: 70 },
    { name: "Tue", productivity: 80 },
    { name: "Wed", productivity: 75 },
    { name: "Thu", productivity: 85 },
    { name: "Fri", productivity: 78 },
  ]

  const taskCompletionData = [
    { name: "Completed", value: tasks.filter((task) => task.status === "done").length },
    { name: "Ongoing", value: tasks.filter((task) => task.status === "inProgress").length },
    { name: "To Do", value: tasks.filter((task) => task.status === "todo").length },
  ]

  const timeTrackingData = [
    { name: "Project A", hours: 120 },
    { name: "Project B", hours: 80 },
    { name: "Project C", hours: 100 },
    { name: "Project D", hours: 60 },
  ]

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-64 bg-background border-r p-4">
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("performance")}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Project Performance
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("productivity")}>
            <Users className="mr-2 h-4 w-4" />
            Team Productivity
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("taskCompletion")}>
            <CheckSquare className="mr-2 h-4 w-4" />
            Task Completion Rate
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("timeTracking")}>
            <Clock className="mr-2 h-4 w-4" />
            Time Tracking
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("aiPredictions")}>
            <Brain className="mr-2 h-4 w-4" />
            AI-Powered Predictions
          </Button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">245</p>
              <p className="text-sm text-muted-foreground">-5% vs last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">+2% growth</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avg Task Completion Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">3.5 Days</p>
              <p className="text-sm text-muted-foreground">-10% faster</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Hours Logged</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">1800 Hours</p>
              <p className="text-sm text-muted-foreground">+15% increase</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Content */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="performance">Project Performance</TabsTrigger>
                <TabsTrigger value="productivity">Team Productivity</TabsTrigger>
                <TabsTrigger value="taskCompletion">Task Completion</TabsTrigger>
                <TabsTrigger value="timeTracking">Time Tracking</TabsTrigger>
                <TabsTrigger value="aiPredictions">AI Predictions</TabsTrigger>
              </TabsList>
              <TabsContent value="performance">
                <h2 className="text-2xl font-bold mb-4">Project Performance</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#8884d8" />
                    <Bar dataKey="ongoing" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="productivity">
                <h2 className="text-2xl font-bold mb-4">Team Productivity</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={productivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="productivity" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="taskCompletion">
                <h2 className="text-2xl font-bold mb-4">Task Completion Rate</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={taskCompletionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="timeTracking">
                <h2 className="text-2xl font-bold mb-4">Time Tracking</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={timeTrackingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="aiPredictions">
                <h2 className="text-2xl font-bold mb-4">AI-Powered Predictions</h2>
                <AIReportsInsights />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
