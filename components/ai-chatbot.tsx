"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppContext } from "@/components/app-provider"
import { generateContent } from "@/utils/gemini-api"
import { useToast } from "@/components/ui/use-toast"

export function AIChatbot() {
  const { tasks, teamMembers } = useAppContext()
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const sendMessage = async () => {
    if (!input.trim()) return

    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")
    setLoading(true)

    try {
      const prompt = `
        You are an AI assistant for a team collaboration platform. Answer the following question or perform the requested action based on this context:

        Tasks:
        ${tasks.map((task) => `- ${task.title} (Status: ${task.status}, Priority: ${task.priority}, Assignee: ${task.assignee})`).join("\n")}

        Team Members:
        ${teamMembers.map((member) => `- ${member.name} (Role: ${member.role})`).join("\n")}

        User question: ${input}

        Provide a concise and helpful response.
      `
      const response = await generateContent(prompt)
      setMessages((prev) => [...prev, { role: "bot", content: response }])
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I encountered an error. Please try again." }])
    }
    setLoading(false)
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>AI Team Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
              >
                {message.content}
              </span>
            </div>
          ))}
        </ScrollArea>
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question..."
          />
          <Button onClick={sendMessage} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

