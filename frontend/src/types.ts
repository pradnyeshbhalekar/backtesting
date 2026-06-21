export interface Filters {
  market_cap_min?: number
  market_cap_max?: number
  roce_min?: number
  roe_min?: number
  pe_max?: number
  pat_min?: number
}

export interface RankingRule {
  metric: string
  ascending: boolean
}

export interface BacktestConfig {
  start_date: string
  end_date: string
  rebalance_frequency?: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly'
  portfolio_size?: number
  initial_capital?: number
  sizing_method?: 'equal' | 'market_cap' | 'metric'
  sizing_metric?: string
  filters?: Filters
  ranking?: RankingRule[]
}

export interface Holding {
  symbol: string
  weight: number
  return_pct: number
}

export interface RebalancePeriod {
  rebalance_date: string
  portfolio_return_pct: number
  capital_after: number
  holdings: Holding[]
}

export interface Performer {
  symbol: string
  avg_return_pct: number
}

export interface BacktestResult {
  initial_capital: number
  final_capital: number
  cagr: number
  total_return_pct: number
  sharpe_ratio: number
  max_drawdown_pct: number
  volatility_pct: number
  equity_curve: { date: string; value: number }[]
  benchmark_curve?: { date: string; value: number }[]
  drawdown_series: { date: string; drawdown: number }[]
  portfolio_log: RebalancePeriod[]
  top_winners: Performer[]
  top_losers: Performer[]
}
