import { useEffect, useRef, useState } from 'react'
import { useMcpClient } from '../McpContext'

export type Message = { role: 'user' | 'assistant'; content: string }

const SYSTEM_MESSAGE = { role: 'system' as const, content: 'You are a helpful assistant.' }

function extractReply(results: unknown[]): string {
  for (const r of results) {
    const text = (r as any)?.result?.structuredContent?.result
    if (text) return text
  }
  return '(no response)'
}

export function useChat() {
  const { client, nextId } = useMcpClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading || !client) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const history = [...messages, userMsg]
    const results = await client.callTool('chat', {
      messages: [SYSTEM_MESSAGE, ...history],
    }, nextId())

    const reply = extractReply(results)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  return { messages, input, setInput, loading, send, handleKeyDown, bottomRef }
}
