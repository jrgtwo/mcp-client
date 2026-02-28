import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Chat from '../Chat'

export const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: Chat,
})
