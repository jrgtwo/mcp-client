import { useState } from 'react'
import { useMcpClient } from '../McpContext'

export interface CreateFileResult {
  success: boolean
  file_path: string | null
  error?: string
  message: string
}

export function useCreateFile() {
  const { client, nextId } = useMcpClient()
  const [fileName, setFileName] = useState('')
  const [content, setContent] = useState('')
  const [directory, setDirectory] = useState('')
  const [encoding, setEncoding] = useState('utf-8')
  const [overwrite, setOverwrite] = useState(false)
  const [result, setResult] = useState<CreateFileResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createFile() {
    const name = fileName.trim()
    if (!name || loading || !client) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const args: Record<string, unknown> = { file_name: name, content, encoding, overwrite }
      if (directory.trim()) args.directory = directory.trim()

      const results = await client.callTool('create_file', args, nextId())
      setResult(extractResult(results))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return {
    fileName, setFileName,
    content, setContent,
    directory, setDirectory,
    encoding, setEncoding,
    overwrite, setOverwrite,
    result, loading, error, createFile,
  }
}

function extractResult(results: unknown[]): CreateFileResult {
  for (const r of results) {
    const structured = (r as any)?.result?.structuredContent
    if (structured && typeof structured === 'object' && 'success' in structured) {
      return structured as CreateFileResult
    }
    const content = (r as any)?.result?.content
    if (Array.isArray(content)) {
      const item = content.find((c: any) => c.type === 'text')
      if (item?.text) {
        try {
          return JSON.parse(item.text) as CreateFileResult
        } catch {
          return { success: true, file_path: null, message: item.text }
        }
      }
    }
  }
  return { success: false, file_path: null, message: '(no data)' }
}
