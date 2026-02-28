# MCP Client

A React + TypeScript + Vite browser client for interacting with a local [MCP](https://modelcontextprotocol.io) server. Connects over HTTP using the MCP streamable-HTTP transport.

## Prerequisites

The MCP server must be running locally on port 8000 before using the app:

```bash
python -m src.mcp.llm_server --model models/<model-name> --transport http --port 8000
```

## Getting started

```bash
npm install
npm run dev      # Dev server with HMR at http://localhost:5173
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Vite HMR at localhost:5173) |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build locally |

## Features

### Chat (`/chat`)
Sends messages to the MCP server's `chat` tool and displays the response. Maintains full conversation history per session.

### Weather (`/weather`)
Fetches current weather for any city or region via the MCP server's `get_weather` tool (powered by [Open-Meteo](https://open-meteo.com) — no API key required). Supports metric (°C / km/h) and imperial (°F / mph) units.

## Architecture

```
src/
├── mcpConnect.tsx        # MCP HTTP transport — initialize, callTool, disconnect
├── hooks/
│   ├── useChat.ts        # Chat session state and message handling
│   └── useWeather.ts     # Weather lookup state and MCP call
├── Chat.tsx              # Chat UI
├── Weather.tsx           # Weather UI
├── router.tsx            # TanStack Router setup
└── routes/
    ├── __root.tsx        # Nav layout
    ├── chat.tsx          # /chat route
    ├── weather.tsx       # /weather route
    └── index.tsx         # / redirect
```

**MCP transport** (`src/mcpConnect.tsx`) handles the three-step HTTP handshake:
1. `POST /mcp` with `initialize` — captures `Mcp-Session-Id` from response headers
2. `POST /mcp` with `notifications/initialized` — completes the handshake
3. `POST /mcp` with `tools/call` per request — streams SSE responses
4. `DELETE /mcp` on cleanup — ends the session

Each page (`/chat`, `/weather`) creates its own MCP session on mount and tears it down on unmount.
