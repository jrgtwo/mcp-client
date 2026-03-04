import { useFetchUrl } from './hooks/useFetchUrl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function FetchUrl() {
  const {
    url, setUrl,
    maxChars, setMaxChars,
    result, loading, error, fetchUrl, handleKeyDown,
  } = useFetchUrl()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold">Fetch URL</h1>

      <div className="flex gap-2">
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => void fetchUrl()} disabled={loading || !url.trim()}>
          {loading ? '...' : 'Fetch'}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <label htmlFor="max-chars">Max chars</label>
        <Input
          id="max-chars"
          type="number"
          min={500}
          max={20000}
          step={500}
          value={maxChars}
          onChange={e => setMaxChars(Number(e.target.value))}
          disabled={loading}
          className="w-24"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Fetching...</p>}

      {error && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-3 text-sm">{error}</div>
      )}

      {result && (
        <pre className="rounded-xl bg-muted px-4 py-3 text-sm whitespace-pre-wrap font-sans">{result}</pre>
      )}
    </div>
  )
}
