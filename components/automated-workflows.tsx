"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"
import { Workflow, ArrowRight, Trash2 } from "lucide-react"

export function AutomatedWorkflows() {
  const { tasks, setTasks } = useAppContext()
  const [workflowName, setWorkflowName] = useState("")
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const { toast } = useToast()

  const handleAddTaskToWorkflow = (taskId: string) => {
    if (!selectedTasks.includes(taskId)) {
      setSelectedTasks([...selectedTasks, taskId])
    }
  }

  const handleRemoveTaskFromWorkflow = (taskId: string) => {
    setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
  }

  const handleCreateWorkflow = () => {
    if (!workflowName || selectedTasks.length < 2) return

    // Update task dependencies
    const updatedTasks = tasks.map((task) => {
      if (selectedTasks.includes(task.id)) {
        const taskIndex = selectedTasks.indexOf(task.id)
        const nextTaskId = selectedTasks[taskIndex + 1]
        return {
          ...task,
          dependencies: nextTaskId ? [...(task.dependencies || []), nextTaskId] : task.dependencies,
        }
      }
      return task
    })

    setTasks(updatedTasks)
    setWorkflowName("")
    setSelectedTasks([])

    toast({
      title: "Workflow Created",
      description: `The workflow "${workflowName}" has been created with ${selectedTasks.length} tasks.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Workflows</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Workflow name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />

          <Select onValueChange={handleAddTaskToWorkflow}>
            <SelectTrigger>
              <SelectValue placeholder="Add task to workflow" />
            </SelectTrigger>
            <SelectContent>
              {tasks
                .filter((task) => !selectedTasks.includes(task.id))
                .map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            {selectedTasks.map((taskId, index) => {
              const task = tasks.find((t) => t.id === taskId)
              return (
                <div key={taskId} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                  <div className="flex items-center">
                    {index > 0 && <ArrowRight className="mr-2 h-4 w-4" />}
                    <span>{task?.title}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveTaskFromWorkflow(taskId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>

          <Button onClick={handleCreateWorkflow} disabled={!workflowName || selectedTasks.length < 2}>
            <Workflow className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
