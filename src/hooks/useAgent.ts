import { useEffect, useRef, useState } from 'react'
import { connectMCP } from '../mcpConnect'

export function useAgent() {
  const [goal, setGoal] = useState('')
  const [maxSteps, setMaxSteps] = useState(10)
  const [maxNewTokens, setMaxNewTokens] = useState(1024)
  const [maxHistoryPairs, setMaxHistoryPairs] = useState(4)
  const [summaryStrategy, setSummaryStrategy] = useState<'deterministic' | 'llm'>('deterministic')
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

  async function runAgent() {
    const g = goal.trim()
    if (!g || loading || !mcpRef.current) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await mcpRef.current.callTool('run_agent', {
        goal: g,
        max_steps: maxSteps,
        max_new_tokens: maxNewTokens,
        max_history_pairs: maxHistoryPairs,
        summary_strategy: summaryStrategy,
      }, idRef.current++)
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
      void runAgent()
    }
  }

  return {
    goal, setGoal,
    maxSteps, setMaxSteps,
    maxNewTokens, setMaxNewTokens,
    maxHistoryPairs, setMaxHistoryPairs,
    summaryStrategy, setSummaryStrategy,
    result, loading, error, runAgent, handleKeyDown,
  }
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
  return '(no response)'
}
