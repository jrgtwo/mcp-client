import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { aboutRoute } from './routes/about'
import { chatRoute } from './routes/chat'
import { weatherRoute } from './routes/weather'
import { agentRoute } from './routes/agent'
import { agentChatRoute } from './routes/agent-chat'

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, chatRoute, weatherRoute, agentRoute, agentChatRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
