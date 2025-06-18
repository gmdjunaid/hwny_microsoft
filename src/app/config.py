"""
Configuration module for the Pathway Financial Data Pipeline.

TODO: Configure these settings based on your requirements:
1. Add your API keys for enhanced data sources
2. Adjust refresh intervals based on your needs
3. Modify the companies/tickers you want to track
4. Set up output destinations
"""

import os
from typing import Dict, List
from dotenv import load_dotenv

# Load environment variables if .env file exists
load_dotenv()

# TODO: Add your API keys here or in environment variables (optional for enhanced features)
class APIConfig:
    # Pathway license (if using commercial features)
    PATHWAY_LICENSE_KEY = os.getenv("PATHWAY_LICENSE_KEY")
    
    # OpenAI API for AI analysis (required for LangChain features)
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Optional: Enhanced financial data APIs (yfinance works fine without these)
    ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")  # Optional
    FINANCIAL_MODELING_PREP_API_KEY = os.getenv("FINANCIAL_MODELING_PREP_API_KEY")  # Optional


# TODO: Configure companies and tickers to track
COMPANIES_TO_TRACK = [
    {"name": "JPMorgan Chase", "ticker": "JPM"},
    {"name": "Apple", "ticker": "AAPL"},
    {"name": "Microsoft", "ticker": "MSFT"},
    {"name": "Google", "ticker": "GOOGL"},
    {"name": "Tesla", "ticker": "TSLA"},
    {"name": "Amazon", "ticker": "AMZN"},
    {"name": "Meta", "ticker": "META"},
    {"name": "Netflix", "ticker": "NFLX"},
]

# TODO: Adjust refresh intervals based on your needs
class RefreshIntervals:
    STOCK_REFRESH_SECONDS = int(os.getenv("STOCK_REFRESH_INTERVAL_SECONDS", 30))  # 30 seconds
    API_REFRESH_SECONDS = 10  # 10 seconds for API responses
    DASHBOARD_REFRESH_SECONDS = 5  # 5 seconds


# TODO: Configure output settings
class OutputConfig:
    OUTPUT_DIR = os.getenv("OUTPUT_DIR", "pathway_output")
    
    # Enable/disable different output formats
    ENABLE_JSON_OUTPUT = os.getenv("ENABLE_JSON_OUTPUT", "true").lower() == "true"
    ENABLE_API_OUTPUT = os.getenv("ENABLE_API_OUTPUT", "true").lower() == "true"
    
    # File paths
    STOCK_STREAM_JSON_PATH = f"{OUTPUT_DIR}/stock_stream.jsonl"
    LATEST_STOCKS_JSON_PATH = f"{OUTPUT_DIR}/latest_stocks.jsonl"
    
    # API Configuration
    API_HOST = os.getenv("API_HOST", "127.0.0.1")
    API_PORT = int(os.getenv("API_PORT", 8000))


# TODO: Configure data source settings
class DataSourceConfig:
    # News scraping settings
    MAX_ARTICLES_PER_SOURCE = 5
    NEWS_REQUEST_TIMEOUT = 10
    
    # Stock data settings
    STOCK_REQUEST_TIMEOUT = 10
    MAX_RETRIES = 3
    
    # User agent for web scraping
    USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"


# TODO: Configure advanced features
class AdvancedConfig:
    # Sentiment analysis (requires additional setup)
    ENABLE_SENTIMENT_ANALYSIS = False
    
    # Data validation
    ENABLE_DATA_VALIDATION = True
    
    # Alerting (requires additional setup)
    ENABLE_PRICE_ALERTS = False
    PRICE_ALERT_THRESHOLD = 5.0  # Alert if stock moves more than 5%
    
    # Data retention
    KEEP_HISTORICAL_DATA_DAYS = 30


def get_tickers() -> List[str]:
    """Get list of tickers from companies configuration"""
    return [company["ticker"] for company in COMPANIES_TO_TRACK]


def get_company_by_ticker(ticker: str) -> Dict[str, str]:
    """Get company info by ticker symbol"""
    for company in COMPANIES_TO_TRACK:
        if company["ticker"] == ticker:
            return company
    return {"name": ticker, "ticker": ticker}


def validate_config():
    """Validate configuration and warn about missing settings"""
    warnings = []
    
    if not APIConfig.OPENAI_API_KEY:
        warnings.append("OPENAI_API_KEY not set - AI analysis features will be disabled")
    
    if not APIConfig.ALPHA_VANTAGE_API_KEY:
        warnings.append("ALPHA_VANTAGE_API_KEY not set - using free yfinance data (works great!)")
    
    if OutputConfig.OUTPUT_DIR == "pathway_output":
        warnings.append("Using default output directory - consider setting OUTPUT_DIR")
    
    return warnings 