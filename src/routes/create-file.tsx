import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import CreateFile from '../CreateFile'

export const createFileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-file',
  component: CreateFile,
})
