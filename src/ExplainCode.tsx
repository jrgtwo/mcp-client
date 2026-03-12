import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useExplainCode } from './hooks/useExplainCode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const LANGUAGES = ['python', 'typescript', 'javascript', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'bash', 'sql', 'other']

export default function ExplainCode() {
  const {
    code, setCode,
    language, setLanguage,
    level, setLevel,
    maxNewTokens, setMaxNewTokens,
    result, loading, error, explainCode,
  } = useExplainCode()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Explain Code</h1>

      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Paste code to explain..."
        disabled={loading}
        rows={10}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <label htmlFor="ec-language">Language</label>
          <select
            id="ec-language"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            disabled={loading}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="ec-level">Level</label>
          <select
            id="ec-level"
            value={level}
            onChange={e => setLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
            disabled={loading}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="ec-max-tokens">Max tokens</label>
          <Input
            id="ec-max-tokens"
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
        <Button onClick={() => void explainCode()} disabled={loading || !code.trim()}>
          {loading ? 'Explaining...' : 'Explain'}
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
              h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold mb-1.5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              pre: ({ children }) => <>{children}</>,
              code: ({ className, children }) => {
                const match = /language-(\w+)/.exec(className ?? '')
                return match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ borderRadius: '0.375rem', fontSize: '0.75rem', marginBottom: '0.5rem' }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-black/20 rounded px-1 py-0.5 text-xs font-mono">{children}</code>
                )
              },
              blockquote: ({ children }) => <blockquote className="border-l-2 border-current pl-3 opacity-75 mb-2">{children}</blockquote>,
            }}
          >
            {result}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
