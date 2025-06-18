"""
PATHWAY LIVE DATA FRAMEWORK - FINANCIAL NEWS & STOCK PIPELINE
============================================================

This pipeline integrates news scraping and stock price monitoring into a unified
Pathway streaming system. It demonstrates:

1. Custom data sources that feed into Pathway tables
2. Real-time data transformation and processing
3. Streaming ETL with automatic updates
4. Output to various formats (CSV, JSON, etc.)

PIPELINE FLOW:
News Feed → news_table → filtered/enriched → output
Stock Feed → stock_quotes → price_analysis → output
Combined → dashboard_data → real-time_dashboard

To run: python pathway_pipeline.py
"""

import pathway as pw
import pandas as pd
import requests
from bs4 import BeautifulSoup
import feedparser
import yfinance as yf
from datetime import datetime, timedelta
import time
import os
from typing import Dict, List, Any
from rich.console import Console
from rich.table import Table

# Import configuration
from config import (
    COMPANIES_TO_TRACK,
    RefreshIntervals,
    OutputConfig,
    DataSourceConfig,
    APIConfig,
    validate_config
)

# Create output directory
os.makedirs(OutputConfig.OUTPUT_DIR, exist_ok=True)


class NewsDataSource(pw.io.python.ConnectorSubject):
    """
    Custom Pathway connector for news scraping.
    Fetches news articles from multiple sources and streams them to Pathway.
    """
    
    def __init__(self, companies: List[Dict[str, str]], refresh_interval: int = 300):
        super().__init__()
        self.companies = companies
        self.refresh_interval = refresh_interval
        self.console = Console()
        self.max_articles = DataSourceConfig.MAX_ARTICLES_PER_SOURCE
        self.timeout = DataSourceConfig.NEWS_REQUEST_TIMEOUT
        
    def run(self):
        """Continuously fetch news data and emit to Pathway"""
        while True:
            try:
                all_articles = []
                for company in self.companies:
                    articles = self._scrape_company_news(company["name"], company["ticker"])
                    all_articles.extend(articles)
                
                # Emit each article as a separate row
                for article in all_articles:
                    # Add timestamp and unique key
                    article["scraped_at"] = datetime.now().isoformat()
                    article["news_id"] = f"{article['source']}_{hash(article['title'])}"
                    self.next(**article)
                    
                self.console.print(f"📰 Scraped {len(all_articles)} news articles")
                time.sleep(self.refresh_interval)
                
            except Exception as e:
                self.console.print(f"❌ News scraping error: {e}")
                time.sleep(30)  # Wait before retrying
    
    def _scrape_company_news(self, company: str, ticker: str) -> List[Dict[str, Any]]:
        """Scrape news for a specific company"""
        articles = []
        
        # Google News RSS
        try:
            articles.extend(self._google_news_scrape(company, ticker))
        except Exception as e:
            self.console.print(f"⚠️ Google News failed for {company}: {e}")
        
        # Yahoo Finance
        try:
            articles.extend(self._yahoo_finance_scrape(ticker))
        except Exception as e:
            self.console.print(f"⚠️ Yahoo Finance failed for {ticker}: {e}")
            
        return articles
    
    def _google_news_scrape(self, company: str, ticker: str) -> List[Dict[str, Any]]:
        """Scrape Google News RSS feed"""
        url = f"https://news.google.com/rss/search?q={company.replace(' ', '+')}+{ticker}+stock"
        feed = feedparser.parse(url)
        
        articles = []
        for entry in feed.entries[:self.max_articles]:  # Limit articles per source
            articles.append({
                "title": entry.title,
                "summary": entry.summary,
                "link": entry.link,
                "source": "Google News",
                "published": entry.published,
                "company": company,
                "ticker": ticker
            })
        return articles
    
    def _yahoo_finance_scrape(self, ticker: str) -> List[Dict[str, Any]]:
        """Scrape Yahoo Finance news"""
        url = f"https://finance.yahoo.com/quote/{ticker}?p={ticker}"
        headers = {"User-Agent": DataSourceConfig.USER_AGENT}
        
        try:
            response = requests.get(url, headers=headers, timeout=self.timeout)
            soup = BeautifulSoup(response.text, "html.parser")
            
            articles = []
            # Look for news items (simplified selector)
            for item in soup.find_all("li", class_="js-stream-content")[:self.max_articles]:
                try:
                    title_tag = item.find("h3")
                    link_tag = item.find("a")
                    if title_tag and link_tag:
                        articles.append({
                            "title": title_tag.text.strip(),
                            "summary": "",
                            "link": "https://finance.yahoo.com" + link_tag.get("href", ""),
                            "source": "Yahoo Finance",
                            "published": datetime.now().isoformat(),
                            "company": "",  # Will be enriched later
                            "ticker": ticker
                        })
                except Exception:
                    continue
                    
            return articles
            
        except Exception as e:
            return []


