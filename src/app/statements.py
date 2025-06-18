import yfinance as yf
import pandas as pd
import os
from datetime import datetime

def get_financial_statements(ticker, period="annual"):
    """
    Get financial statements for a given ticker
    period: 'annual' or 'quarterly'
    """
    try:
        stock = yf.Ticker(ticker)
        
        # Get financial statements
        income_stmt = stock.financials
        balance_sheet = stock.balance_sheet
        cash_flow = stock.cashflow
        
        return {
            'income_statement': income_stmt,
            'balance_sheet': balance_sheet,
            'cash_flow': cash_flow
        }
    except Exception as e:
        print(f"❌ Error getting data for {ticker}: {e}")
        return None

def save_to_csv(data, ticker, output_dir="financial_data"):
    """
    Save financial statements to CSV files
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    for statement_type, df in data.items():
        if df is not None and not df.empty:
            filename = f"{output_dir}/{ticker}_{statement_type}_{timestamp}.csv"
            df.to_csv(filename)
            print(f"✅ Saved {statement_type} to {filename}")
        else:
            print(f"⚠️ No data available for {statement_type}")

def get_key_metrics(ticker):
    """
    Get key financial metrics
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        metrics = {
            'Market Cap': info.get('marketCap'),
            'Enterprise Value': info.get('enterpriseValue'),
            'P/E Ratio': info.get('trailingPE'),
            'Forward P/E': info.get('forwardPE'),
            'PEG Ratio': info.get('pegRatio'),
            'Price to Book': info.get('priceToBook'),
            'Debt to Equity': info.get('debtToEquity'),
            'ROE': info.get('returnOnEquity'),
            'ROA': info.get('returnOnAssets'),
            'Profit Margin': info.get('profitMargins'),
            'Operating Margin': info.get('operatingMargins'),
            'Current Ratio': info.get('currentRatio'),
            'Quick Ratio': info.get('quickRatio'),
            'Dividend Yield': info.get('dividendYield'),
            'Beta': info.get('beta'),
            '52 Week High': info.get('fiftyTwoWeekHigh'),
            '52 Week Low': info.get('fiftyTwoWeekLow'),
            '50 Day Average': info.get('fiftyDayAverage'),
            '200 Day Average': info.get('twoHundredDayAverage')
        }
        
        return pd.DataFrame([metrics])
    except Exception as e:
        print(f"❌ Error getting metrics for {ticker}: {e}")
        return None

def main():
    # List of companies to analyze
    companies = ["AAPL", "MSFT", "GOOGL", "JPM", "TSLA", "AMZN", "META", "NVDA"]
    
    print("📊 Financial Statement Scraper")
    print("=" * 40)
    
    for ticker in companies:
        print(f"\n🔍 Analyzing {ticker}...")
        
        # Get financial statements
        statements = get_financial_statements(ticker)
        
        if statements:
            # Save statements to CSV
            save_to_csv(statements, ticker)
            
            # Get and save key metrics
            metrics = get_key_metrics(ticker)
            if metrics is not None:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                metrics_file = f"financial_data/{ticker}_key_metrics_{timestamp}.csv"
                metrics.to_csv(metrics_file, index=False)
                print(f"✅ Saved key metrics to {metrics_file}")
        
        print("-" * 40)
    
    print("\n🎉 Analysis complete! Check the 'financial_data' folder for CSV files.")

if __name__ == "__main__":
    main()
