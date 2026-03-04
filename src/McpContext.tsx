import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { connectMCP } from './mcpConnect'

type McpClient = Awaited<ReturnType<typeof connectMCP>>

interface McpContextValue {
  client: McpClient | null
  nextId: () => number
}

const McpContext = createContext<McpContextValue>({ client: null, nextId: () => 0 })

export function McpProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<McpClient | null>(null)
  const idRef = useRef(2)

  useEffect(() => {
    let mcp: McpClient | null = null
    connectMCP().then(c => {
      mcp = c
      setClient(c)
    })
    return () => { mcp?.disconnect() }
  }, [])

  return (
    <McpContext.Provider value={{ client, nextId: () => idRef.current++ }}>
      {children}
    </McpContext.Provider>
  )
}

export function useMcpClient() {
  return useContext(McpContext)
}
