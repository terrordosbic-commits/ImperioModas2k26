'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { ChatMessage, ChatSession, BotConfig } from './types'
import { getBotConfig, saveChatSession, DEFAULT_BOT_CONFIG } from './bot-config'
import { generateLocalResponse } from './bot-responses'
import { playReceiveSound, startTypingSoundLoop, stopTypingSoundLoop } from './chat-sounds'

interface ChatContextType {
  messages: ChatMessage[]
  isLoading: boolean
  isOpen: boolean
  config: BotConfig
  sendMessage: (content: string) => Promise<void>
  toggleChat: () => void
  setIsOpen: (open: boolean) => void
  clearMessages: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<BotConfig>(DEFAULT_BOT_CONFIG)
  const [sessionId] = useState(() => generateId())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setConfig(getBotConfig())
    setMessages([
      {
        role: 'assistant',
        content: 'Olá! Sou o assistente virtual da Império Modas. Como posso ajudar você hoje?',
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  // Som de digitação da IA
  useEffect(() => {
    if (isLoading) {
      startTypingSoundLoop()
    } else {
      stopTypingSoundLoop()
    }
    return () => stopTypingSoundLoop()
  }, [isLoading])

  // Som e vibração ao receber resposta da IA
  useEffect(() => {
    if (!mounted || messages.length === 0) return
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role === 'assistant' && !isLoading) {
      playReceiveSound()
      // Vibração ao receber resposta
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([30, 40, 30]) } catch { /* noop */ }
      }
    }
    const session: ChatSession = {
      id: sessionId,
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveChatSession(session)
  }, [messages, sessionId, mounted, isLoading])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const userMsg: ChatMessage = {
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      try {
        const currentConfig = getBotConfig()
        if (!currentConfig.enabled) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: currentConfig.fallbackMessage,
              timestamp: new Date().toISOString(),
            },
          ])
          setIsLoading(false)
          return
        }

        // Tentar API OpenAI primeiro
        const historyLimit = currentConfig.maxHistory || 10
        const historyMessages = [...messages, userMsg].slice(-historyLimit)

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyMessages,
            config: currentConfig,
          }),
        })

        const result = await response.json()

        // Se a API retornou fallback (sem API key), usar resposta local inteligente
        if (result.fallback) {
          const localReply = generateLocalResponse(userMsg.content)
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: localReply,
              timestamp: new Date().toISOString(),
            },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: result.reply || currentConfig.fallbackMessage,
              timestamp: new Date().toISOString(),
            },
          ])
        }
      } catch {
        // Em caso de erro de rede, usar resposta local
        const localReply = generateLocalResponse(userMsg.content)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: localReply,
            timestamp: new Date().toISOString(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, messages]
  )

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Olá! Sou o assistente virtual da Império Modas. Como posso ajudar você hoje?',
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        isOpen,
        config,
        sendMessage,
        toggleChat,
        setIsOpen,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}

