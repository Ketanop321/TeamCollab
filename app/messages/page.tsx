"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Send, Star, Pin, MoreVertical, Smile } from "lucide-react"
import { useAppContext } from "@/components/app-provider"

export default function MessagesPage() {
  const { messages, setMessages, teamMembers } = useAppContext()
  const [newMessage, setNewMessage] = useState("")
  const [activeChat, setActiveChat] = useState("general")
  const [searchTerm, setSearchTerm] = useState("")
  const [starredMessages, setStarredMessages] = useState([])
  const [pinnedConversations, setPinnedConversations] = useState(["general"])

  const sendMessage = () => {
    if (newMessage.trim() === "") return
    const message = {
      id: messages.length + 1,
      sender: "You",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      chat: activeChat,
    }
    setMessages([...messages, message])
    setNewMessage("")
  }

  const toggleStar = (messageId) => {
    if (starredMessages.includes(messageId)) {
      setStarredMessages(starredMessages.filter((id) => id !== messageId))
    } else {
      setStarredMessages([...starredMessages, messageId])
    }
  }

  const togglePin = (chatId) => {
    if (pinnedConversations.includes(chatId)) {
      setPinnedConversations(pinnedConversations.filter((id) => id !== chatId))
    } else {
      setPinnedConversations([...pinnedConversations, chatId])
    }
  }

  const filteredMessages = messages.filter(
    (message) =>
      message.chat === activeChat &&
      (message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const chats = [
    { id: "general", name: "General", type: "group" },
    { id: "project-alpha", name: "Project Alpha", type: "group" },
    ...teamMembers.map((member) => ({ id: member.id, name: member.name, type: "direct" })),
  ]

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      const randomMessage = {
        id: messages.length + 1,
        sender: teamMembers[Math.floor(Math.random() * teamMembers.length)].name,
        content: `Random message ${Math.random().toString(36).substring(7)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        chat: activeChat,
      }
      setMessages((prevMessages) => [...prevMessages, randomMessage])
    }, 30000)

    return () => clearInterval(interval)
  }, [activeChat, messages, setMessages, teamMembers])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Card className="w-64 flex flex-col">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <Input
            type="search"
            placeholder="Search..."
            className="mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Tabs defaultValue="chats" className="flex-grow flex flex-col">
            <TabsList>
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>
            <TabsContent value="chats" className="flex-grow">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                {chats
                  .sort(
                    (a, b) =>
                      pinnedConversations.includes(b.id) - pinnedConversations.includes(a.id) ||
                      (b.name < a.name ? 1 : -1),
                  )
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-center justify-between p-2 hover:bg-secondary cursor-pointer ${
                        activeChat === chat.id ? "bg-secondary" : ""
                      }`}
                      onClick={() => setActiveChat(chat.id)}
                    >
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${chat.name}`} />
                          <AvatarFallback>{chat.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{chat.name}</span>
                      </div>
                      <div className="flex items-center">
                        {pinnedConversations.includes(chat.id) && <Pin className="h-4 w-4 mr-1" />}
                        <Badge variant="secondary" className="ml-2">
                          {messages.filter((m) => m.chat === chat.id && m.sender !== "You").length}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="starred" className="flex-grow">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                {messages
                  .filter((message) => starredMessages.includes(message.id))
                  .map((message) => (
                    <div key={message.id} className="p-2 hover:bg-secondary cursor-pointer">
                      <p className="font-semibold">{message.sender}</p>
                      <p>{message.content}</p>
                    </div>
                  ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Card className="flex-grow ml-4 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{chats.find((chat) => chat.id === activeChat)?.name}</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow">
            {filteredMessages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.sender === "You" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  <p className="font-semibold">{message.sender}</p>
                  <p>{message.content}</p>
                  <div className="text-xs mt-1 flex items-center justify-end space-x-1">
                    <span>{message.timestamp}</span>
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => toggleStar(message.id)}>
                      <Star
                        className={`h-3 w-3 ${starredMessages.includes(message.id) ? "text-yellow-400 fill-yellow-400" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex items-center mt-4">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-grow mr-2"
            />
            <Button variant="ghost" size="icon" className="mr-2">
              <Smile className="h-5 w-5" />
            </Button>
            <Button onClick={sendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
