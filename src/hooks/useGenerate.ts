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
  return '(no output)'
}

export function useGenerate() {
  const [prompt, setPrompt] = useState('')
  const [maxNewTokens, setMaxNewTokens] = useState(512)
  const [temperature, setTemperature] = useState(0.7)
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

  async function generate() {
    const p = prompt.trim()
    if (!p || loading || !mcpRef.current) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await mcpRef.current.callTool('generate', {
        prompt: p,
        max_new_tokens: maxNewTokens,
        temperature,
      }, idRef.current++)
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
