import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { aboutRoute } from './routes/about'
import { chatRoute } from './routes/chat'
import { weatherRoute } from './routes/weather'

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, chatRoute, weatherRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
