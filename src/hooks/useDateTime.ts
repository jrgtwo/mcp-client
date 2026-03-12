import { useState } from 'react'
import { useMcpClient } from '../McpContext'

export function useDateTime() {
  const { client, nextId } = useMcpClient()
  const [timezone, setTimezone] = useState('UTC')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function getDateTime() {
    if (loading || !client) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await client.callTool('get_datetime', { timezone: timezone.trim() || 'UTC' }, nextId())
      setResult(extractResult(results))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      void getDateTime()
    }
  }

  return { timezone, setTimezone, result, loading, error, getDateTime, handleKeyDown }
}

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
  return '(no data)'
}
