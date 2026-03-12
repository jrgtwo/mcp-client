import { useCreateFile } from './hooks/useCreateFile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CreateFile() {
  const {
    fileName, setFileName,
    content, setContent,
    directory, setDirectory,
    encoding, setEncoding,
    overwrite, setOverwrite,
    result, loading, error, createFile,
  } = useCreateFile()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold">Create File</h1>

      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <label htmlFor="cf-name" className="text-muted-foreground whitespace-nowrap">File name</label>
          <Input
            id="cf-name"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            placeholder="notes.md"
            disabled={loading}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <label htmlFor="cf-dir" className="text-muted-foreground whitespace-nowrap">Directory</label>
          <Input
            id="cf-dir"
            value={directory}
            onChange={e => setDirectory(e.target.value)}
            placeholder="src (optional)"
            disabled={loading}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="cf-encoding" className="text-muted-foreground">Encoding</label>
          <select
            id="cf-encoding"
            value={encoding}
            onChange={e => setEncoding(e.target.value)}
            disabled={loading}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            <option value="utf-8">utf-8</option>
            <option value="ascii">ascii</option>
            <option value="utf-16">utf-16</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={overwrite}
            onChange={e => setOverwrite(e.target.checked)}
            disabled={loading}
          />
          Overwrite if exists
        </label>
      </div>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="File content..."
        disabled={loading}
        rows={12}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
      />

      <Button onClick={() => void createFile()} disabled={loading || !fileName.trim()} className="self-start">
        {loading ? 'Creating...' : 'Create File'}
      </Button>

      {error && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-3 text-sm">{error}</div>
      )}

      {result && (
        <div className={`rounded-xl px-4 py-3 text-sm ${result.success ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-destructive/15 text-destructive'}`}>
          <p className="font-medium">{result.message}</p>
          {result.file_path && (
            <p className="mt-1 font-mono text-xs opacity-75">{result.file_path}</p>
          )}
          {result.error && <p className="mt-1 text-xs">{result.error}</p>}
        </div>
      )}
    </div>
  )
}
