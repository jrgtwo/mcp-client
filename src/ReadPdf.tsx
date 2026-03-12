import { useReadPdf } from './hooks/useReadPdf'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ReadPdf() {
  const { filePath, setFilePath, maxChars, setMaxChars, result, loading, error, readPdf, handleKeyDown } = useReadPdf()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Read PDF</h1>

      <div className="flex gap-2">
        <Input
          value={filePath}
          onChange={e => setFilePath(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Absolute path to PDF (e.g. C:/Users/you/docs/report.pdf)"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => void readPdf()} disabled={loading || !filePath.trim()}>
          {loading ? '...' : 'Read'}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground -mt-4">
        <label htmlFor="pdf-max-chars">Max chars</label>
        <Input
          id="pdf-max-chars"
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
        <div className="rounded-xl bg-muted px-4 py-3 text-sm font-mono whitespace-pre-wrap break-words max-h-[60vh] overflow-y-auto">
          {result}
        </div>
      )}
    </div>
  )
}
