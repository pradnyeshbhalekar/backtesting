Equity Backtesting Platform

An end-to-end backtesting platform for fundamental equity strategies. Define filters, ranking rules, and position sizing logic — then simulate how that strategy would have performed historically against the Indian stock market, benchmarked against Nifty 50.

**Live Demo:** https://backtest-web.onrender.com

---

## Features

- Define custom **date range** and **rebalance frequency** (monthly, quarterly, half-yearly, yearly)
- **Filter** stocks by market cap, ROCE, ROE, PE ratio, and PAT
- **Rank** stocks by single or multiple fundamental metrics with composite ranking support
- **Position sizing** — equal weight, market cap weighted, or metric weighted (e.g. ROCE)
- Set **initial capital** with compounding logic applied at every rebalance
- View **equity curve** vs Nifty 50 benchmark
- View **drawdown chart**, CAGR, Sharpe Ratio, Max Drawdown, Volatility
- See **top winners and losers** across the backtest period
- Browse a full **portfolio log** with holdings, weights, and returns per rebalance
- **Export results as CSV**

---

## Architecture Overview

```
qode/
├── backend/          # Python / Flask API + backtest engine
│   ├── app/
│   │   ├── backtest/ # Core engine: filters, ranking, sizing, metrics
│   │   ├── data/     # Data fetching (yfinance) and ingestion pipeline
│   │   ├── models/   # SQLAlchemy ORM models
│   │   ├── routes/   # Flask API blueprints
│   │   └── config/   # Database config
│   ├── requirements.txt
│   └── run.py
├── frontend/         # React + Tailwind CSS
│   └── src/
│       ├── components/  # UI components
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Chart defaults, CSV export
│       ├── api.ts       # API client
│       └── types.ts     # TypeScript types
└── render.yaml       # Render deployment config
```

**Tech Stack**
- Backend: Python, Flask, SQLAlchemy, pandas, numpy
- Database: PostgreSQL
- Frontend: React 19, TypeScript, Tailwind CSS, Chart.js
- Data Source: Yahoo Finance (`yfinance`)
- Deployment: Render (backend as Web Service, frontend as Static Site)

---

## Database Schema

Three tables store all data:

| Table | Description |
|---|---|
| `stocks` | Symbol, name, sector, industry, exchange |
| `stock_prices` | Daily OHLCV + adjusted close per stock, indexed by `(stock_id, date)` |
| `stock_fundamentals` | Fundamental snapshot per stock — P&L, balance sheet, cash flow, ratios |

Key fields in `stock_fundamentals`: `market_cap`, `roe`, `roce`, `roa`, `pe_ratio`, `pb_ratio`, `pat`, `revenue`, `ebitda`, `total_debt`, `free_cash_flow`, `net_profit_margin`, `operating_margin`, `revenue_growth_yoy`, `pat_growth_yoy`

---

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database

---

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/qode
FRONTEND_URL=http://localhost:5173
```

Initialize the database and ingest data:

```bash
# Creates all tables and fetches price + fundamental data for 120 NSE stocks
python -c "from app.data.ingestion import run_ingestion; run_ingestion()"
```

> Note: Ingestion fetches data for 120 stocks from Yahoo Finance and takes 10–20 minutes on first run.

Start the backend:

```bash
python run.py
# API available at http://localhost:5050
```

---

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5050
```

Start the dev server:

```bash
npm run dev
# App available at http://localhost:5173
```

---

## API

`POST /api/backtest/run` — runs a backtest with the provided config. See `documentation.md` for the full request/response schema.

`GET /health` — health check.

---

## Data Sources

Stock universe: 120 NSE-listed companies across large, mid, and small cap segments.

All data is fetched from **Yahoo Finance** via `yfinance` — historical OHLCV prices and current fundamental snapshots (P&L, balance sheet, cash flow, valuation ratios).
