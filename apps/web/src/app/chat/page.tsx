'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { PaperAirplaneIcon, UserIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  type?: 'text' | 'job_suggestion' | 'error'
}

export default function ChatPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your AI career assistant. I can help you find jobs, prepare for interviews, and answer career-related questions. How can I assist you today?',
        sender: 'ai',
        timestamp: new Date()
      }
    ])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/auth/login'
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('job') || input.includes('career') || input.includes('position')) {
      return 'I can help you find job opportunities! Based on your profile, I recommend checking out software engineering positions. Would you like me to search for specific types of jobs or help you prepare your resume?'
    }
    
    if (input.includes('interview') || input.includes('prepare')) {
      return 'Great! I can help you prepare for interviews. Here are some tips:\n\n1. Research the company and role thoroughly\n2. Practice common interview questions\n3. Prepare examples using the STAR method\n4. Prepare thoughtful questions to ask them\n\nWould you like me to conduct a mock interview with you?'
    }
    
    if (input.includes('resume') || input.includes('cv')) {
      return 'I can help you improve your resume! Here are some key areas to focus on:\n\n1. Use action verbs and quantify your achievements\n2. Tailor your resume to each job application\n3. Keep it concise (1-2 pages)\n4. Include relevant keywords from job descriptions\n\nWould you like me to review your current resume or help you create one?'
    }
    
    if (input.includes('salary') || input.includes('compensation')) {
      return 'I can help you research salary information! Based on your field and experience level, here are some general guidelines:\n\n1. Research on Glassdoor, PayScale, and LinkedIn\n2. Consider location, company size, and industry\n3. Factor in benefits and perks\n4. Be prepared to negotiate\n\nWhat specific role or location are you interested in?'
    }
    
    return 'That\'s an interesting question! I\'m here to help with your career journey. I can assist with job searching, interview preparation, resume building, salary research, and career advice. What specific area would you like to explore?'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Career Assistant</h1>
              <p className="text-gray-600">Get personalized career guidance and job search help</p>
            </div>
          </div>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && (
                        <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <UserIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Please sign in to start chatting with our AI assistant</p>
                  <Button onClick={() => window.location.href = '/auth/login'}>
                    Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about your career..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setInputMessage('Help me find software engineering jobs')}
            >
              <div className="text-2xl">🔍</div>
              <span className="text-sm">Find Jobs</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setInputMessage('Help me prepare for interviews')}
            >
              <div className="text-2xl">💼</div>
              <span className="text-sm">Interview Prep</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setInputMessage('Review my resume')}
            >
              <div className="text-2xl">📄</div>
              <span className="text-sm">Resume Help</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setInputMessage('What salary should I expect?')}
            >
              <div className="text-2xl">💰</div>
              <span className="text-sm">Salary Info</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
