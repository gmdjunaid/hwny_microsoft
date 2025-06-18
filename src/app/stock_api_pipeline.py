"""
PATHWAY STOCK STREAMING API PIPELINE
===================================

A focused, real-time stock data pipeline built with Pathway and FastAPI.
Since you already have news.py working with news_articles.csv, this pipeline
focuses solely on streaming stock data and serving it via a REST API.

FEATURES:
- Real-time stock price streaming using yfinance (no API keys needed!)
- FastAPI web server for REST endpoints
- Pathway streaming data processing
- JSON output for easy consumption

PIPELINE FLOW:
yfinance → StockDataSource → stock_table → latest_prices → FastAPI endpoints

ENDPOINTS:
- GET /stocks - All latest stock data
- GET /stocks/{ticker} - Specific stock data
- GET /health - API health check

To run: 
1. python3 stock_api_pipeline.py (starts Pathway pipeline)
2. In another terminal: python3 -m uvicorn stock_api:app --reload (starts API)
"""

import pathway as pw
import yfinance as yf
from datetime import datetime
import time
import json
import os
from typing import Dict, List, Any, Optional
from rich.console import Console
from config import COMPANIES_TO_TRACK, RefreshIntervals, OutputConfig, validate_config

# Global variable to store latest stock data for API
latest_stock_data: Dict[str, Dict] = {}

class StockDataSource(pw.io.python.ConnectorSubject):
    """Pathway connector for real-time stock data using yfinance"""
    
    def __init__(self, tickers: List[str], refresh_interval: int = 30):
        super().__init__()
        self.tickers = tickers
        self.refresh_interval = refresh_interval
        self.console = Console()
        
    def run(self):
        """Main data collection loop"""
        while True:
            try:
                self.console.print(f"📈 Fetching stock data for {len(self.tickers)} tickers...")
                stock_data = self._get_stock_data()
                
                # Emit each stock's data
                for data in stock_data:
                    # Add timestamp and unique key
                    data["timestamp"] = datetime.now().isoformat()
                    data["stock_id"] = f"{data['ticker']}_{int(time.time())}"
                    
                    # Update global data for API access
                    latest_stock_data[data['ticker']] = data
                    
                    self.next(**data)
                
                self.console.print(f"✅ Updated {len(stock_data)} stocks")
                time.sleep(self.refresh_interval)
                
            except Exception as e:
                self.console.print(f"❌ Error in stock data source: {e}")
                time.sleep(self.refresh_interval)
    
    def _get_stock_data(self) -> List[Dict[str, Any]]:
        """Fetch stock data using yfinance"""
        stock_data = []
        
        for ticker in self.tickers:
            try:
                # Get stock info
                stock = yf.Ticker(ticker)
                info = stock.info
                
                # Get current price and basic metrics
                current_price = info.get('currentPrice', 0.0)
                previous_close = info.get('previousClose', 0.0)
                
                # Calculate change percentage
                change_percent = 0.0
                if previous_close > 0:
                    change_percent = ((current_price - previous_close) / previous_close) * 100
                
                stock_data.append({
                    "ticker": ticker,
                    "company_name": info.get('longName', ticker),
                    "price": current_price,
                    "previous_close": previous_close,
                    "change_percent": round(change_percent, 2),
                    "volume": info.get('volume', 0),
                    "market_cap": info.get('marketCap', 0),
                    "pe_ratio": info.get('trailingPE', 0.0),
                    "fifty_two_week_high": info.get('fiftyTwoWeekHigh', 0.0),
                    "fifty_two_week_low": info.get('fiftyTwoWeekLow', 0.0),
                    "sector": info.get('sector', 'Unknown'),
                    "industry": info.get('industry', 'Unknown')
                })
                
            except Exception as e:
                self.console.print(f"⚠️ Error fetching {ticker}: {e}")
                continue
        
        return stock_data


