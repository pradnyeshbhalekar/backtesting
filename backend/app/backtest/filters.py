import pandas as pd


def apply_filters(df: pd.DataFrame, filters: dict) -> pd.DataFrame:
    """
    df must have columns matching stock_fundamentals fields.
    filters keys: market_cap_min, market_cap_max, roce_min, pat_min, roe_min, pe_max
    All values are in the same units as the DB (crores for money, % for ratios).
    """
    mask = pd.Series(True, index=df.index)

    if v := filters.get("market_cap_min"):
        mask &= df["market_cap"].fillna(0) >= v
    if v := filters.get("market_cap_max"):
        mask &= df["market_cap"].fillna(float("inf")) <= v
    if v := filters.get("roce_min"):
        mask &= df["roce"].fillna(0) >= v
    if v := filters.get("roe_min"):
        mask &= df["roe"].fillna(0) >= v
    if v := filters.get("pe_max"):
        mask &= df["pe_ratio"].fillna(float("inf")) <= v
    if filters.get("pat_min") is not None:
        mask &= df["pat"].fillna(0) > filters["pat_min"]

    return df[mask].copy()
