from flask import Blueprint, jsonify, request
from app.backtest.engine import run_backtest

backtest_bp = Blueprint("backtest", __name__, url_prefix="/api/backtest")


@backtest_bp.post("/run")
def run():
    config = request.get_json(silent=True)
    if not config:
        return jsonify({"error": "request body required"}), 400

    required = ["start_date", "end_date"]
    missing = [k for k in required if k not in config]
    if missing:
        return jsonify({"error": f"missing fields: {missing}"}), 400

    result = run_backtest(config)
    return jsonify(result)
