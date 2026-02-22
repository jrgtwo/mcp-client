# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR at localhost:5173)
npm run build     # Type-check + production build to dist/
npm run lint      # Run ESLint
npm run preview   # Serve the production build locally
```

No test runner is configured.

## Architecture

This is a **React + TypeScript + Vite** app serving as an MCP (Model Context Protocol) client. The project is at an early/experimental stage — the boilerplate UI from the Vite template is still present.

**MCP communication** happens in `src/App.tsx` via a `useEffect` that fires on mount:
- Sends a JSON-RPC 2.0 `initialize` request to `http://127.0.0.1:8000/mcp`
- Uses `Content-Type: application/json` and `Accept: application/json, text/event-stream`
- The MCP server must be running locally on port 8000

**Entry points:**
- `index.html` → `src/main.tsx` → `src/App.tsx`

**TypeScript** uses strict mode with project references: `tsconfig.json` composes `tsconfig.app.json` (src/, targets ES2022) and `tsconfig.node.json` (vite.config.ts, targets ES2023).

**ESLint** is configured in `eslint.config.js` with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
