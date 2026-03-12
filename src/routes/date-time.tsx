import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import DateTime from '../DateTime'

export const dateTimeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/date-time',
  component: DateTime,
})
