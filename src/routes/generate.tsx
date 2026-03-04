import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Generate from '../Generate'

export const generateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/generate',
  component: Generate,
})
