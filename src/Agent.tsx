import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAgent } from './hooks/useAgent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Agent() {
  const { goal, setGoal, maxSteps, setMaxSteps, result, loading, error, runAgent, handleKeyDown } = useAgent()

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
