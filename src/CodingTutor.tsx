import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useCodingTutor } from './hooks/useCodingTutor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function CodingTutor() {
  const {
    messages, input, setInput,
    maxSteps, setMaxSteps,
    maxNewTokens, setMaxNewTokens,
    maxHistoryPairs, setMaxHistoryPairs,
    summaryStrategy, setSummaryStrategy,
    loading, send, handleKeyDown, bottomRef,
  } = useCodingTutor()

  return (
    <div className="flex flex-col h-[calc(100vh-105px)]">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-2">
          {messages.length === 0 && (
            <p className="text-muted-foreground text-center mt-8">
              Ask a coding question or paste code to explain/review...
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-xl text-sm break-words ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground whitespace-pre-wrap'
                    : 'bg-muted text-foreground'
                }`}
              >
                {msg.role === 'user' ? msg.content : (
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
                      a: ({ href, children }) => <a href={href} className="underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                      hr: () => <hr className="border-current opacity-25 my-2" />,
                      table: ({ children }) => <table className="border-collapse text-xs mb-2 w-full">{children}</table>,
                      th: ({ children }) => <th className="border border-current/30 px-2 py-1 font-semibold bg-black/10">{children}</th>,
                      td: ({ children }) => <td className="border border-current/30 px-2 py-1">{children}</td>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-sm">
                Tutor is thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-2 p-3 border-t">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a coding question or paste code to explain/review... (Ctrl+Enter to send)"
            disabled={loading}
            rows={4}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          />
          <Button onClick={() => void send()} disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <label htmlFor="ct-max-steps">Max steps</label>
            <Input
              id="ct-max-steps"
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
            <label htmlFor="ct-max-new-tokens">Max tokens</label>
            <Input
              id="ct-max-new-tokens"
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
            <label htmlFor="ct-max-history-pairs">History pairs</label>
            <Input
              id="ct-max-history-pairs"
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
            <label htmlFor="ct-summary-strategy">Summary</label>
            <select
              id="ct-summary-strategy"
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
      </div>
    </div>
  )
}
