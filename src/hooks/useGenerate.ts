import { useState } from 'react'
import { useMcpClient } from '../McpContext'

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
  return '(no output)'
}

export function useGenerate() {
  const { client, nextId } = useMcpClient()
  const [prompt, setPrompt] = useState('')
  const [maxNewTokens, setMaxNewTokens] = useState(512)
  const [temperature, setTemperature] = useState(0.7)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    const p = prompt.trim()
    if (!p || loading || !client) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await client.callTool('generate', {
        prompt: p,
        max_new_tokens: maxNewTokens,
        temperature,
      }, nextId())
      setResult(extractText(results))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void generate()
    }
  }

  return {
    prompt, setPrompt,
    maxNewTokens, setMaxNewTokens,
    temperature, setTemperature,
    result, loading, error, generate, handleKeyDown,
  }
}
