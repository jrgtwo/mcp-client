import { useSummarize } from './hooks/useSummarize'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Summarize() {
  const { text, setText, focus, setFocus, maxLength, setMaxLength, result, loading, error, summarize } = useSummarize()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Summarize Text</h1>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste text to summarize..."
        disabled={loading}
        rows={10}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 flex-1 min-w-40">
          <label htmlFor="sum-focus">Focus</label>
          <Input
            id="sum-focus"
            value={focus}
            onChange={e => setFocus(e.target.value)}
            placeholder="e.g. key risks, action items"
            disabled={loading}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sum-max-length">Max tokens</label>
          <Input
            id="sum-max-length"
            type="number"
            min={50}
            max={1000}
            step={50}
            value={maxLength}
            onChange={e => setMaxLength(Number(e.target.value))}
            disabled={loading}
            className="w-24"
          />
        </div>
        <Button onClick={() => void summarize()} disabled={loading || !text.trim()}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-3 text-sm">{error}</div>
      )}

      {result && (
        <div className="rounded-xl bg-muted px-4 py-3 text-sm whitespace-pre-wrap">{result}</div>
      )}
    </div>
  )
}
