import type { BacktestConfig, BacktestResult } from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export async function runBacktest(config: BacktestConfig): Promise<BacktestResult> {
  const res = await fetch(`${BASE_URL}/api/backtest/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json()
}
