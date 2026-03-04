import { useNews } from './hooks/useNews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const COUNTRIES = [
  { code: 'us', label: 'US' },
  { code: 'gb', label: 'UK' },
  { code: 'au', label: 'AU' },
  { code: 'ca', label: 'CA' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
]

export default function News() {
  const {
    topic, setTopic,
    country, setCountry,
    maxResults, setMaxResults,
    result, loading, error, fetchNews, handleKeyDown,
  } = useNews()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold">News Headlines</h1>

      <div className="flex gap-2">
        <Input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Topic (e.g. AI, climate change) — blank for top headlines"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => void fetchNews()} disabled={loading}>
          {loading ? '...' : 'Fetch'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={country}
            onChange={e => setCountry(e.target.value)}
            disabled={loading}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="max-results">Results</label>
          <Input
            id="max-results"
            type="number"
            min={1}
            max={10}
            value={maxResults}
            onChange={e => setMaxResults(Number(e.target.value))}
            disabled={loading}
            className="w-16"
          />
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Fetching headlines...</p>}

      {error && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-3 text-sm">{error}</div>
      )}

      {result && (
        <pre className="rounded-xl bg-muted px-4 py-3 text-sm whitespace-pre-wrap font-sans">{result}</pre>
      )}
    </div>
  )
}
