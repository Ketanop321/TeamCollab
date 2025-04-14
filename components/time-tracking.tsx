"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"
import { Play, Pause, Clock } from "lucide-react"

export function TimeTracking() {
  const { tasks, setTasks, currentUser } = useAppContext()
  const [selectedTask, setSelectedTask] = useState<string | undefined>(undefined)
  const [isTracking, setIsTracking] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isTracking])

  const handleStartTracking = () => {
    if (!selectedTask) return
    setIsTracking(true)
    toast({
      title: "Time Tracking Started",
      description: `Now tracking time for the selected task.`,
    })
  }

  const handleStopTracking = () => {
    setIsTracking(false)
    if (selectedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask ? { ...task, timeSpent: (task.timeSpent || 0) + elapsedTime } : task,
        ),
      )
    }
    setElapsedTime(0)
    toast({
      title: "Time Tracking Stopped",
      description: `Time tracked has been added to the task.`,
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedTask} disabled={isTracking}>
            <SelectTrigger>
              <SelectValue placeholder="Select task to track" />
            </SelectTrigger>
            <SelectContent>
              {tasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              <Clock className="inline-block mr-2 h-6 w-6" />
              {formatTime(elapsedTime)}
            </div>
            {isTracking ? (
              <Button onClick={handleStopTracking} variant="destructive">
                <Pause className="mr-2 h-4 w-4" />
                Stop Tracking
              </Button>
            ) : (
              <Button onClick={handleStartTracking} disabled={!selectedTask}>
                <Play className="mr-2 h-4 w-4" />
                Start Tracking
              </Button>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Time Spent on Tasks:</h3>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center bg-secondary p-2 rounded-md">
                  <span>{task.title}</span>
                  <span className="font-bold">{formatTime(task.timeSpent || 0)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
