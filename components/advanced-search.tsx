"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppContext } from "@/components/app-provider"
import { Save } from "lucide-react"

export function AdvancedSearch() {
  const { tasks, projects } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<{ name: string; term: string; tags: string[] }[]>([])

  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags || [])))

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSaveSearch = () => {
    const searchName = prompt("Enter a name for this search:")
    if (searchName) {
      setSavedSearches([...savedSearches, { name: searchName, term: searchTerm, tags: selectedTags }])
    }
  }

  const handleApplySavedSearch = (search: { term: string; tags: string[] }) => {
    setSearchTerm(search.term)
    setSelectedTags(search.tags)
  }

  const filteredTasks = tasks.filter(
    (task) =>
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTags.length === 0 || selectedTags.every((tag) => task.tags?.includes(tag))),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleSaveSearch}>
              <Save className="mr-2 h-4 w-4" />
              Save Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                />
                <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                  {tag}
                </label>
              </div>
            ))}
          </div>

          {savedSearches.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Saved Searches:</h3>
              <div className="flex flex-wrap gap-2">
                {savedSearches.map((search, index) => (
                  <Button key={index} variant="outline" onClick={() => handleApplySavedSearch(search)}>
                    {search.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Search Results:</h3>
            <ul className="space-y-2">
              {filteredTasks.map((task) => (
                <li key={task.id} className="bg-secondary p-2 rounded-md">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-muted-foreground">{task.description}</div>
                  {task.tags && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.tags.map((tag) => (
                        <span key={tag} className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
