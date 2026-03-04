import { useState } from 'react'
import { useMcpClient } from '../McpContext'

type Units = 'metric' | 'imperial'

export function useWeather() {
  const { client, nextId } = useMcpClient()
  const [location, setLocation] = useState('')
  const [units, setUnits] = useState<Units>('metric')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function getWeather() {
    const loc = location.trim()
    if (!loc || loading || !client) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await client.callTool('get_weather', { location: loc, units }, nextId())
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
    const content = (r as any)?.result?.content
    if (Array.isArray(content)) {
      const item = content.find((c: any) => c.type === 'text')
      if (item?.text) return item.text
    }
  }
  return '(no data)'
}
