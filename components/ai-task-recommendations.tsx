"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/components/app-provider"
import { generateContent } from "@/utils/gemini-api"
import { useToast } from "@/components/ui/use-toast"

export function AITaskRecommendations() {
  const { tasks, teamMembers } = useAppContext()
  const [recommendations, setRecommendations] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateRecommendations = async () => {
    setLoading(true)
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
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      })
      setRecommendations("Failed to generate recommendations. Please try again.")
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Task Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={generateRecommendations} disabled={loading}>
          {loading ? "Generating..." : "Generate Recommendations"}
        </Button>
        {recommendations && <div className="mt-4 whitespace-pre-wrap">{recommendations}</div>}
      </CardContent>
    </Card>
  )
}

