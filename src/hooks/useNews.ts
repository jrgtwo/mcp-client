import { useEffect, useRef, useState } from 'react'
import { connectMCP } from '../mcpConnect'

function extractText(results: unknown[]): string {
  for (const r of results) {
    const text = (r as any)?.result?.structuredContent?.result
    if (text) return text
    const content = (r as any)?.result?.content
    if (Array.isArray(content)) {
      const item = content.find((c: any) => c.type === 'text')
      if (item?.text) return item.text
    }
  }
  return '(no results)'
}

export function useNews() {
  const [topic, setTopic] = useState('')
  const [country, setCountry] = useState('us')
  const [maxResults, setMaxResults] = useState(5)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mcpRef = useRef<Awaited<ReturnType<typeof connectMCP>> | null>(null)
  const idRef = useRef(2)

  useEffect(() => {
    let mcp: Awaited<ReturnType<typeof connectMCP>> | null = null
    connectMCP().then(client => {
      mcp = client
      mcpRef.current = client
    })
    return () => { mcp?.disconnect() }
  }, [])

  async function fetchNews() {
    if (loading || !mcpRef.current) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await mcpRef.current.callTool('news_headlines', {
        topic: topic.trim(),
        country,
        max_results: maxResults,
      }, idRef.current++)
      setResult(extractText(results))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      void fetchNews()
    }
  }

  return {
    topic, setTopic,
    country, setCountry,
    maxResults, setMaxResults,
    result, loading, error, fetchNews, handleKeyDown,
  }
}
