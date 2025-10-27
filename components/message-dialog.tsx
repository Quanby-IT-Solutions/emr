"use client"

import * as React from "react"
import { IconMessage, IconSend, IconPaperclip, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface Message {
  id: string
  sender: string
  senderAvatar: string
  content: string
  time: string
  isFromCurrentUser: boolean
}

interface Conversation {
  id: string
  participant: string
  participantAvatar: string
  lastMessage: string
  lastMessageTime: string
  unread: boolean
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: "Dr. Sarah Johnson",
    participantAvatar: "/avatars/01.png",
    lastMessage: "Can you check on the patient in Room 302?",
    lastMessageTime: "2 min ago",
    unread: true,
    messages: [
      {
        id: "1-1",
        sender: "Dr. Sarah Johnson",
        senderAvatar: "/avatars/01.png",
        content: "Can you check on the patient in Room 302?",
        time: "2 min ago",
        isFromCurrentUser: false
      }
    ]
  },
  {
    id: "2",
    participant: "Nurse Emily Davis",
    participantAvatar: "/avatars/02.png",
    lastMessage: "Lab results are ready for review",
    lastMessageTime: "10 min ago",
    unread: true,
    messages: [
      {
        id: "2-1",
        sender: "Nurse Emily Davis",
        senderAvatar: "/avatars/02.png",
        content: "Lab results are ready for review",
        time: "10 min ago",
        isFromCurrentUser: false
      }
    ]
  },
  {
    id: "3",
    participant: "Dr. Michael Chen",
    participantAvatar: "/avatars/03.png",
    lastMessage: "Please update the medication schedule",
    lastMessageTime: "1 hour ago",
    unread: true,
    messages: [
      {
        id: "3-1",
        sender: "Dr. Michael Chen",
        senderAvatar: "/avatars/03.png",
        content: "Please update the medication schedule",
        time: "1 hour ago",
        isFromCurrentUser: false
      }
    ]
  },
  {
    id: "4",
    participant: "Admin Office",
    participantAvatar: "/avatars/04.png",
    lastMessage: "Staff meeting tomorrow at 9 AM",
    lastMessageTime: "3 hours ago",
    unread: false,
    messages: [
      {
        id: "4-1",
        sender: "Admin Office",
        senderAvatar: "/avatars/04.png",
        content: "Staff meeting tomorrow at 9 AM",
        time: "3 hours ago",
        isFromCurrentUser: false
      }
    ]
  },
]

export function MessageDialog() {
  const [conversations, setConversations] = React.useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null)
  const [currentView, setCurrentView] = React.useState<'list' | 'conversation'>('list')
  const [messageText, setMessageText] = React.useState("")
  const unreadCount = conversations.filter(c => c.unread).length

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      const newMessage: Message = {
        id: `${selectedConversation}-${Date.now()}`,
        sender: "You",
        senderAvatar: "/avatars/current-user.png",
        content: messageText.trim(),
        time: "now",
        isFromCurrentUser: true
      }

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversation
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessage: messageText.trim(),
                lastMessageTime: "now"
              }
            : conv
        )
      )
      setMessageText("")
    }
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    setCurrentView('conversation')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedConversation(null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <IconMessage className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[600px] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Messages</DialogTitle>
        </DialogHeader>
        <div className="h-full">
          {currentView === 'list' ? (
            /* Messages List */
            <div className="h-full">
              <div className="p-3">
                <Input placeholder="Search messages..." className="h-9" />
              </div>
              <Separator />
              <ScrollArea className="h-[calc(600px-120px)]">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full p-3 flex items-start gap-3 hover:bg-accent transition-colors text-left ${
                      selectedConversation === conversation.id ? "bg-accent" : ""
                    } ${conversation.unread ? "bg-accent/50" : ""}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.participantAvatar} />
                      <AvatarFallback>{conversation.participant.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{conversation.participant}</p>
                        {conversation.unread && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conversation.lastMessageTime}
                      </p>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </div>
          ) : (
            /* Conversation View */
            <div className="h-full flex flex-col">
              {/* Conversation Header with Back Button */}
              <div className="p-4 border-b flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={handleBackToList}>
                  <IconX className="h-4 w-4" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.participantAvatar} />
                  <AvatarFallback>
                    {conversations.find(c => c.id === selectedConversation)?.participant.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {conversations.find(c => c.id === selectedConversation)?.participant}
                  </p>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversations.find(c => c.id === selectedConversation)?.messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      {!message.isFromCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.senderAvatar} />
                          <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex-1 ${message.isFromCurrentUser ? 'flex justify-end' : ''}`}>
                        <div className={`rounded-lg p-3 inline-block max-w-[80%] ${
                          message.isFromCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 ${message.isFromCurrentUser ? 'text-right' : ''}`}>
                          {message.time}
                        </p>
                      </div>
                      {message.isFromCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.senderAvatar} />
                          <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <IconPaperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <IconSend className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
