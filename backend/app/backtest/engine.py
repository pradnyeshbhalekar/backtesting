import logging
from datetime import date
from dateutil.relativedelta import relativedelta

import pandas as pd
from sqlalchemy import text

from app.config.db import SessionLocal
from app.backtest.filters import apply_filters
from app.backtest.ranking import rank_stocks
from app.backtest.sizing import compute_weights

logger = logging.getLogger(__name__)

FREQ_MAP = {
    "monthly": relativedelta(months=1),
    "quarterly": relativedelta(months=3),
    "half_yearly": relativedelta(months=6),
    "yearly": relativedelta(years=1),
}


def _rebalance_dates(start: date, end: date, frequency: str) -> list[date]:
    delta = FREQ_MAP.get(frequency, relativedelta(months=3))
    dates, d = [], start
    while d < end:
        dates.append(d)
        d += delta
    return dates


def _load_fundamentals(db) -> pd.DataFrame:
    """
    Load the latest fundamental snapshot per stock.
    yfinance only provides current fundamentals (not historical), so we use
    the single available snapshot for all rebalance dates.
    """
    sql = text("""
        SELECT DISTINCT ON (s.symbol)
            s.symbol, s.id AS stock_id,
            f.market_cap, f.roce, f.roe, f.roa, f.pe_ratio, f.pb_ratio,
            f.pat, f.revenue, f.ebitda, f.total_debt, f.free_cash_flow,
            f.net_profit_margin, f.operating_margin, f.revenue_growth_yoy, f.pat_growth_yoy
        FROM stock_fundamentals f
        JOIN stocks s ON s.id = f.stock_id
        ORDER BY s.symbol, f.period_date DESC
    """)
    rows = db.execute(sql).mappings().all()
    return pd.DataFrame(rows)


def _load_prices(db, symbols: list[str], start: date, end: date) -> pd.DataFrame:
    sql = text("""
        SELECT s.symbol, p.date, p.adjusted_close
        FROM stock_prices p
        JOIN stocks s ON s.id = p.stock_id
        WHERE s.symbol = ANY(:symbols)
          AND p.date BETWEEN :start AND :end
        ORDER BY p.date
    """)
    rows = db.execute(sql, {"symbols": symbols, "start": start, "end": end}).mappings().all()
    return pd.DataFrame(rows)


def _period_returns(prices_df: pd.DataFrame, symbols: list[str], start: date, end: date) -> pd.Series:
    """Return per-stock return between start and end using adjusted close prices."""
    sub = prices_df[(prices_df["date"] >= start) & (prices_df["date"] <= end)]
    returns = {}
    for sym in symbols:
        s = sub[sub["symbol"] == sym].sort_values("date")
        if len(s) < 2:
            returns[sym] = 0.0
            continue
        returns[sym] = (s.iloc[-1]["adjusted_close"] / s.iloc[0]["adjusted_close"]) - 1
    return pd.Series(returns)


def run_backtest(config: dict) -> dict:
    start = date.fromisoformat(config["start_date"])
    end = date.fromisoformat(config["end_date"])
    frequency = config.get("rebalance_frequency", "quarterly")
    portfolio_size = int(config.get("portfolio_size", 20))
    initial_capital = float(config.get("initial_capital", 1_000_000))
    filters = config.get("filters", {})
    ranking = config.get("ranking", [{"metric": "roe", "ascending": False}])
    sizing_method = config.get("sizing", "equal")
    sizing_metric = config.get("sizing_metric")

    rebalance_dates = _rebalance_dates(start, end, frequency)
    db = SessionLocal()

    try:
        all_symbols = [r[0] for r in db.execute(text("SELECT symbol FROM stocks")).fetchall()]
        prices_df = _load_prices(db, all_symbols, start, end)
        prices_df["date"] = pd.to_datetime(prices_df["date"]).dt.date

        fundamentals = _load_fundamentals(db)
        capital = initial_capital
        equity_curve = []
        portfolio_log = []

        for i, rebal_date in enumerate(rebalance_dates):
            next_date = rebalance_dates[i + 1] if i + 1 < len(rebalance_dates) else end
            if fundamentals.empty:
                equity_curve.append({"date": rebal_date.isoformat(), "value": round(capital, 2)})
                continue

            filtered = apply_filters(fundamentals, filters)
            if filtered.empty:
                equity_curve.append({"date": rebal_date.isoformat(), "value": round(capital, 2)})
                continue

            selected = rank_stocks(filtered, ranking, portfolio_size)
            weights = compute_weights(selected, sizing_method, sizing_metric)

            symbols_held = selected["symbol"].tolist()
            period_rets = _period_returns(prices_df, symbols_held, rebal_date, next_date)

            portfolio_return = (weights * period_rets.reindex(weights.index).fillna(0)).sum()
            capital *= (1 + portfolio_return)

            portfolio_log.append({
                "rebalance_date": rebal_date.isoformat(),
                "portfolio_return_pct": round(portfolio_return * 100, 4),
                "capital_after": round(capital, 2),
                "holdings": [
                    {
                        "symbol": sym,
                        "weight": round(float(weights.get(sym, 0)), 4),
                        "return_pct": round(float(period_rets.get(sym, 0)) * 100, 4),
                    }
                    for sym in symbols_held
                ],
            })

            equity_curve.append({"date": rebal_date.isoformat(), "value": round(capital, 2)})

        from app.backtest.metrics import calculate_metrics, top_performers
        metrics = calculate_metrics(equity_curve, initial_capital)
        performers = top_performers(portfolio_log)

        return {
            "initial_capital": initial_capital,
            "final_capital": round(capital, 2),
            "equity_curve": equity_curve,
            "portfolio_log": portfolio_log,
            **metrics,
            **performers,
        }

    finally:
        db.close()
