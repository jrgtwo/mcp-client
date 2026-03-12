import { useStockPrice } from './hooks/useStockPrice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function StockPrice() {
  const { ticker, setTicker, result, loading, error, getStockPrice, handleKeyDown } = useStockPrice()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold">Stock Price</h1>

      <div className="flex gap-2">
        <Input
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ticker symbol (e.g. AAPL, BTC-USD)"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={() => void getStockPrice()} disabled={loading || !ticker.trim()}>
          {loading ? '...' : 'Get'}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/15 text-destructive px-4 py-3 text-sm">{error}</div>
      )}

      {result && (
        <pre className="rounded-xl bg-muted px-4 py-3 text-sm whitespace-pre-wrap font-sans">{result}</pre>
      )}
    </div>
  )
}
