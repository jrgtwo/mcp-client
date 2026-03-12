import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import ReadPdf from '../ReadPdf'

export const readPdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/read-pdf',
  component: ReadPdf,
})
