"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/components/app-provider"
import { generateContent } from "@/utils/gemini-api"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function AITaskRecommendations() {
  const { tasks, teamMembers } = useAppContext()
  const [recommendations, setRecommendations] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const prompt = `
        Given the following tasks and team members, provide recommendations for task assignments, 
        smart deadlines, and potential blockers. Consider workload balance and past contributions.

        Tasks:
        ${tasks.map((task) => `- ${task.title} (Status: ${task.status}, Priority: ${task.priority})`).join("\n")}

        Team Members:
        ${teamMembers.map((member) => `- ${member.name} (Role: ${member.role})`).join("\n")}

        Provide your recommendations in a structured format.
      `
      const result = await generateContent(prompt)
      setRecommendations(result)
    } catch (error) {
      console.error("Error generating recommendations:", error)
      setError("Failed to generate recommendations. Please try again.")
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Task Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={generateRecommendations} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Recommendations"
          )}
        </Button>

        {error && <div className="mt-4 text-red-500">{error}</div>}

        {recommendations && (
          <div className="mt-4 p-4 bg-secondary rounded-md whitespace-pre-wrap">{recommendations}</div>
        )}
      </CardContent>
    </Card>
  )
}
