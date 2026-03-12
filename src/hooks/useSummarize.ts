import { useState } from 'react'
import { useMcpClient } from '../McpContext'

export function useSummarize() {
  const { client, nextId } = useMcpClient()
  const [text, setText] = useState('')
  const [focus, setFocus] = useState('')
  const [maxLength, setMaxLength] = useState(200)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function summarize() {
    const t = text.trim()
    if (!t || loading || !client) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await client.callTool('summarize_text', {
        text: t,
        focus: focus.trim(),
        max_length: maxLength,
      }, nextId())
      setResult(extractResult(results))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { text, setText, focus, setFocus, maxLength, setMaxLength, result, loading, error, summarize }
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
