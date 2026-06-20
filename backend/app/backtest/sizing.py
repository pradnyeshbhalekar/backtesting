import pandas as pd


def compute_weights(df: pd.DataFrame, method: str, metric: str | None = None) -> pd.Series:
    """
    method: 'equal' | 'market_cap' | 'metric'
    metric: required when method == 'metric' (e.g. 'roce')
    Returns a Series indexed by symbol with weights summing to 1.
    """
    if method == "equal":
        w = pd.Series(1.0, index=df["symbol"])

    elif method == "market_cap":
        w = df.set_index("symbol")["market_cap"].fillna(0).clip(lower=0)
        if w.sum() == 0:
            w = pd.Series(1.0, index=df["symbol"])

    elif method == "metric" and metric:
        w = df.set_index("symbol")[metric].fillna(0).clip(lower=0)
        if w.sum() == 0:
            w = pd.Series(1.0, index=df["symbol"])

    else:
        w = pd.Series(1.0, index=df["symbol"])

    return w / w.sum()
