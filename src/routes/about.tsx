import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
})

function About() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>About</h2>
      <p>This is an MCP client built with React, Vite, and TanStack Router.</p>
    </div>
  )
}
