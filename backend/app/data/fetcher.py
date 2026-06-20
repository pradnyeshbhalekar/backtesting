import time
import logging
import yfinance as yf
import pandas as pd

logger = logging.getLogger(__name__)

_INR_CRORE = 1e7  # 1 crore = 10 million


def _ticker(symbol: str) -> yf.Ticker:
    return yf.Ticker(f"{symbol}.NS")


def fetch_prices(symbol: str, start: str, end: str) -> pd.DataFrame:
    """Return daily OHLCV dataframe for symbol between start and end dates."""
    try:
        df = _ticker(symbol).history(start=start, end=end, auto_adjust=True)
        if df.empty:
            return pd.DataFrame()
        # yfinance >=1.0 may return MultiIndex columns; flatten to single level
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        df = df[["Open", "High", "Low", "Close", "Volume"]].copy()
        df.columns = ["open", "high", "low", "close", "volume"]
        df["adjusted_close"] = df["close"]
        df.index = pd.to_datetime(df.index).date
        df.index.name = "date"
        return df.dropna(subset=["close"])
    except Exception as e:
        logger.warning("Price fetch failed for %s: %s", symbol, e)
        return pd.DataFrame()


def fetch_fundamentals(symbol: str) -> dict | None:
    """Return a flat dict of fundamental metrics for the latest fiscal year."""
    try:
        t = _ticker(symbol)
        info = t.info or {}

        def _crore(v):
            return round(v / _INR_CRORE, 2) if v else None

        def _pct(v):
            return round(v * 100, 2) if v else None

        market_cap = _crore(info.get("marketCap"))
        total_assets = _crore(info.get("totalAssets"))
        current_liab = _crore(info.get("currentLiabilities") or info.get("totalCurrentLiabilities"))
        total_debt = _crore(info.get("totalDebt"))
        ebit = _crore(info.get("ebit"))
        pat = _crore(info.get("netIncomeToCommon"))
        revenue = _crore(info.get("totalRevenue"))
        ebitda = _crore(info.get("ebitda"))
        equity = _crore(info.get("bookValue") and info.get("sharesOutstanding") and
                        info.get("bookValue") * info.get("sharesOutstanding"))
        ocf = _crore(info.get("operatingCashflow"))
        capex = _crore(info.get("capitalExpenditures"))

        # ROCE = EBIT / (Total Assets - Current Liabilities)
        roce = None
        if ebit and total_assets and current_liab:
            cap_employed = total_assets - current_liab
            roce = round(ebit / cap_employed * 100, 2) if cap_employed else None

        fcf = None
        if ocf is not None and capex is not None:
            fcf = round(ocf - abs(capex), 2)

        return {
            "market_cap": market_cap,
            "pe_ratio": info.get("trailingPE"),
            "pb_ratio": info.get("priceToBook"),
            "ev_ebitda": info.get("enterpriseToEbitda"),
            "dividend_yield": _pct(info.get("dividendYield")),
            "roce": roce,
            "roe": _pct(info.get("returnOnEquity")),
            "roa": _pct(info.get("returnOnAssets")),
            "net_profit_margin": _pct(info.get("profitMargins")),
            "operating_margin": _pct(info.get("operatingMargins")),
            "gross_margin": _pct(info.get("grossMargins")),
            "revenue": revenue,
            "ebitda": ebitda,
            "ebit": ebit,
            "pat": pat,
            "total_assets": total_assets,
            "total_debt": total_debt,
            "current_liabilities": current_liab,
            "shareholders_equity": equity,
            "cash_and_equivalents": _crore(info.get("totalCash")),
            "operating_cash_flow": ocf,
            "capex": capex,
            "free_cash_flow": fcf,
            "revenue_growth_yoy": _pct(info.get("revenueGrowth")),
            "pat_growth_yoy": _pct(info.get("earningsGrowth")),
            "name": info.get("longName") or info.get("shortName"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
        }
    except Exception as e:
        logger.warning("Fundamentals fetch failed for %s: %s", symbol, e)
        return None


def fetch_all_fundamentals(symbols: list[str], delay: float = 0.5) -> dict[str, dict]:
    """Fetch fundamentals for a list of symbols with a small delay to avoid rate limits."""
    results = {}
    for sym in symbols:
        data = fetch_fundamentals(sym)
        if data:
            results[sym] = data
        time.sleep(delay)
    return results
