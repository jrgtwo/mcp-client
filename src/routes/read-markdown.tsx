import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import ReadMarkdown from '../ReadMarkdown'

export const readMarkdownRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/read-markdown',
  component: ReadMarkdown,
})
