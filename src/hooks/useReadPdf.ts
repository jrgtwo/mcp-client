import { useState } from 'react'
import { useMcpClient } from '../McpContext'

export function useReadPdf() {
  const { client, nextId } = useMcpClient()
  const [filePath, setFilePath] = useState('')
  const [maxChars, setMaxChars] = useState(8000)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function readPdf() {
    const path = filePath.trim()
    if (!path || loading || !client) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const results = await client.callTool('read_pdf', { file_path: path, max_chars: maxChars }, nextId())
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
      void readPdf()
    }
  }

  return { filePath, setFilePath, maxChars, setMaxChars, result, loading, error, readPdf, handleKeyDown }
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
