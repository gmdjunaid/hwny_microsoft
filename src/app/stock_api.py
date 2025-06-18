"""
FastAPI Server for Real-Time Stock Data
=======================================

REST API server that serves real-time stock data from the Pathway pipeline.
Provides clean endpoints for consuming stock data in web applications.

ENDPOINTS:
- GET /stocks - All latest stock data
- GET /stocks/{ticker} - Specific stock data  
- GET /health - API health check
- GET /performance - Stock performance summary
- GET /sectors - Stock data grouped by sector

To run: python3 -m uvicorn stock_api:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional, Any
import json
import os
from datetime import datetime
from pydantic import BaseModel
from config import OutputConfig, COMPANIES_TO_TRACK

# Import the global stock data from the pipeline
try:
    from stock_api_pipeline import latest_stock_data
except ImportError:
    # Fallback if pipeline not running
    latest_stock_data = {}

app = FastAPI(
    title="Real-Time Stock Data API",
    description="FastAPI server for streaming stock data via Pathway pipeline",
    version="1.0.0"
)

# Enable CORS for web applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API responses
class StockData(BaseModel):
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

class HealthCheck(BaseModel):
    status: str
    timestamp: str
    pipeline_running: bool
    stocks_tracked: int

class PerformanceSummary(BaseModel):
    total_stocks: int
    gainers: int
    losers: int
    flat: int
    avg_change_percent: float
    top_gainer: Optional[str]
    top_loser: Optional[str]
    last_updated: str

def load_stock_data_from_file() -> Dict[str, Dict]:
    """Load stock data from JSON file if pipeline data not available"""
    try:
        if os.path.exists(OutputConfig.LATEST_STOCKS_JSON_PATH):
            with open(OutputConfig.LATEST_STOCKS_JSON_PATH, 'r') as f:
                lines = f.readlines()
                if lines:
                    # Get the latest line (most recent data)
                    latest_line = lines[-1].strip()
                    data = json.loads(latest_line)
                    return {data.get('ticker', 'UNKNOWN'): data}
    except Exception:
        pass
    return {}

def get_current_stock_data() -> Dict[str, Dict]:
    """Get current stock data from pipeline or file"""
    if latest_stock_data:
        return latest_stock_data
    return load_stock_data_from_file()

@app.get("/health", response_model=HealthCheck)
async def health_check():
    """API health check endpoint"""
    stock_data = get_current_stock_data()
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        pipeline_running=len(latest_stock_data) > 0,
        stocks_tracked=len(stock_data)
    )

@app.get("/stocks", response_model=List[StockData])
async def get_all_stocks():
    """Get all latest stock data"""
    stock_data = get_current_stock_data()
    
    if not stock_data:
        raise HTTPException(status_code=404, detail="No stock data available")
    
    return [StockData(**data) for data in stock_data.values()]

@app.get("/stocks/{ticker}", response_model=StockData)
async def get_stock(ticker: str):
    """Get specific stock data by ticker"""
    ticker = ticker.upper()
    stock_data = get_current_stock_data()
    
    if ticker not in stock_data:
        raise HTTPException(status_code=404, detail=f"Stock {ticker} not found")
    
    return StockData(**stock_data[ticker])

@app.get("/performance", response_model=PerformanceSummary)
async def get_performance_summary():
    """Get performance summary of all stocks"""
    stock_data = get_current_stock_data()
    
    if not stock_data:
        raise HTTPException(status_code=404, detail="No stock data available")
    
    stocks = list(stock_data.values())
    total_stocks = len(stocks)
    
    if total_stocks == 0:
        raise HTTPException(status_code=404, detail="No stock data available")
    
    gainers = sum(1 for stock in stocks if stock.get('change_percent', 0) > 0)
    losers = sum(1 for stock in stocks if stock.get('change_percent', 0) < 0)
    flat = total_stocks - gainers - losers
    
    changes = [stock.get('change_percent', 0) for stock in stocks]
    avg_change = sum(changes) / len(changes) if changes else 0
    
    # Find top gainer and loser
    sorted_stocks = sorted(stocks, key=lambda x: x.get('change_percent', 0), reverse=True)
    top_gainer = sorted_stocks[0].get('ticker') if sorted_stocks else None
    top_loser = sorted_stocks[-1].get('ticker') if sorted_stocks else None
    
    # Get latest timestamp
    timestamps = [stock.get('timestamp', '') for stock in stocks]
    last_updated = max(timestamps) if timestamps else datetime.now().isoformat()
    
    return PerformanceSummary(
        total_stocks=total_stocks,
        gainers=gainers,
        losers=losers,
        flat=flat,
        avg_change_percent=round(avg_change, 2),
        top_gainer=top_gainer,
        top_loser=top_loser,
        last_updated=last_updated
    )

@app.get("/sectors")
async def get_stocks_by_sector():
    """Get stocks grouped by sector"""
    stock_data = get_current_stock_data()
    
    if not stock_data:
        raise HTTPException(status_code=404, detail="No stock data available")
    
    sectors = {}
    for stock in stock_data.values():
        sector = stock.get('sector', 'Unknown')
        if sector not in sectors:
            sectors[sector] = []
        sectors[sector].append({
            'ticker': stock.get('ticker'),
            'company_name': stock.get('company_name'),
            'price': stock.get('price'),
            'change_percent': stock.get('change_percent')
        })
    
    return sectors

@app.get("/tickers")
async def get_tracked_tickers():
    """Get list of all tracked tickers"""
    return {
        "tickers": [company["ticker"] for company in COMPANIES_TO_TRACK],
        "companies": COMPANIES_TO_TRACK,
        "total": len(COMPANIES_TO_TRACK)
    }

@app.get("/")
async def root():
    """API root endpoint with basic info"""
    return {
        "message": "Real-Time Stock Data API",
        "version": "1.0.0",
        "endpoints": {
            "GET /stocks": "All latest stock data",
            "GET /stocks/{ticker}": "Specific stock data",
            "GET /health": "API health check",
            "GET /performance": "Performance summary",
            "GET /sectors": "Stocks by sector",
            "GET /tickers": "Tracked tickers"
        },
        "pipeline_status": "running" if latest_stock_data else "not_connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host=OutputConfig.API_HOST, 
        port=OutputConfig.API_PORT,
        log_level="info"
    ) 