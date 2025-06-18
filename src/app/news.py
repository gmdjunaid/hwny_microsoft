import requests
from bs4 import BeautifulSoup
import feedparser
import pandas as pd
from datetime import datetime

CSV_FILE = "news_articles.csv"

def google_news_scrape(query):
    print(f"📡 Scraping Google News for: {query}")
    url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}+stock"
    feed = feedparser.parse(url)
    articles = []
    for entry in feed.entries[:10]:
        articles.append({
            "title": entry.title,
            "summary": entry.summary,
            "link": entry.link,
            "source": "Google News",
            "published": entry.published
        })
    return articles

def yahoo_finance_scrape(ticker):
    print(f"📡 Scraping Yahoo Finance for: {ticker}")
    url = f"https://finance.yahoo.com/quote/{ticker}?p={ticker}"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")

    articles = []
    for item in soup.find_all("li", class_="js-stream-content"):
        try:
            title_tag = item.find("h3")  # type: ignore
            link_tag = item.find("a")  # type: ignore
            if not title_tag or not link_tag:
                continue
            title = title_tag.text.strip()  # type: ignore
            link = "https://finance.yahoo.com" + link_tag["href"]  # type: ignore
            published = datetime.now().isoformat()

            articles.append({
                "title": title,
                "summary": "",
                "link": link,
                "source": "Yahoo Finance",
                "published": published
            })
        except Exception as e:
            print(f"⚠️ Error parsing Yahoo article: {e}")
            continue

    return articles

def scrape_all_sources(company, ticker):
    all_articles = []
    try:
        all_articles += google_news_scrape(company)
    except Exception as e:
        print(f"❌ Google News failed: {e}")

    try:
        all_articles += yahoo_finance_scrape(ticker)
    except Exception as e:
        print(f"❌ Yahoo Finance failed: {e}")

    return all_articles

def save_articles_to_csv(articles):
    if not articles:
        print("⚠️ No articles found.")
        return

    df = pd.DataFrame(articles)
    df.drop_duplicates(subset=["title"], inplace=True)
    df.to_csv(CSV_FILE, index=False)
    print(f"✅ Saved {len(df)} articles to {CSV_FILE}")

def print_articles(articles):
    if not articles:
        print("⚠️ No articles to display.")
        return

    print("\n📰 Latest News Articles:")
    for article in articles:
        print(f"- {article['title']} ({article['source']})\n  {article['link']}\n")

def main():
    company = "JPMorgan Chase"
    ticker = "JPM"
    articles = scrape_all_sources(company, ticker)
    print_articles(articles)
    save_articles_to_csv(articles)

if __name__ == "__main__":
    main()
