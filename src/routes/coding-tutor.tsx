import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import CodingTutor from '../CodingTutor'

export const codingTutorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coding-tutor',
  component: CodingTutor,
})
