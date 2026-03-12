import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useReadMarkdown } from './hooks/useReadMarkdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ReadMarkdown() {
  const { filePath, setFilePath, maxChars, setMaxChars, result, loading, error, readMarkdown, handleKeyDown } = useReadMarkdown()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Read Markdown</h1>

      <div className="flex gap-2">
        <Input
          value={filePath}
          onChange={e => setFilePath(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Absolute path to .md file (e.g. C:/Users/you/docs/notes.md)"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => void readMarkdown()} disabled={loading || !filePath.trim()}>
          {loading ? '...' : 'Read'}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground -mt-4">
        <label htmlFor="md-max-chars">Max chars</label>
        <Input
          id="md-max-chars"
          type="number"
          min={100}
          max={50000}
          step={1000}
          value={maxChars}
          onChange={e => setMaxChars(Number(e.target.value))}
          disabled={loading}
          className="w-28"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl bg-muted px-4 py-3 text-sm max-h-[60vh] overflow-y-auto">
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
              blockquote: ({ children }) => <blockquote className="border-l-2 border-current pl-3 opacity-75 mb-2">{children}</blockquote>,
              a: ({ href, children }) => <a href={href} className="underline" target="_blank" rel="noopener noreferrer">{children}</a>,
              table: ({ children }) => <table className="border-collapse text-xs mb-2 w-full">{children}</table>,
              th: ({ children }) => <th className="border border-current/30 px-2 py-1 font-semibold bg-black/10">{children}</th>,
              td: ({ children }) => <td className="border border-current/30 px-2 py-1">{children}</td>,
            }}
          >
            {result}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
