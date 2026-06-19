from sqlalchemy import (
    Column, Date, Float, ForeignKey, Integer, String, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.config.db import Base


class StockFundamentals(Base):
    """Annual/quarterly fundamental snapshot for a stock."""

    __tablename__ = "stock_fundamentals"
    __table_args__ = (
        UniqueConstraint("stock_id", "period_date", "period_type", name="uq_stock_fundamental_period"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    stock_id = Column(Integer, ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False, index=True)

    # Period this data represents
    period_date = Column(Date, nullable=False, index=True)
    period_type = Column(String(10), default="annual")  # 'annual' | 'quarterly'

    # Valuation
    market_cap = Column(Float)          # in INR crores
    pe_ratio = Column(Float)
    pb_ratio = Column(Float)
    ev_ebitda = Column(Float)
    dividend_yield = Column(Float)

    # Profitability
    roce = Column(Float)                # Return on Capital Employed (%)
    roe = Column(Float)                 # Return on Equity (%)
    roa = Column(Float)                 # Return on Assets (%)
    net_profit_margin = Column(Float)   # (%)
    operating_margin = Column(Float)    # (%)
    gross_margin = Column(Float)        # (%)

    # Income Statement (INR crores)
    revenue = Column(Float)
    ebitda = Column(Float)
    ebit = Column(Float)
    pat = Column(Float)                 # Profit After Tax

    # Balance Sheet (INR crores)
    total_assets = Column(Float)
    total_debt = Column(Float)
    current_liabilities = Column(Float)
    shareholders_equity = Column(Float)
    cash_and_equivalents = Column(Float)

    # Cash Flow (INR crores)
    operating_cash_flow = Column(Float)
    capex = Column(Float)
    free_cash_flow = Column(Float)

    # Growth
    revenue_growth_yoy = Column(Float)  # (%)
    pat_growth_yoy = Column(Float)      # (%)

    stock = relationship("Stock", backref="fundamentals")

    def __repr__(self):
        return f"<StockFundamentals stock_id={self.stock_id} period={self.period_date}>"
