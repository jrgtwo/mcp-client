// Base URL for the MCP server.
// Override by setting VITE_MCP_BASE_URL in a .env file (e.g. VITE_MCP_BASE_URL=http://192.168.1.10:5174).
// Default: same hostname as the client app, port 5174.
const base = import.meta.env.VITE_MCP_BASE_URL
  ?? `${window.location.protocol}//${window.location.hostname}:5174`

export const MCP_URL = `${base}/mcp`
export const UPLOAD_URL = `${base}/upload`
