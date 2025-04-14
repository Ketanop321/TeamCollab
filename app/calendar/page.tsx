"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"

export default function CalendarPage() {
  const { tasks, projects } = useAppContext()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: new Date() })
  const [events, setEvents] = useState<Array<{ title: string; description: string; date: Date }>>([])
  const { toast } = useToast()

  const addEvent = () => {
    if (newEvent.title.trim() !== "") {
      setEvents([...events, newEvent])
      setNewEvent({ title: "", description: "", date: new Date() })
      toast({
        title: "Event Added",
        description: `New event "${newEvent.title}" has been added`,
      })
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => event.date.toDateString() === date.toDateString())
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => new Date(task.dueDate).toDateString() === date.toDateString())
  }

  const getProjectsForDate = (date: Date) => {
    return projects.filter(
      (project) =>
        project.start.toDateString() === date.toDateString() || project.end.toDateString() === date.toDateString(),
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar</h1>
      <div className="flex space-x-6">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Events for {selectedDate?.toDateString() ?? "No date selected"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate && (
              <>
                <h3 className="font-semibold mb-2">Events:</h3>
                <ul className="space-y-2 mb-4">
                  {getEventsForDate(selectedDate).map((event, index) => (
                    <li key={index}>{event.title}</li>
                  ))}
                </ul>
                <h3 className="font-semibold mb-2">Tasks:</h3>
                <ul className="space-y-2 mb-4">
                  {getTasksForDate(selectedDate).map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
                <h3 className="font-semibold mb-2">Projects:</h3>
                <ul className="space-y-2">
                  {getProjectsForDate(selectedDate).map((project) => (
                    <li key={project.id}>
                      {project.name}{" "}
                      {project.start.toDateString() === selectedDate.toDateString() ? "(Start)" : "(End)"}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Event</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <Textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <Calendar
              mode="single"
              selected={newEvent.date}
              onSelect={(date) => setNewEvent({ ...newEvent, date: date || new Date() })}
              className="rounded-md border"
            />
            <Button onClick={addEvent}>Add Event</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
