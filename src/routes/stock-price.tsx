import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import StockPrice from '../StockPrice'

export const stockPriceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stock-price',
  component: StockPrice,
})
