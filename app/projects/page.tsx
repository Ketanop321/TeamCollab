"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash2, PinIcon } from "lucide-react"
import { Chart } from "react-google-charts"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"
import { RichTextEditor } from "@/components/rich-text-editor"

export default function ProjectsPage() {
  const { projects, setProjects } = useAppContext()
  const [newProject, setNewProject] = useState<{
    name: string
    start: string
    end: string
    description: string
    progress: number
  }>({
    name: "",
    start: "",
    end: "",
    description: "",
    progress: 0,
  })
  const [pinnedNotes, setPinnedNotes] = useState<string[]>([])
  const [newNote, setNewNote] = useState("")
  const { toast } = useToast()

  const addProject = () => {
    if (newProject.name && newProject.start && newProject.end) {
      setProjects([
        ...projects,
        {
          id: `proj-${Date.now()}`,
          name: newProject.name,
          start: new Date(newProject.start),
          end: new Date(newProject.end),
          description: newProject.description,
          progress: newProject.progress,
          milestones: [],
        },
      ])
      setNewProject({ name: "", start: "", end: "", description: "", progress: 0 })
      toast({
        title: "Project Added",
        description: `New project "${newProject.name}" has been added`,
      })
    }
  }

  const deleteProject = (id: string) => {
    const newProjects = projects.filter((project) => project.id !== id)
    setProjects(newProjects)
    toast({
      title: "Project Deleted",
      description: `Project has been removed`,
      variant: "destructive",
    })
  }

  const updateProjectProgress = (id: string, progress: number) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, progress } : project)))
  }

  const updateProjectDescription = (id: string, description: string) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, description } : project)))
  }

  const addPinnedNote = () => {
    if (newNote.trim() !== "") {
      setPinnedNotes([...pinnedNotes, newNote])
      setNewNote("")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <div className="flex space-x-4">
              <Input
                type="date"
                value={newProject.start}
                onChange={(e) => setNewProject({ ...newProject, start: e.target.value })}
              />
              <Input
                type="date"
                value={newProject.end}
                onChange={(e) => setNewProject({ ...newProject, end: e.target.value })}
              />
            </div>
            <RichTextEditor
              value={newProject.description}
              onChange={(value: string) => setNewProject({ ...newProject, description: value })}
            />
            <Button onClick={addProject}>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="Timeline"
            loader={<div>Loading Chart</div>}
            data={[
              [
                { type: "string", id: "Project" },
                { type: "date", id: "Start" },
                { type: "date", id: "End" },
              ],
              ...projects.map((project) => [project.name, project.start, project.end]),
            ]}
            options={{
              timeline: { showRowLabels: true },
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {projects.map((project) => (
              <li key={project.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{project.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => deleteProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    {project.start.toDateString()} - {project.end.toDateString()}
                  </span>
                </div>
                <Progress value={project.progress} className="w-full" />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={project.progress}
                  onChange={(e) => updateProjectProgress(project.id, Number(e.target.value))}
                  className="w-20"
                />
                <RichTextEditor
                  value={project.description}
                  onChange={(value: string) => updateProjectDescription(project.id, value)}
                />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pinned Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Add a note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button onClick={addPinnedNote}>
                <PinIcon className="mr-2 h-4 w-4" /> Pin Note
              </Button>
            </div>
            <ul className="space-y-2">
              {pinnedNotes.map((note, index) => (
                <li key={index} className="bg-secondary p-2 rounded-md">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
