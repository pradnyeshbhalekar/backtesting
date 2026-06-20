import numpy as np
import pandas as pd


def calculate_metrics(equity_curve: list[dict], initial_capital: float) -> dict:
    if len(equity_curve) < 2:
        return {}

    values = pd.Series([p["value"] for p in equity_curve])
    dates = pd.DatetimeIndex(pd.to_datetime([p["date"] for p in equity_curve]))

    years = (dates[-1] - dates[0]).days / 365.25
    cagr = ((values.iloc[-1] / values.iloc[0]) ** (1 / years) - 1) * 100 if years > 0 else 0

    period_returns = values.pct_change().dropna()
    volatility = period_returns.std() * np.sqrt(len(period_returns) / years) * 100 if years > 0 else 0

    risk_free = 6.5  # approximate Indian risk-free rate (%)
    sharpe = (cagr - risk_free) / volatility if volatility > 0 else 0

    rolling_max = values.cummax()
    drawdown_series = ((values - rolling_max) / rolling_max) * 100
    max_drawdown = drawdown_series.min()

    total_return = ((values.iloc[-1] - initial_capital) / initial_capital) * 100

    return {
        "cagr": round(cagr, 2),
        "total_return_pct": round(total_return, 2),
        "sharpe_ratio": round(sharpe, 2),
        "max_drawdown_pct": round(max_drawdown, 2),
        "volatility_pct": round(volatility, 2),
        "drawdown_series": [
            {"date": pd.Timestamp(d).date().isoformat(), "drawdown": round(v, 2)}
            for d, v in zip(dates, drawdown_series)
        ],
    }


def top_performers(portfolio_log: list[dict], n: int = 5) -> dict:
    stock_returns: dict[str, list[float]] = {}
    for period in portfolio_log:
        for h in period["holdings"]:
            stock_returns.setdefault(h["symbol"], []).append(h["return_pct"])

    avg_returns = {sym: round(sum(rets) / len(rets), 4) for sym, rets in stock_returns.items()}
    sorted_stocks = sorted(avg_returns.items(), key=lambda x: x[1], reverse=True)

    return {
        "top_winners": [{"symbol": s, "avg_return_pct": r} for s, r in sorted_stocks[:n]],
        "top_losers": [{"symbol": s, "avg_return_pct": r} for s, r in sorted_stocks[-n:]],
    }
