import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import FetchUrl from '../FetchUrl'

export const fetchUrlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fetch-url',
  component: FetchUrl,
})
