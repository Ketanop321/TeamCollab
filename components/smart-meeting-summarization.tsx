"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generateContent } from "@/utils/gemini-api"
import { useToast } from "@/components/ui/use-toast"

export function SmartMeetingSummarization() {
  const [meetingNotes, setMeetingNotes] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateSummary = async () => {
    setLoading(true)
    try {
      const prompt = `
        Summarize the following meeting notes into key points, action items, and a bullet-point summary of project updates:

        ${meetingNotes}

        Provide your summary in a structured format with clear sections for key points, action items, and project updates.
      `
      const result = await generateContent(prompt)
      setSummary(result)
    } catch (error) {
      console.error("Error generating summary:", error)
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      })
      setSummary("Failed to generate summary. Please try again.")
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Meeting Summarization</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste your meeting notes here..."
          value={meetingNotes}
          onChange={(e) => setMeetingNotes(e.target.value)}
          rows={10}
          className="mb-4"
        />
        <Button onClick={generateSummary} disabled={loading}>
          {loading ? "Generating..." : "Generate Summary"}
        </Button>
        {summary && <div className="mt-4 whitespace-pre-wrap">{summary}</div>}
      </CardContent>
    </Card>
  )
}

