"""
Simple Stock Data API (Standalone)
==================================

A simplified version that provides real-time stock data via FastAPI
without the complex Pathway pipeline. Uses yfinance directly.

This is a working alternative while we debug the Pathway integration.

To run: python3 -m uvicorn simple_stock_api:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import yfinance as yf
from datetime import datetime
import asyncio
from pydantic import BaseModel
from config import COMPANIES_TO_TRACK
from ai_analyst import analyze_stock_data, get_analysis_dict

app = FastAPI(
    title="Simple Stock Data API",
    description="Real-time stock data API using yfinance",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for stock data and AI analysis
stock_cache: Dict[str, Dict] = {}
ai_analysis_cache: Dict[str, Dict] = {}
last_update: Optional[datetime] = None

class StockData(BaseModel):
    ticker: str
    company_name: str
    price: float
    previous_close: float
    change_percent: float
    volume: int
    market_cap: Optional[int]
    pe_ratio: Optional[float]
    fifty_two_week_high: Optional[float]
    fifty_two_week_low: Optional[float]
    sector: Optional[str]
    industry: Optional[str]
    timestamp: str
    ai_analysis: Optional[Dict] = None

class HealthCheck(BaseModel):
    status: str
    timestamp: str
    stocks_tracked: int
    last_update: Optional[str]

def fetch_stock_data() -> Dict[str, Dict]:
    """Fetch fresh stock data using yfinance"""
    global stock_cache, last_update
    
    tickers = [company["ticker"] for company in COMPANIES_TO_TRACK]
    fresh_data = {}
    
    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            # Get current price and basic metrics
            current_price = info.get('currentPrice', 0.0)
            previous_close = info.get('previousClose', 0.0)
            
            # Calculate change percentage
            change_percent = 0.0
            if previous_close > 0:
                change_percent = ((current_price - previous_close) / previous_close) * 100
            
            stock_data = {
                "ticker": ticker,
                "company_name": info.get('longName', ticker),
                "price": current_price,
                "previous_close": previous_close,
                "change_percent": round(change_percent, 2),
                "volume": info.get('volume', 0),
                "market_cap": info.get('marketCap'),
                "pe_ratio": info.get('trailingPE'),
                "fifty_two_week_high": info.get('fiftyTwoWeekHigh'),
                "fifty_two_week_low": info.get('fiftyTwoWeekLow'),
                "sector": info.get('sector'),
                "industry": info.get('industry'),
                "timestamp": datetime.now().isoformat()
            }
            
            # Get AI analysis
            try:
                analysis = analyze_stock_data(stock_data)
                ai_analysis_cache[ticker] = get_analysis_dict(analysis)
                stock_data["ai_analysis"] = ai_analysis_cache[ticker]
            except Exception as e:
                print(f"⚠️ AI analysis failed for {ticker}: {e}")
                stock_data["ai_analysis"] = None
            
            fresh_data[ticker] = stock_data
            
        except Exception as e:
            print(f"Error fetching {ticker}: {e}")
            continue
    
    stock_cache = fresh_data
    last_update = datetime.now()
    return fresh_data

def get_cached_or_fresh_data() -> Dict[str, Dict]:
    """Get cached data or fetch fresh if cache is old"""
    global last_update
    
    # Refresh data if cache is older than 1 minute or empty
    if (not stock_cache or 
        not last_update or 
        (datetime.now() - last_update).seconds > 60):
        return fetch_stock_data()
    
    return stock_cache

@app.get("/health", response_model=HealthCheck)
async def health_check():
    """API health check"""
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        stocks_tracked=len(COMPANIES_TO_TRACK),
        last_update=last_update.isoformat() if last_update else None
    )

@app.get("/stocks", response_model=List[StockData])
async def get_all_stocks():
    """Get all latest stock data"""
    data = get_cached_or_fresh_data()
    
    if not data:
        raise HTTPException(status_code=404, detail="No stock data available")
    
    return [StockData(**stock_info) for stock_info in data.values()]

@app.get("/stocks/{ticker}", response_model=StockData)
async def get_stock(ticker: str):
    """Get specific stock data"""
    ticker = ticker.upper()
    data = get_cached_or_fresh_data()
    
    if ticker not in data:
        raise HTTPException(status_code=404, detail=f"Stock {ticker} not found")
    
    return StockData(**data[ticker])

@app.get("/performance")
async def get_performance_summary():
    """Get performance summary"""
    data = get_cached_or_fresh_data()
    
    if not data:
        raise HTTPException(status_code=404, detail="No stock data available")
    
    stocks = list(data.values())
    total_stocks = len(stocks)
    
    gainers = sum(1 for stock in stocks if stock.get('change_percent', 0) > 0)
    losers = sum(1 for stock in stocks if stock.get('change_percent', 0) < 0)
    flat = total_stocks - gainers - losers
    
    changes = [stock.get('change_percent', 0) for stock in stocks]
    avg_change = sum(changes) / len(changes) if changes else 0
    
    # Find top gainer and loser
    sorted_stocks = sorted(stocks, key=lambda x: x.get('change_percent', 0), reverse=True)
    top_gainer = sorted_stocks[0].get('ticker') if sorted_stocks else None
    top_loser = sorted_stocks[-1].get('ticker') if sorted_stocks else None
    
    return {
        "total_stocks": total_stocks,
        "gainers": gainers,
        "losers": losers,
        "flat": flat,
        "avg_change_percent": round(avg_change, 2),
        "top_gainer": top_gainer,
        "top_loser": top_loser,
        "last_updated": last_update.isoformat() if last_update else None
    }

@app.get("/refresh")
async def refresh_data():
    """Force refresh stock data"""
    data = fetch_stock_data()
    return {
        "message": "Data refreshed",
        "stocks_updated": len(data),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/tickers")
async def get_tracked_tickers():
    """Get list of tracked tickers"""
    return {
        "tickers": [company["ticker"] for company in COMPANIES_TO_TRACK],
        "companies": COMPANIES_TO_TRACK,
        "total": len(COMPANIES_TO_TRACK)
    }

@app.get("/analysis/{ticker}")
async def get_stock_analysis(ticker: str):
    """Get AI analysis for specific stock"""
    ticker = ticker.upper()
    
    if ticker in ai_analysis_cache and ai_analysis_cache[ticker]:
        return ai_analysis_cache[ticker]
    
    # Try to get fresh analysis
    data = get_cached_or_fresh_data()
    if ticker in data:
        try:
            analysis = analyze_stock_data(data[ticker])
            result = get_analysis_dict(analysis)
            ai_analysis_cache[ticker] = result
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
    raise HTTPException(status_code=404, detail=f"Analysis not available for {ticker}")

@app.get("/insights")
async def get_market_insights():
    """Get AI insights across all stocks"""
    data = get_cached_or_fresh_data()
    
    if not data:
        raise HTTPException(status_code=404, detail="No stock data available")
    
    insights = {
        "bullish_stocks": [],
        "bearish_stocks": [],
        "high_confidence_recommendations": [],
        "risk_analysis": {"low": [], "medium": [], "high": []},
        "summary": "AI-powered market insights"
    }
    
    for ticker, analysis_data in ai_analysis_cache.items():
        if not analysis_data:
            continue
            
        sentiment = analysis_data.get("sentiment", "neutral")
        confidence = analysis_data.get("confidence_score", 0)
        recommendation = analysis_data.get("recommendation", "hold")
        risk_level = analysis_data.get("risk_level", "medium")
        
        if sentiment == "bullish":
            insights["bullish_stocks"].append({
                "ticker": ticker,
                "confidence": confidence,
                "reasoning": analysis_data.get("reasoning", "")
            })
        elif sentiment == "bearish":
            insights["bearish_stocks"].append({
                "ticker": ticker,
                "confidence": confidence,
                "reasoning": analysis_data.get("reasoning", "")
            })
        
        if confidence > 0.7 and recommendation in ["buy", "sell"]:
            insights["high_confidence_recommendations"].append({
                "ticker": ticker,
                "recommendation": recommendation,
                "confidence": confidence,
                "price_target": analysis_data.get("price_target")
            })
        
        insights["risk_analysis"][risk_level].append(ticker)
    
    return insights

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Simple Stock Data API",
        "version": "1.0.0",
        "description": "Real-time stock data using yfinance",
        "endpoints": {
            "GET /stocks": "All latest stock data (with AI analysis)",
            "GET /stocks/{ticker}": "Specific stock data",
            "GET /analysis/{ticker}": "AI analysis for specific stock",
            "GET /insights": "AI-powered market insights",
            "GET /health": "API health check",
            "GET /performance": "Performance summary",
            "GET /refresh": "Force refresh data",
            "GET /tickers": "Tracked tickers"
        },
        "docs": "Visit /docs for interactive API documentation"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Simple Stock API...")
    print("📈 Fetching initial stock data...")
    fetch_stock_data()
    print(f"✅ Loaded data for {len(stock_cache)} stocks")
    print("🌐 Starting server at http://localhost:8000")
    print("📖 API docs at http://localhost:8000/docs")
    
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info") 