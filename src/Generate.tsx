import { useGenerate } from './hooks/useGenerate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Generate() {
  const {
    prompt, setPrompt,
    maxNewTokens, setMaxNewTokens,
    temperature, setTemperature,
    result, loading, error, generate, handleKeyDown,
  } = useGenerate()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold">Generate</h1>

      <div className="flex flex-col gap-2">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt to continue (e.g. The capital of France is)"
          disabled={loading}
          rows={4}
          className="resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button onClick={() => void generate()} disabled={loading || !prompt.trim()}>
          {loading ? '...' : 'Generate'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <label htmlFor="max-new-tokens">Max tokens</label>
          <Input
            id="max-new-tokens"
            type="number"
            min={64}
            max={4096}
            step={64}
            value={maxNewTokens}
            onChange={e => setMaxNewTokens(Number(e.target.value))}
            disabled={loading}
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="temperature">Temperature</label>
          <Input
            id="temperature"
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={e => setTemperature(Number(e.target.value))}
            disabled={loading}
            className="w-20"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Enter to generate · Shift+Enter for new line</p>

      {loading && <p className="text-sm text-muted-foreground">Generating...</p>}

      {error && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-3 text-sm">{error}</div>
      )}

      {result && (
        <pre className="rounded-xl bg-muted px-4 py-3 text-sm whitespace-pre-wrap font-sans">{result}</pre>
      )}
    </div>
  )
}
