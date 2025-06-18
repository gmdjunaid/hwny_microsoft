# Pathway Financial Data Pipeline with AI Analysis

A real-time streaming ETL pipeline built with [Pathway](https://pathway.com) and enhanced with **LangChain AI analysis** that provides intelligent stock insights and market sentiment analysis.

## 🚀 Quick Start

### Prerequisites

```bash
# Install Python dependencies
pip install -r requirements.txt
```

### Running the Enhanced System

```bash
# Option 1: Simple Stock API with AI Analysis (Recommended)
cd src/app
python3 simple_stock_api.py
# API available at http://localhost:8000
# Visit http://localhost:8000/docs for interactive API docs

# Option 2: Full Pathway Pipeline (Advanced)
cd src/app
python3 stock_api_pipeline.py  # Start pipeline
# In separate terminal:
python3 -m uvicorn stock_api:app --reload --port 8001
```

### 🤖 AI Analysis Setup (Optional)

For enhanced AI-powered stock analysis, set your OpenAI API key:

```bash
# Enable LangChain-powered AI analysis
export OPENAI_API_KEY="your-openai-api-key-here"

# Without API key: System falls back to rule-based analysis
```

## 📋 What It Does

This system provides real-time stock data analysis with optional AI-powered insights:

### 🤖 AI-Enhanced Features

- **LangChain Integration**: Uses OpenAI GPT for intelligent stock analysis
- **Sentiment Analysis**: AI-powered sentiment scoring for each stock
- **Smart Recommendations**: Buy/sell/hold recommendations with confidence scores
- **Risk Assessment**: AI categorizes stocks into low/medium/high risk
- **Market Insights**: Aggregated analysis across your entire portfolio
- **Price Targets**: AI-generated price predictions

### 📈 Stock Data Pipeline

### 🔄 Data Flow

```
yfinance → StockDataSource → Pathway Tables → AI Analysis → FastAPI Endpoints
                                ↓
                            JSON Output ← LangChain ← OpenAI GPT
```

### 📊 Features

- **Real-time stock monitoring** using yfinance API (no API keys needed!)
- **AI-powered analysis** using LangChain and OpenAI
- **RESTful API** with FastAPI for easy integration
- **Intelligent insights** with sentiment analysis and recommendations
- **Automatic caching** with smart refresh intervals
- **Fallback analysis** when AI is unavailable

### 🌐 API Endpoints

The FastAPI server provides these endpoints:

- `GET /stocks` - All latest stock data with AI analysis
- `GET /stocks/{ticker}` - Individual stock data
- `GET /analysis/{ticker}` - AI analysis for specific stock
- `GET /insights` - Market-wide AI insights and recommendations
- `GET /performance` - Performance summary and statistics
- `GET /health` - System health check
- `GET /refresh` - Force refresh all data
- `GET /docs` - Interactive API documentation

## 🛠️ Configuration

### Environment Variables

Create a `.env` file or set these environment variables:

```bash
# Optional API keys for enhanced data sources
ALPHA_VANTAGE_API_KEY=your-key-here
NEWS_API_KEY=your-key-here
PATHWAY_LICENSE_KEY=your-license-here

# Pipeline settings
NEWS_REFRESH_INTERVAL_SECONDS=300
STOCK_REFRESH_INTERVAL_SECONDS=60
OUTPUT_DIR=pathway_output

# Output options
ENABLE_CSV_OUTPUT=true
ENABLE_JSON_OUTPUT=true
ENABLE_CONSOLE_OUTPUT=true
```

### Companies to Track

Edit `config.py` to modify the companies and tickers:

```python
COMPANIES_TO_TRACK = [
    {"name": "JPMorgan Chase", "ticker": "JPM"},
    {"name": "Apple", "ticker": "AAPL"},
    # Add more companies...
]
```

## 📁 Output Files

The pipeline generates several output files in the `pathway_output/` directory:

- `news_stream.csv` - All scraped news articles with metadata
- `stock_stream.csv` - All stock price updates with timestamps
- `latest_stocks.jsonl` - Latest stock prices by ticker (for dashboard)
- `news_summary.jsonl` - News article counts by ticker (for dashboard)

## 🖥️ Dashboard

The included dashboard provides a real-time view of your data:

```bash
python dashboard.py
```

Features:

- Live stock price updates with change indicators
- News article counts by ticker
- Formatted tables with color coding
- Auto-refresh every 30 seconds

## 🔧 Architecture

### Core Components

1. **NewsDataSource**: Custom Pathway connector that scrapes news from multiple sources
2. **StockDataSource**: Custom Pathway connector that fetches stock prices
3. **Pipeline**: Pathway tables with transformations and aggregations
4. **Outputs**: Multiple sinks for different data consumers

### Data Schema

#### News Table

```python
id: str              # Unique article identifier
title: str           # Article headline
summary: str         # Article description
link: str            # Article URL
source: str          # Data source (Google News, Yahoo Finance)
published: str       # Publication timestamp
company: str         # Company name
ticker: str          # Stock ticker symbol
scraped_at: str      # When we scraped it
sentiment: str       # TODO: Add sentiment analysis
word_count: int      # Article length metric
```

#### Stock Table

```python
id: str              # Unique price record identifier
ticker: str          # Stock ticker symbol
price: float         # Current stock price
previous_close: float # Previous closing price
change_percent: float # Percentage change
volume: int          # Trading volume
market_cap: int      # Market capitalization
pe_ratio: float      # Price-to-earnings ratio
company_name: str    # Company name
timestamp: str       # When the price was fetched
trend: str           # "up", "down", or "flat"
price_formatted: str # Human-readable price string
```

## 🔌 Extending the Pipeline

### Adding New Data Sources

1. Create a new connector class inheriting from `pw.io.python.ConnectorSubject`
2. Implement the `run()` method to fetch and emit data
3. Add the connector to the pipeline in `create_pipeline()`

Example:

```python
class CryptoDataSource(pw.io.python.ConnectorSubject):
    def run(self):
        while True:
            # Fetch crypto data
            data = fetch_crypto_prices()
            for item in data:
                self.next(**item)
            time.sleep(60)
```

### Adding Transformations

Use Pathway's powerful transformation APIs:

```python
# Filter high-volume stocks
high_volume_stocks = stock_table.filter(pw.this.volume > 1000000)

# Calculate moving averages
# TODO: Implement time-window aggregations

# Join news with stock data
news_with_prices = enriched_news.join(
    latest_stocks,
    enriched_news.ticker == latest_stocks.ticker
)
```

## 🚨 TODO Items

The pipeline includes several TODO comments for enhancements:

### Configuration TODOs

- [ ] Add your API keys in `config.py` or environment variables
- [ ] Configure companies and tickers to track
- [ ] Adjust refresh intervals based on your needs
- [ ] Set up output destinations

### Feature TODOs

- [ ] Implement sentiment analysis for news articles
- [ ] Add proper time-based filtering for aggregations
- [ ] Integrate financial data APIs for better stock data
- [ ] Add price alerts and notifications
- [ ] Implement data validation and quality checks
- [ ] Add web-based dashboard using Streamlit or FastAPI
- [ ] Create historical data storage and analysis

### Enhancement TODOs

- [ ] Add more news sources (Reddit, Twitter, etc.)
- [ ] Implement caching for API calls
- [ ] Add data enrichment (company metadata, sector info)
- [ ] Create automated reports and summaries
- [ ] Add machine learning predictions

## 🐛 Troubleshooting

### Common Issues

1. **Import errors**: Make sure you're in the `src/app` directory when running
2. **No data appearing**: Check your internet connection and API rate limits
3. **Permission errors**: Ensure the output directory is writable
4. **Memory issues**: Reduce refresh intervals or data retention periods

### Debug Mode

Set environment variable for verbose logging:

```bash
PATHWAY_DEBUG=1 python pathway_pipeline.py
```

## 📚 Resources

- [Pathway Documentation](https://pathway.com/docs)
- [Pathway Examples](https://github.com/pathwaycom/pathway-examples)
- [Financial Data APIs](https://alpha-vantage.com/, https://polygon.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your enhancements
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
