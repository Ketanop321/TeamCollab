"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Trash2 } from "lucide-react"

export function CustomizableReminders() {
  const { tasks, reminders, setReminders, currentUser } = useAppContext()
  const [selectedTask, setSelectedTask] = useState<string | undefined>(undefined)
  const [reminderMessage, setReminderMessage] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const { toast } = useToast()

  const handleAddReminder = () => {
    if (!selectedTask || !reminderMessage || !reminderDate) return

    const newReminder = {
      id: `rem-${Date.now()}`,
      taskId: selectedTask,
      userId: currentUser?.id.toString() || "",
      message: reminderMessage,
      dueDate: new Date(reminderDate),
    }

    setReminders((prevReminders) => [...prevReminders, newReminder])
    setSelectedTask(undefined)
    setReminderMessage("")
    setReminderDate("")

    toast({
      title: "Reminder Added",
      description: "Your custom reminder has been set successfully.",
    })
  }

  const handleRemoveReminder = (reminderId: string) => {
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== reminderId))
    toast({
      title: "Reminder Removed",
      description: "The reminder has been deleted.",
      variant: "destructive",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customizable Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedTask}>
            <SelectTrigger>
              <SelectValue placeholder="Select task" />
            </SelectTrigger>
            <SelectContent>
              {tasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Reminder message"
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
          />

          <Input type="datetime-local" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} />

          <Button onClick={handleAddReminder} disabled={!selectedTask || !reminderMessage || !reminderDate}>
            <Bell className="mr-2 h-4 w-4" />
            Set Reminder
          </Button>

          <div>
            <h3 className="font-semibold mb-2">Current Reminders:</h3>
            <ul className="space-y-2">
              {reminders
                .filter((reminder) => reminder.userId === currentUser?.id.toString())
                .map((reminder) => (
                  <li key={reminder.id} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                    <div>
                      <p>{reminder.message}</p>
                      <small className="text-muted-foreground">
                        Due: {new Date(reminder.dueDate).toLocaleString()}
                      </small>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveReminder(reminder.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
