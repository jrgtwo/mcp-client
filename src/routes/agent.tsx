import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Agent from '../Agent'

export const agentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/agent',
  component: Agent,
})
