"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, List, Columns } from "lucide-react"
import { useAppContext, type Task } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"

export default function TasksPage() {
  const { tasks, setTasks, teamMembers } = useAppContext()
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    assignee: "",
    dueDate: "",
    priority: "Medium",
    status: "todo",
    description: "",
  })
  const [viewMode, setViewMode] = useState("kanban")
  const { toast } = useToast()

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const newTasks = Array.from(tasks)
    const [reorderedItem] = newTasks.splice(source.index, 1)
    newTasks.splice(destination.index, 0, {
      ...reorderedItem,
      status: destination.droppableId as "todo" | "inProgress" | "done",
    })

    setTasks(newTasks)
    toast({
      title: "Task Updated",
      description: `Task "${reorderedItem.title}" moved to ${destination.droppableId}`,
    })
  }

  const addTask = () => {
    if (newTask.title.trim() === "") return
    const newTaskItem = { id: `task-${Date.now()}`, ...newTask }
    setTasks([...tasks, newTaskItem])
    setNewTask({
      title: "",
      assignee: "",
      dueDate: "",
      priority: "Medium",
      status: "todo",
      description: "",
    })
    toast({
      title: "Task Added",
      description: `New task "${newTask.title}" added to To Do`,
    })
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    toast({
      title: "Task Deleted",
      description: "The task has been removed",
      variant: "destructive",
    })
  }

  const updateTaskStatus = (taskId: string, newStatus: "todo" | "inProgress" | "done") => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const columns = ["todo", "inProgress", "done"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex space-x-2">
          <Button variant={viewMode === "kanban" ? "default" : "outline"} onClick={() => setViewMode("kanban")}>
            <Columns className="mr-2 h-4 w-4" /> Kanban
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
            <List className="mr-2 h-4 w-4" /> List
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="flex-grow"
            />
            <Select value={newTask.assignee} onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <Select
              value={newTask.priority}
              onValueChange={(value: "Low" | "Medium" | "High") => setNewTask({ ...newTask, priority: value })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTask}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </CardContent>
      </Card>
      {viewMode === "kanban" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((columnId) => (
              <Card key={columnId}>
                <CardHeader>
                  <CardTitle>
                    {columnId === "todo" ? "To Do" : columnId === "inProgress" ? "In Progress" : "Done"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId={columnId}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {tasks
                          .filter((task) => task.status === columnId)
                          .map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-secondary p-4 rounded-md space-y-2"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold">{task.title}</span>
                                    <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>{task.assignee}</span>
                                    <span>{task.dueDate}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span
                                      className={`text-sm ${
                                        task.priority === "High"
                                          ? "text-red-500"
                                          : task.priority === "Medium"
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                      }`}
                                    >
                                      {task.priority}
                                    </span>
                                    <Select
                                      value={task.status}
                                      onValueChange={(value: "todo" | "inProgress" | "done") =>
                                        updateTaskStatus(task.id, value)
                                      }
                                    >
                                      <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="inProgress">In Progress</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-t">
                    <td className="py-2">{task.title}</td>
                    <td className="py-2">{task.assignee}</td>
                    <td className="py-2">{task.dueDate}</td>
                    <td className="py-2">
                      <span
                        className={`text-sm ${
                          task.priority === "High"
                            ? "text-red-500"
                            : task.priority === "Medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-2">
                      <Select
                        value={task.status}
                        onValueChange={(value: "todo" | "inProgress" | "done") => updateTaskStatus(task.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="inProgress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2">
                      <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
