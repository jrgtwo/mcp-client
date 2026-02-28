import { useEffect, useRef, useState } from 'react'
import { connectMCP } from './mcpConnect'

type Message = { role: 'user' | 'assistant'; content: string }

const SYSTEM_MESSAGE = { role: 'system' as const, content: 'You are a helpful assistant.' }

function extractReply(results: unknown[]): string {
  for (const r of results) {
    const text = (r as any)?.result?.structuredContent?.result
    if (text) return text
  }
  return '(no response)'
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
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

    const history = [...messages, userMsg]
    const results = await mcpRef.current.callTool('chat', {
      messages: [SYSTEM_MESSAGE, ...history],
    }, idRef.current++)

    const reply = extractReply(results)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 50px)' }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#888', margin: 'auto', textAlign: 'center' }}>
            Send a message to start chatting.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.75rem',
              background: msg.role === 'user' ? '#646cff' : '#2a2a2a',
              color: '#fff',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.75rem',
              background: '#2a2a2a',
              color: '#888',
            }}>
              ...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        borderTop: '1px solid #444',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #444',
            background: '#1a1a1a',
            color: '#fff',
            fontSize: '1rem',
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#646cff',
            color: '#fff',
            fontSize: '1rem',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
