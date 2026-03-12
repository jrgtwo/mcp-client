import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { aboutRoute } from './routes/about'
import { chatRoute } from './routes/chat'
import { weatherRoute } from './routes/weather'
import { agentRoute } from './routes/agent'
import { agentChatRoute } from './routes/agent-chat'
import { codingTutorRoute } from './routes/coding-tutor'
import { newsRoute } from './routes/news'
import { generateRoute } from './routes/generate'
import { fetchUrlRoute } from './routes/fetch-url'
import { dateTimeRoute } from './routes/date-time'
import { readPdfRoute } from './routes/read-pdf'
import { readMarkdownRoute } from './routes/read-markdown'
import { explainCodeRoute } from './routes/explain-code'
import { reviewCodeRoute } from './routes/review-code'
import { stockPriceRoute } from './routes/stock-price'
import { summarizeRoute } from './routes/summarize'
import { createFileRoute } from './routes/create-file'

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, chatRoute, weatherRoute, agentRoute, agentChatRoute, codingTutorRoute, newsRoute, generateRoute, fetchUrlRoute, dateTimeRoute, readPdfRoute, readMarkdownRoute, explainCodeRoute, reviewCodeRoute, stockPriceRoute, summarizeRoute, createFileRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