class StockDataSource(pw.io.python.ConnectorSubject):
    """
    Custom Pathway connector for stock price data.
    Fetches real-time stock prices and streams them to Pathway.
    """
    
    def __init__(self, tickers: List[str], refresh_interval: int = 60):
        super().__init__()
        self.tickers = tickers
        self.refresh_interval = refresh_interval
        self.console = Console()
        
    def run(self):
        """Continuously fetch stock data and emit to Pathway"""
        while True:
            try:
                stock_data = self._get_stock_prices()
                
                for data in stock_data:
                    # Add timestamp and unique key
                    data["timestamp"] = datetime.now().isoformat()
                    data["stock_id"] = f"{data['ticker']}_{int(time.time())}"
                    self.next(**data)
                
                self.console.print(f"📈 Updated {len(stock_data)} stock prices")
                time.sleep(self.refresh_interval)
                
            except Exception as e:
                self.console.print(f"❌ Stock data error: {e}")
                time.sleep(30)
    
    def _get_stock_prices(self) -> List[Dict[str, Any]]:
        """Fetch current stock prices using yfinance"""
        stock_data = []
        
        for ticker in self.tickers:
            try:
                # TODO: Consider using a financial data API key for better reliability
                stock = yf.Ticker(ticker)
                info = stock.info
                
                # Get current price and calculate metrics
                current_price = info.get("regularMarketPrice", 0)
                prev_close = info.get("previousClose", current_price)
                change_percent = ((current_price - prev_close) / prev_close * 100) if prev_close else 0
                
                stock_data.append({
                    "ticker": ticker,
                    "price": current_price,
                    "previous_close": prev_close,
                    "change_percent": round(change_percent, 2),
                    "volume": info.get("regularMarketVolume", 0),
                    "market_cap": info.get("marketCap", 0),
                    "pe_ratio": info.get("trailingPE", 0),
                    "company_name": info.get("shortName", ticker)
                })
                
            except Exception as e:
                self.console.print(f"⚠️ Failed to get data for {ticker}: {e}")
                stock_data.append({
                    "ticker": ticker,
                    "price": 0,
                    "previous_close": 0,
                    "change_percent": 0,
                    "volume": 0,
                    "market_cap": 0,
                    "pe_ratio": 0,
                    "company_name": ticker,
                    "error": str(e)
                })
        
        return stock_data


