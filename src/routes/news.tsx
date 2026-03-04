import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import News from '../News'

export const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: News,
})