def create_stock_pipeline():
    """Create and configure the Pathway stock pipeline"""
    
    # Extract tickers from companies list
    tickers = [company["ticker"] for company in COMPANIES_TO_TRACK]
    
    # Create stock data source
    stock_source = StockDataSource(tickers, RefreshIntervals.STOCK_REFRESH_SECONDS)
    
    # Define stock schema
    class StockSchema(pw.Schema):
        stock_id: str
        ticker: str
        company_name: str
        price: float
        previous_close: float
        change_percent: float
        volume: int
        market_cap: int
        pe_ratio: float
        fifty_two_week_high: float
        fifty_two_week_low: float
        sector: str
        industry: str
        timestamp: str
    
    # Create Pathway table from stock source
    stock_table = pw.io.python.read(
        stock_source,
        schema=StockSchema
    )
    
    # Transform data - get latest prices per ticker
    latest_stocks = stock_table.groupby(stock_table.ticker).reduce(
        ticker=stock_table.ticker,
        latest_price=pw.reducers.latest(stock_table.price),
        latest_change=pw.reducers.latest(stock_table.change_percent),
        latest_volume=pw.reducers.latest(stock_table.volume),
        latest_timestamp=pw.reducers.latest(stock_table.timestamp),
        company_name=pw.reducers.latest(stock_table.company_name),
        market_cap=pw.reducers.latest(stock_table.market_cap),
        pe_ratio=pw.reducers.latest(stock_table.pe_ratio),
        sector=pw.reducers.latest(stock_table.sector),
        industry=pw.reducers.latest(stock_table.industry)
    )
    
    # Create performance analysis (simplified to avoid type issues)
    stock_performance = stock_table.select(
        ticker=stock_table.ticker,
        price_trend=pw.if_else(
            stock_table.change_percent > 0.0, 
            "UP", 
            pw.if_else(stock_table.change_percent < 0.0, "DOWN", "FLAT")
        ),
        change_percent=stock_table.change_percent,
        timestamp=stock_table.timestamp
    )
    
    # Output configurations
    if OutputConfig.ENABLE_JSON_OUTPUT:
        # Ensure output directory exists
        os.makedirs(OutputConfig.OUTPUT_DIR, exist_ok=True)
        
        # Write latest stocks to JSON for API consumption
        pw.io.jsonlines.write(latest_stocks, OutputConfig.LATEST_STOCKS_JSON_PATH)
        
        # Write all stock data stream
        pw.io.jsonlines.write(stock_table, OutputConfig.STOCK_STREAM_JSON_PATH)
    
    return {
        "stock_table": stock_table,
        "latest_stocks": latest_stocks,
        "stock_performance": stock_performance
    }


def main():
    """Main pipeline execution"""
    console = Console()
    console.print("🚀 Starting Pathway Stock Streaming Pipeline...")
    
    # Validate configuration
    warnings = validate_config()
    if warnings:
        console.print("⚠️ Configuration warnings:")
        for warning in warnings:
            console.print(f"  - {warning}")
    
    try:
        # Create and run pipeline
        tables = create_stock_pipeline()
        
        console.print("✅ Stock pipeline configured successfully!")
        console.print(f"📁 Output directory: {OutputConfig.OUTPUT_DIR}")
        console.print("📊 Available tables:")
        for name in tables.keys():
            console.print(f"  - {name}")
        
        console.print(f"\\n📈 Tracking {len(COMPANIES_TO_TRACK)} stocks:")
        for company in COMPANIES_TO_TRACK:
            console.print(f"  - {company['name']} ({company['ticker']})")
        
        console.print(f"\\n🔄 Refresh interval: {RefreshIntervals.STOCK_REFRESH_SECONDS} seconds")
        console.print("🌐 Stock data will be available for the FastAPI server")
        console.print("\\n💡 To start the API server, run:")
        console.print("   python3 -m uvicorn stock_api:app --reload")
        console.print("\\nPress Ctrl+C to stop the pipeline")
        
        # Run the pipeline
        pw.run()
        
    except KeyboardInterrupt:
        console.print("\\n⏹️ Pipeline stopped by user")
    except Exception as e:
        console.print(f"\\n❌ Pipeline error: {e}")
        raise


if __name__ == "__main__":
    main() 