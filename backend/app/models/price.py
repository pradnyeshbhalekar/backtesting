from sqlalchemy import (
    BigInteger, Column, Date, Float, ForeignKey, Integer, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.config.db import Base


class StockPrice(Base):
    """Daily OHLCV data for a stock."""

    __tablename__ = "stock_prices"
    __table_args__ = (
        UniqueConstraint("stock_id", "date", name="uq_stock_price_date"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    stock_id = Column(Integer, ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(BigInteger)
    adjusted_close = Column(Float)

    stock = relationship("Stock", backref="prices")

    def __repr__(self):
        return f"<StockPrice stock_id={self.stock_id} date={self.date}>"
