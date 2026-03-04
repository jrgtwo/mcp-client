import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import './index.css'
import { router } from './router'
import { McpProvider } from './McpContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <McpProvider>
      <RouterProvider router={router} />
    </McpProvider>
  </StrictMode>,
)
