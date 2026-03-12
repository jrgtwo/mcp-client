import { useDateTime } from './hooks/useDateTime'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DateTime() {
  const { timezone, setTimezone, result, loading, error, getDateTime, handleKeyDown } = useDateTime()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold">Date & Time</h1>

      <div className="flex gap-2">
        <Input
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="IANA timezone (e.g. America/New_York)"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => void getDateTime()} disabled={loading}>
          {loading ? '...' : 'Get'}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground -mt-4">
        Leave blank or enter <code>UTC</code> for UTC. Examples: <code>Europe/London</code>, <code>Asia/Tokyo</code>, <code>America/Chicago</code>
      </p>

      {error && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl bg-muted px-4 py-3 text-sm font-mono">
          {result}
        </div>
      )}
    </div>
  )
}
