'use client'

import { useRef, useEffect, useState } from 'react'
import { MessageCircle, X, Send, Phone, Bot, User, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useChat } from '@/lib/chat-context'
import { useTypingEffect } from '@/hooks/use-typing-effect'
import { playTypingSound, playSendSound } from '@/lib/chat-sounds'
import { useHaptic } from '@/hooks/use-haptic'

function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted">
        <Bot className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex items-center gap-1 rounded-xl bg-muted px-4 py-2">
        <span className="animate-typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        <span className="animate-typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        <span className="animate-typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
      </div>
    </div>
  )
}

function TypingMessage({ text, isLatest }: { text: string; isLatest: boolean }) {
  const { displayedText } = useTypingEffect(text, 20, isLatest)
  return <>{displayedText}</>
}

export function ChatSupport() {
  const { messages, isLoading, isOpen, toggleChat, setIsOpen, sendMessage, clearMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [typingKeys, setTypingKeys] = useState<Record<number, number>>({})
  const { vibrateMedium } = useHaptic()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Trigger typing effect for new assistant messages
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg && lastMsg.role === 'assistant') {
      const index = messages.length - 1
      setTypingKeys((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }))
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const input = inputRef.current
    if (!input?.value.trim()) return
    playSendSound()
    vibrateMedium()
    sendMessage(input.value)
    input.value = ''
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      playTypingSound()
    }
  }

  return (
    <>
      {/* Botões flutuantes */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <a
            href="https://wa.me/554999882363"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl sm:h-14 sm:w-14"
            aria-label="WhatsApp"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <button
            onClick={toggleChat}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 hover:shadow-xl sm:h-14 sm:w-14"
            aria-label="Abrir chat com assistente virtual"
          >
            <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      )}

      {/* Chat */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 z-50 flex h-[28rem] w-[calc(100vw-2rem)] flex-col shadow-2xl sm:bottom-6 sm:right-6 sm:w-96">
          <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm">Assistente Virtual</CardTitle>
                <p className="text-xs text-muted-foreground">Império Modas</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearMessages} title="Limpar conversa">
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg, i) => {
              const isLatestAssistant = msg.role === 'assistant' && i === messages.length - 1 && !isLoading
              return (
                <div
                  key={`${i}-${typingKeys[i] || 0}`}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    {msg.role === 'user' ? (
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {msg.role === 'assistant' && isLatestAssistant ? (
                      <TypingMessage text={msg.content} isLatest={true} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              )
            })}

            {isLoading && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </CardContent>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-3">
            <Input
              ref={inputRef}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={isLoading}
              onKeyDown={handleKeyDown}
            />
            <Button size="icon" type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      )}
    </>
  )
}

