import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Weather from '../Weather'

export const weatherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/weather',
  component: Weather,
})
