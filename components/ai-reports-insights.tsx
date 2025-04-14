"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/components/app-provider"
import { generateContent } from "@/utils/gemini-api"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function AIReportsInsights() {
  const { tasks, projects, teamMembers } = useAppContext()
  const [reportType, setReportType] = useState("weekly")
  const [report, setReport] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateReport = async () => {
    setLoading(true)
    setError(null)

    try {
      const prompt = `
        Generate a ${reportType} project performance report and team productivity analysis based on the following data:

        Tasks:
        ${tasks.map((task) => `- ${task.title} (Status: ${task.status}, Priority: ${task.priority}, Assignee: ${task.assignee})`).join("\n")}

        Projects:
        ${projects.map((project) => `- ${project.name} (Start: ${project.start}, End: ${project.end}, Progress: ${project.progress}%)`).join("\n")}

        Team Members:
        ${teamMembers.map((member) => `- ${member.name} (Role: ${member.role})`).join("\n")}

        Include the following in your report:
        1. Overall project performance
        2. Team productivity analysis
        3. Key achievements
        4. Potential risks (e.g., overdue tasks, workload imbalance)
        5. Recommendations for improvement

        Provide the report in a structured format with clear sections and bullet points where appropriate.
      `
      const result = await generateContent(prompt)
      setReport(result)
    } catch (error) {
      console.error("Error generating report:", error)
      setError("Failed to generate report. Please try again.")
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Reports & Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly Report</SelectItem>
              <SelectItem value="monthly">Monthly Report</SelectItem>
              <SelectItem value="quarterly">Quarterly Report</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </Button>
        </div>

        {error && <div className="mt-4 text-red-500">{error}</div>}

        {report && <div className="p-4 bg-secondary rounded-md whitespace-pre-wrap">{report}</div>}
      </CardContent>
    </Card>
  )
}