def create_pipeline():
    """Create and configure the Pathway pipeline"""
    
    # Extract tickers from companies list
    tickers = [company["ticker"] for company in COMPANIES_TO_TRACK]
    
    # Create data sources
    news_source = NewsDataSource(COMPANIES_TO_TRACK, RefreshIntervals.NEWS_REFRESH_SECONDS)
    stock_source = StockDataSource(tickers, RefreshIntervals.STOCK_REFRESH_SECONDS)
    
    # Define schemas using class-based approach
    class NewsSchema(pw.Schema):
        news_id: str
        title: str
        summary: str
        link: str
        source: str
        published: str
        company: str
        ticker: str
        scraped_at: str

    class StockSchema(pw.Schema):
        stock_id: str
        ticker: str
        price: float
        previous_close: float
        change_percent: float
        volume: int
        market_cap: int
        pe_ratio: float
        company_name: str
        timestamp: str

    # Create Pathway tables from data sources
    news_table = pw.io.python.read(
        news_source,
        schema=NewsSchema
    )
    
    stock_table = pw.io.python.read(
        stock_source,
        schema=StockSchema
    )
    
    # Transform and enrich news data
    enriched_news = news_table.select(
        *pw.this,
        sentiment=pw.apply(lambda title, summary: "neutral", pw.this.title, pw.this.summary),  # TODO: Add sentiment analysis
        word_count=pw.apply(lambda title, summary: len((title + " " + summary).split()), pw.this.title, pw.this.summary)
    ).filter(pw.this.title != "")
    
    # Transform and enrich stock data
    enhanced_stocks = stock_table.select(
        *pw.this,
        trend=pw.apply(
            lambda change: "up" if change > 0 else "down" if change < 0 else "flat",
            pw.this.change_percent
        ),
        price_formatted=pw.apply(lambda price: f"${price:.2f}", pw.this.price)
    )
    
    # Create aggregated views
    # Latest stock prices by ticker
    latest_stocks = enhanced_stocks.groupby(pw.this.ticker).reduce(
        ticker=pw.this.ticker,
        latest_price=pw.reducers.latest(pw.this.price),
        latest_change=pw.reducers.latest(pw.this.change_percent),
        latest_timestamp=pw.reducers.latest(pw.this.timestamp),
        company_name=pw.reducers.latest(pw.this.company_name)
    )
    
    # News count by ticker in last hour
    # TODO: Implement proper time-based filtering
    news_summary = enriched_news.groupby(pw.this.ticker).reduce(
        ticker=pw.this.ticker,
        news_count=pw.reducers.count(),
        latest_news_title=pw.reducers.latest(pw.this.title),
        latest_news_time=pw.reducers.latest(pw.this.scraped_at)
    )
    
    # Output configurations
    # TODO: Configure output destinations based on your needs
    
    if OutputConfig.ENABLE_CSV_OUTPUT:
        # Write news to CSV
        pw.io.csv.write(enriched_news, OutputConfig.NEWS_CSV_PATH)
        
        # Write stocks to CSV  
        pw.io.csv.write(enhanced_stocks, OutputConfig.STOCK_CSV_PATH)
    
    if OutputConfig.ENABLE_JSON_OUTPUT:
        # Write latest stocks to JSON for dashboard
        pw.io.jsonlines.write(latest_stocks, OutputConfig.LATEST_STOCKS_JSON_PATH)
        
        # Write news summary to JSON
        pw.io.jsonlines.write(news_summary, OutputConfig.NEWS_SUMMARY_JSON_PATH)
    
    return {
        "news_table": enriched_news,
        "stock_table": enhanced_stocks,
        "latest_stocks": latest_stocks,
        "news_summary": news_summary
    }


def main():
    """Main pipeline execution"""
    console = Console()
    console.print("🚀 Starting Pathway Financial Data Pipeline...")
    
    # Validate configuration and show warnings
    warnings = validate_config()
    if warnings:
        console.print("⚠️ Configuration warnings:")
        for warning in warnings:
            console.print(f"  - {warning}")
        console.print()
    
    # Set up Pathway license if provided
    if APIConfig.PATHWAY_LICENSE_KEY:
        os.environ["PATHWAY_LICENSE_KEY"] = APIConfig.PATHWAY_LICENSE_KEY
    
    try:
        # Create and run pipeline
        tables = create_pipeline()
        
        console.print("✅ Pipeline configured successfully!")
        console.print(f"📁 Output directory: {OutputConfig.OUTPUT_DIR}")
        console.print("📊 Available tables:")
        for name, table in tables.items():
            console.print(f"  - {name}")
        
        console.print(f"\n📊 Tracking {len(COMPANIES_TO_TRACK)} companies:")
        for company in COMPANIES_TO_TRACK:
            console.print(f"  - {company['name']} ({company['ticker']})")
        
        console.print("\n🔄 Starting streaming pipeline...")
        console.print("Press Ctrl+C to stop")
        
        # Run the pipeline
        pw.run()
        
    except KeyboardInterrupt:
        console.print("\n⏹️ Pipeline stopped by user")
    except Exception as e:
        console.print(f"❌ Pipeline error: {e}")
        raise


if __name__ == "__main__":
    main() 