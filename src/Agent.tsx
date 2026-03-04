import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAgent } from './hooks/useAgent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Agent() {
  const {
    goal, setGoal,
    maxSteps, setMaxSteps,
    maxNewTokens, setMaxNewTokens,
    maxHistoryPairs, setMaxHistoryPairs,
    summaryStrategy, setSummaryStrategy,
    pdfFile, setPdfFile,
    result, loading, error, runAgent, handleKeyDown,
  } = useAgent()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold">Agent</h1>

      <div className="flex gap-2">
        <Input
          value={goal}
          onChange={e => setGoal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a goal (e.g. What should I wear in Paris today?)"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => void runAgent()} disabled={loading || !goal.trim()}>
          {loading ? '...' : 'Run'}
        </Button>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <label htmlFor="pdf-upload">PDF (optional)</label>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          disabled={loading}
          onChange={e => setPdfFile(e.target.files?.[0] ?? null)}
          className="text-sm file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:font-medium file:cursor-pointer disabled:opacity-50"
        />
        {pdfFile && (
          <button
            onClick={() => setPdfFile(null)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Clear PDF"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <label htmlFor="max-steps">Max steps</label>
          <Input
            id="max-steps"
            type="number"
            min={1}
            max={20}
            value={maxSteps}
            onChange={e => setMaxSteps(Number(e.target.value))}
            disabled={loading}
            className="w-20"
          />
        </div>
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
          <label htmlFor="max-history-pairs">History pairs</label>
          <Input
            id="max-history-pairs"
            type="number"
            min={1}
            max={20}
            value={maxHistoryPairs}
            onChange={e => setMaxHistoryPairs(Number(e.target.value))}
            disabled={loading}
            className="w-20"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="summary-strategy">Summary</label>
          <select
            id="summary-strategy"
            value={summaryStrategy}
            onChange={e => setSummaryStrategy(e.target.value as 'deterministic' | 'llm')}
            disabled={loading}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            <option value="deterministic">Deterministic</option>
            <option value="llm">LLM</option>
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Running agent...</p>
      )}

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
              h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold mb-1.5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              pre: ({ children }) => <pre className="bg-black/20 rounded p-2 text-xs font-mono overflow-x-auto mb-2 whitespace-pre">{children}</pre>,
              code: ({ className, children }) => className
                ? <code className={className}>{children}</code>
                : <code className="bg-black/20 rounded px-1 py-0.5 text-xs font-mono">{children}</code>,
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
