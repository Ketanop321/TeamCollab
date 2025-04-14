"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generateContent } from "@/utils/gemini-api"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function SmartMeetingSummarization() {
  const [meetingNotes, setMeetingNotes] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateSummary = async () => {
    if (!meetingNotes.trim()) {
      toast({
        title: "Error",
        description: "Please enter meeting notes to summarize.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError(null)

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
      setError("Failed to generate summary. Please try again.")
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Summary"
          )}
        </Button>

        {error && <div className="mt-4 text-red-500">{error}</div>}

        {summary && <div className="mt-4 p-4 bg-secondary rounded-md whitespace-pre-wrap">{summary}</div>}
      </CardContent>
    </Card>
  )
}
