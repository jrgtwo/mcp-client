import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import ExplainCode from '../ExplainCode'

export const explainCodeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explain-code',
  component: ExplainCode,
})
