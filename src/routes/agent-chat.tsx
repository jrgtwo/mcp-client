import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import AgentChat from '../AgentChat'

export const agentChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/agent-chat',
  component: AgentChat,
})
