import { useEffect, useState } from 'react'
import './App.css'
import { connectMCP } from './mcpConnect'

function App() {
  const [chat, setChat] = useState<string[]>([])

  useEffect(() => {
    let mcp: Awaited<ReturnType<typeof connectMCP>> | null = null;

    (async() => {

    const client = await connectMCP()

    mcp = client
    const res = await client.callTool('chat', {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is 2 + 2?' },
      ],
    }, 2)
    console.log('chat result:', res)
    setChat(res.map(r => (r as any)?.result?.structuredContent?.result))
    })()
    

    return () => {
      // isMounted = false
      mcp?.disconnect()
    }
  }, [])

  return (
    <>
      <div>
        <textarea readOnly value={chat.join('\n')} />
      </div>
    </>
  )
}

export default App
