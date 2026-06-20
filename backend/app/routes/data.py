from flask import Blueprint, jsonify, request
from app.data.ingestion import ingest_stock, ingest_universe
from app.data.universe import UNIVERSE

data_bp = Blueprint("data", __name__, url_prefix="/api/data")


@data_bp.post("/ingest")
def ingest():
    """
    Ingest one or more stocks.
    Body (optional): { "symbols": ["RELIANCE", "TCS"], "price_start": "2015-01-01" }
    Omit symbols to ingest the full universe (slow — runs ~140 stocks).
    """
    body = request.get_json(silent=True) or {}
    symbols = body.get("symbols") or None
    price_start = body.get("price_start", "2015-01-01")
    results = ingest_universe(symbols, price_start=price_start)
    ok = [r for r in results if not r["error"]]
    failed = [r for r in results if r["error"]]
    return jsonify({"ingested": len(ok), "failed": len(failed), "results": results})


@data_bp.get("/universe")
def universe():
    return jsonify({"count": len(UNIVERSE), "symbols": UNIVERSE})
