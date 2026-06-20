import logging
from datetime import date, datetime
from sqlalchemy.dialects.postgresql import insert

from app.config.db import SessionLocal
from app.models.stock import Stock
from app.models.price import StockPrice
from app.models.fundamentals import StockFundamentals
from app.data.fetcher import fetch_prices, fetch_fundamentals
from app.data.universe import UNIVERSE

logger = logging.getLogger(__name__)


def _upsert_stock(db, symbol: str, meta: dict) -> int:
    stmt = (
        insert(Stock)
        .values(
            symbol=symbol,
            name=meta.get("name"),
            sector=meta.get("sector"),
            industry=meta.get("industry"),
        )
        .on_conflict_do_update(
            index_elements=["symbol"],
            set_={"name": meta.get("name"), "sector": meta.get("sector"), "industry": meta.get("industry")},
        )
        .returning(Stock.id)
    )
    result = db.execute(stmt)
    db.commit()
    return result.scalar_one()


def _upsert_prices(db, stock_id: int, df):
    if df.empty:
        return 0
    rows = [
        {
            "stock_id": stock_id,
            "date": idx,
            "open": row["open"],
            "high": row["high"],
            "low": row["low"],
            "close": row["close"],
            "volume": int(row["volume"]) if row["volume"] else None,
            "adjusted_close": row["adjusted_close"],
        }
        for idx, row in df.iterrows()
    ]
    stmt = (
        insert(StockPrice)
        .values(rows)
        .on_conflict_do_nothing(constraint="uq_stock_price_date")
    )
    db.execute(stmt)
    db.commit()
    return len(rows)


def _upsert_fundamentals(db, stock_id: int, data: dict):
    period = date(datetime.now().year, 3, 31)  # treat as latest fiscal year-end
    fundamental_fields = {k: v for k, v in data.items() if k not in ("name", "sector", "industry")}
    stmt = (
        insert(StockFundamentals)
        .values(stock_id=stock_id, period_date=period, period_type="annual", **fundamental_fields)
        .on_conflict_do_update(
            constraint="uq_stock_fundamental_period",
            set_=fundamental_fields,
        )
    )
    db.execute(stmt)
    db.commit()


def ingest_stock(symbol: str, price_start: str = "2015-01-01", price_end: str | None = None) -> dict:
    price_end = price_end or date.today().isoformat()
    db = SessionLocal()
    result = {"symbol": symbol, "prices": 0, "fundamentals": False, "error": None}
    try:
        fund = fetch_fundamentals(symbol)
        if not fund:
            result["error"] = "fundamentals unavailable"
            return result

        stock_id = _upsert_stock(db, symbol, fund)
        result["fundamentals"] = True

        df = fetch_prices(symbol, price_start, price_end)
        result["prices"] = _upsert_prices(db, stock_id, df)
        _upsert_fundamentals(db, stock_id, fund)

    except Exception as e:
        db.rollback()
        logger.exception("Ingestion failed for %s", symbol)
        result["error"] = str(e)
    finally:
        db.close()
    return result


def ingest_universe(symbols: list[str] | None = None, price_start: str = "2015-01-01") -> list[dict]:
    symbols = symbols or UNIVERSE
    results = []
    for sym in symbols:
        logger.info("Ingesting %s", sym)
        results.append(ingest_stock(sym, price_start=price_start))
    return results
