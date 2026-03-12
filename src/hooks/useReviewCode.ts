import { useState } from 'react'
import { useMcpClient } from '../McpContext'

export function useReviewCode() {
  const { client, nextId } = useMcpClient()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [focus, setFocus] = useState<'general' | 'security' | 'performance' | 'style'>('general')
  const [maxNewTokens, setMaxNewTokens] = useState(768)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function reviewCode() {
    const c = code.trim()
    if (!c || loading || !client) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await client.callTool('review_code', {
        code: c,
        language,
        focus,
        max_new_tokens: maxNewTokens,
      }, nextId())
      setResult(extractResult(results))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { code, setCode, language, setLanguage, focus, setFocus, maxNewTokens, setMaxNewTokens, result, loading, error, reviewCode }
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
