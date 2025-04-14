"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppContext } from "@/components/app-provider"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Send } from "lucide-react"

export function DiscussionThreads() {
  const { messages, setMessages, currentUser } = useAppContext()
  const [newMessage, setNewMessage] = useState("")
  const [activeThread, setActiveThread] = useState("thread-1")
  const { toast } = useToast()

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      sender: currentUser?.name || "Unknown",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      threadId: activeThread,
    }

    setMessages((prevMessages) => [...prevMessages, message])
    setNewMessage("")
    toast({
      title: "Message Sent",
      description: "Your message has been added to the thread.",
    })
  }

  const threads = Array.from(new Set(messages.map((m) => m.threadId)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discussion Threads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-[400px]">
          <div className="w-1/4 border-r pr-4">
            {threads.map((threadId) => (
              <Button
                key={threadId}
                variant={activeThread === threadId ? "default" : "ghost"}
                className="w-full justify-start mb-2"
                onClick={() => setActiveThread(threadId)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Thread {threadId}
              </Button>
            ))}
          </div>
          <div className="w-3/4 pl-4 flex flex-col">
            <div className="flex-grow overflow-y-auto mb-4">
              {messages
                .filter((m) => m.threadId === activeThread)
                .map((message) => (
                  <div key={message.id} className="mb-2">
                    <strong>{message.sender}</strong>: {message.content}
                    <small className="block text-muted-foreground">{message.timestamp}</small>
                  </div>
                ))}
            </div>
            <div className="flex items-center">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow mr-2"
              />
              <Button onClick={handleSendMessage}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
