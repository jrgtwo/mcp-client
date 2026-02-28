import { useEffect, useRef, useState } from 'react'
import { connectMCP } from '../mcpConnect'

type Units = 'metric' | 'imperial'

export function useWeather() {
  const [location, setLocation] = useState('')
  const [units, setUnits] = useState<Units>('metric')
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

  async function getWeather() {
    const loc = location.trim()
    if (!loc || loading || !mcpRef.current) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await mcpRef.current.callTool('get_weather', { location: loc, units }, idRef.current++)
      const text = extractWeather(results)
      setResult(text)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      void getWeather()
    }
  }

  return { location, setLocation, units, setUnits, result, loading, error, getWeather, handleKeyDown }
}

function extractWeather(results: unknown[]): string {
  for (const r of results) {
    const text = (r as any)?.result?.structuredContent?.result
    if (text) return text
    // fallback: plain content array
    const content = (r as any)?.result?.content
    if (Array.isArray(content)) {
      const item = content.find((c: any) => c.type === 'text')
      if (item?.text) return item.text
    }
  }
  return '(no data)'
}
