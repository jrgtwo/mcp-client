import { useEffect, useRef, useState } from 'react'
import { connectMCP } from '../mcpConnect'

export type Message = { role: 'user' | 'assistant'; content: string }

function extractResult(results: unknown[]): string {
  for (const r of results) {
    const text = (r as any)?.result?.structuredContent?.result
    if (text) return text
    const content = (r as any)?.result?.content
    if (Array.isArray(content)) {
      const item = content.find((c: any) => c.type === 'text')
      if (item?.text) return item.text
    }
  }
  return '(no response)'
}

export function useAgentChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [maxSteps, setMaxSteps] = useState(10)
  const [maxNewTokens, setMaxNewTokens] = useState(1024)
  const [maxHistoryPairs, setMaxHistoryPairs] = useState(4)
  const [summaryStrategy, setSummaryStrategy] = useState<'deterministic' | 'llm'>('deterministic')
  const [loading, setLoading] = useState(false)
  const mcpRef = useRef<Awaited<ReturnType<typeof connectMCP>> | null>(null)
  const idRef = useRef(2)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mcp: Awaited<ReturnType<typeof connectMCP>> | null = null
    connectMCP().then(client => {
      mcp = client
      mcpRef.current = client
    })
    return () => { mcp?.disconnect() }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading || !mcpRef.current) return

    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages
      const goal = history.length === 0
        ? text
        : [
            'Conversation so far:',
            ...history.map(m => `${m.role === 'user' ? 'User' : 'Agent'}: ${m.content}`),
            '',
            `Current goal: ${text}`,
          ].join('\n')

      const results = await mcpRef.current.callTool('run_agent', {
        goal,
        max_steps: maxSteps,
        max_new_tokens: maxNewTokens,
        max_history_pairs: maxHistoryPairs,
        summary_strategy: summaryStrategy,
      }, idRef.current++)
      const reply = extractResult(results)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${msg}` }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  return {
    messages, input, setInput,
    maxSteps, setMaxSteps,
    maxNewTokens, setMaxNewTokens,
    maxHistoryPairs, setMaxHistoryPairs,
    summaryStrategy, setSummaryStrategy,
    loading, send, handleKeyDown, bottomRef,
  }
}
