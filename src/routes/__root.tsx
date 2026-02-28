import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <nav style={{ display: 'flex', gap: '1rem', padding: '0.5rem 1rem', borderBottom: '1px solid #444' }}>
        <Link to="/chat" activeProps={{ style: { fontWeight: 'bold' } }}>
          Chat
        </Link>
        <Link to="/weather" activeProps={{ style: { fontWeight: 'bold' } }}>
          Weather
        </Link>
        <Link to="/about" activeProps={{ style: { fontWeight: 'bold' } }}>
          About
        </Link>
      </nav>
      <Outlet />
    </>
  ),
})
