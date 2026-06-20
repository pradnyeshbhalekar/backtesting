import pandas as pd


def rank_stocks(df: pd.DataFrame, ranking: list[dict], portfolio_size: int) -> pd.DataFrame:
    """
    ranking: [{"metric": "roe", "ascending": False}, {"metric": "pe_ratio", "ascending": True}]
    For a single metric, sorts directly.
    For multiple metrics, averages the individual ranks (composite ranking).
    Returns top `portfolio_size` rows.
    """
    if not ranking or df.empty:
        return df.head(portfolio_size)

    if len(ranking) == 1:
        r = ranking[0]
        return (
            df.sort_values(r["metric"], ascending=r.get("ascending", False), na_position="last")
            .head(portfolio_size)
        )

    for r in ranking:
        col = r["metric"]
        df[f"_rank_{col}"] = df[col].rank(ascending=r.get("ascending", False), na_option="bottom")

    rank_cols = [f"_rank_{r['metric']}" for r in ranking]
    df["_composite_rank"] = df[rank_cols].mean(axis=1)
    df = df.sort_values("_composite_rank").head(portfolio_size)
    return df.drop(columns=[c for c in df.columns if c.startswith("_")])
