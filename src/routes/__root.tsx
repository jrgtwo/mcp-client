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
        <Link to="/agent" activeProps={{ style: { fontWeight: 'bold' } }}>
          Agent
        </Link>
        <Link to="/agent-chat" activeProps={{ style: { fontWeight: 'bold' } }}>
          Agent Chat
        </Link>
        <Link to="/coding-tutor" activeProps={{ style: { fontWeight: 'bold' } }}>
          Tutor
        </Link>
        <Link to="/generate" activeProps={{ style: { fontWeight: 'bold' } }}>
          Generate
        </Link>
        <Link to="/news" activeProps={{ style: { fontWeight: 'bold' } }}>
          News
        </Link>
        <Link to="/fetch-url" activeProps={{ style: { fontWeight: 'bold' } }}>
          Fetch URL
        </Link>
        <Link to="/date-time" activeProps={{ style: { fontWeight: 'bold' } }}>
          Date & Time
        </Link>
        <Link to="/read-pdf" activeProps={{ style: { fontWeight: 'bold' } }}>
          Read PDF
        </Link>
        <Link to="/read-markdown" activeProps={{ style: { fontWeight: 'bold' } }}>
          Read MD
        </Link>
        <Link to="/explain-code" activeProps={{ style: { fontWeight: 'bold' } }}>
          Explain
        </Link>
        <Link to="/review-code" activeProps={{ style: { fontWeight: 'bold' } }}>
          Review
        </Link>
        <Link to="/stock-price" activeProps={{ style: { fontWeight: 'bold' } }}>
          Stock
        </Link>
        <Link to="/summarize" activeProps={{ style: { fontWeight: 'bold' } }}>
          Summarize
        </Link>
        <Link to="/create-file" activeProps={{ style: { fontWeight: 'bold' } }}>
          Create File
        </Link>
        <Link to="/about" activeProps={{ style: { fontWeight: 'bold' } }}>
          About
        </Link>
      </nav>
      <Outlet />
    </>
  ),
})
