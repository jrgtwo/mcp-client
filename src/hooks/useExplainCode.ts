import { useState } from 'react'
import { useMcpClient } from '../McpContext'

export function useExplainCode() {
  const { client, nextId } = useMcpClient()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [maxNewTokens, setMaxNewTokens] = useState(768)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function explainCode() {
    const c = code.trim()
    if (!c || loading || !client) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await client.callTool('explain_code', {
        code: c,
        language,
        level,
        max_new_tokens: maxNewTokens,
      }, nextId())
      setResult(extractResult(results))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { code, setCode, language, setLanguage, level, setLevel, maxNewTokens, setMaxNewTokens, result, loading, error, explainCode }
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
