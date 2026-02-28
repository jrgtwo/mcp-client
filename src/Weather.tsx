import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useWeather } from './hooks/useWeather'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Weather() {
  const { location, setLocation, units, setUnits, result, loading, error, getWeather, handleKeyDown } = useWeather()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold">Weather</h1>

      <div className="flex gap-2">
        <Input
          value={location}
          onChange={e => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="City or region (e.g. Tokyo)"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => void getWeather()} disabled={loading || !location.trim()}>
          {loading ? '...' : 'Get'}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={units === 'metric' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUnits('metric')}
        >
          °C / km/h
        </Button>
        <Button
          variant={units === 'imperial' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUnits('imperial')}
        >
          °F / mph
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl bg-muted px-4 py-3 text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            }}
          >
            {result}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
