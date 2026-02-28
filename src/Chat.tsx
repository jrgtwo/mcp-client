import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChat } from './hooks/useChat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Chat() {
  const { messages, input, setInput, loading, send, handleKeyDown, bottomRef } = useChat()

  return (
    <div className="flex flex-col h-[calc(100vh-105px)]">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-2">
          {messages.length === 0 && (
            <p className="text-muted-foreground text-center mt-8">
              Send a message to start chatting.
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
                      pre: ({ children }) => <pre className="bg-black/20 rounded p-2 text-xs font-mono overflow-x-auto mb-2 whitespace-pre">{children}</pre>,
                      code: ({ className, children }) => className
                        ? <code className={className}>{children}</code>
                        : <code className="bg-black/20 rounded px-1 py-0.5 text-xs font-mono">{children}</code>,
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
                ...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2 p-3 border-t">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => void send()} disabled={loading || !input.trim()}>
          Send
        </Button>
      </div>
    </div>
  )
}
