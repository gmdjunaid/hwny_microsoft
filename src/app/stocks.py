import yfinance as yf
import pandas as pd
import time
from rich.console import Console
from rich.table import Table
from rich.live import Live

WATCHLIST = ["AAPL", "MSFT", "GOOGL", "TSLA", "JPM"]

def get_prices(tickers):
    rows = []
    for ticker in tickers:
        try:
            info = yf.Ticker(ticker).info
            price = info.get("regularMarketPrice")
            change = info.get("regularMarketChangePercent")
            rows.append((ticker, price, f"{change:.2f}%" if change else "N/A"))
        except:
            rows.append((ticker, "Error", "N/A"))
    return rows

def render_table(data):
    table = Table(title="📈 Real-Time Stock Dashboard")

    table.add_column("Ticker", style="bold cyan")
    table.add_column("Price", justify="right")
    table.add_column("Change", justify="right")

    for ticker, price, change in data:
        table.add_row(ticker, str(price), change)

    return table

def live_dashboard():
    console = Console()

    with Live(render_table(get_prices(WATCHLIST)), refresh_per_second=1) as live:
        while True:
            prices = get_prices(WATCHLIST)
            table = render_table(prices)
            live.update(table)
            time.sleep(5)

if __name__ == "__main__":
    live_dashboard()
