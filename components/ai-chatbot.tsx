"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppContext } from "@/components/app-provider"
import { generateContent } from "@/utils/gemini-api"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send } from "lucide-react"

export function AIChatbot() {
  const { tasks, teamMembers } = useAppContext()
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    setMessages((prev) => [...prev, { role: "user", content: input }])
    const userInput = input
    setInput("")
    setLoading(true)

    try {
      const prompt = `
        You are an AI assistant for a team collaboration platform. Answer the following question or perform the requested action based on this context:

        Tasks:
        ${tasks.map((task) => `- ${task.title} (Status: ${task.status}, Priority: ${task.priority}, Assignee: ${task.assignee})`).join("\n")}

        Team Members:
        ${teamMembers.map((member) => `- ${member.name} (Role: ${member.role})`).join("\n")}

        User question: ${userInput}

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
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>AI Team Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              Ask me anything about your tasks, team members, or projects!
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-secondary">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
        </ScrollArea>
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
