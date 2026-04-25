'use client'

import { useState, useEffect, useCallback } from 'react'

export function useTypingEffect(text: string, speed: number = 25, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const startTyping = useCallback(() => {
    setDisplayedText('')
    setIsComplete(false)
    setIsTyping(true)
  }, [])

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    startTyping()
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, enabled, startTyping])

  return { displayedText, isTyping, isComplete }
}

