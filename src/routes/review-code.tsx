import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import ReviewCode from '../ReviewCode'

export const reviewCodeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/review-code',
  component: ReviewCode,
})
