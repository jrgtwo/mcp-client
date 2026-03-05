import { MCP_URL } from './config'

async function* readSSE(response: Response): AsyncGenerator<unknown> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        yield JSON.parse(line.slice(6))
      }
    }
  }
}

async function post(method: string, sessionId: string | null, params?: unknown, id?: number) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
  }
  if (sessionId) headers['Mcp-Session-Id'] = sessionId

  return fetch(MCP_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  })
}

export async function connectMCP() {
  // Step 1 — Initialize, capture session ID from response headers
  const initRes = await post('initialize', null, {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'mcp-client', version: '1.0' },
  }, 1)

  const sessionId = initRes.headers.get('Mcp-Session-Id')
  for await (const msg of readSSE(initRes)) {
    console.log('initialize:', msg)
  }

  // Step 2 — Complete handshake
  await post('notifications/initialized', sessionId)

  return {
    // Step 3 — Call a tool
    callTool: async (name: string, args: Record<string, unknown>, id: number) => {
      const res = await post('tools/call', sessionId, { name, arguments: args }, id)
      const results: unknown[] = []
      for await (const msg of readSSE(res)) {
        console.log(`${name} result:`, msg)
        results.push(msg)
      }
      return results
    },

    // Step 4 — End session
    disconnect: () => {
      if (sessionId) {
        fetch(MCP_URL, {
          method: 'DELETE',
          headers: { 'Mcp-Session-Id': sessionId },
        })
      }
    },
  }
}
