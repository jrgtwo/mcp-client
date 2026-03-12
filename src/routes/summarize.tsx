import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Summarize from '../Summarize'

export const summarizeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/summarize',
  component: Summarize,
})
