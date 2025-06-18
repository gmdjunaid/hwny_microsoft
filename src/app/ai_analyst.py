"""
AI Stock Analyst using LangChain
===============================

This module uses LangChain and OpenAI to provide intelligent analysis
of stock data from the Pathway pipeline. It includes:

- Market sentiment analysis
- Stock performance interpretation
- Investment recommendations
- Risk assessment
- Market trend analysis

TODO: Set your OPENAI_API_KEY environment variable to enable AI features
"""

import os
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
from dataclasses import dataclass, asdict

try:
    from langchain_openai import ChatOpenAI
    from langchain.prompts import ChatPromptTemplate
    from langchain.schema import HumanMessage, SystemMessage
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False

from config import APIConfig


@dataclass
class StockAnalysis:
    """AI stock analysis results"""
    ticker: str
    analysis_timestamp: str
    sentiment: str
    confidence_score: float
    key_insights: List[str]
    recommendation: str
    risk_level: str
    price_target: Optional[float]
    reasoning: str


@dataclass  
class MarketAnalysis:
    """Overall market analysis"""
    analysis_timestamp: str
    market_sentiment: str
    top_opportunities: List[str]
    major_risks: List[str]
    sector_outlook: Dict[str, str]
    summary: str


class AIStockAnalyst:
    """LangChain-powered stock analyst"""
    
    def __init__(self):
        self.enabled = LANGCHAIN_AVAILABLE and bool(APIConfig.OPENAI_API_KEY)
        
        if self.enabled:
            self.chat_model = ChatOpenAI(
                model="gpt-3.5-turbo",
                temperature=0.3,
                max_tokens=1000,
                api_key=APIConfig.OPENAI_API_KEY
            )
            self._setup_prompts()
        else:
            print("⚠️ AI Analyst disabled: Missing dependencies or API key")
    
    def _setup_prompts(self):
        """Setup LangChain prompt templates"""
        
        self.stock_prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="You are an expert financial analyst. Provide concise analysis in valid JSON format only."),
            HumanMessage(content="""Analyze: {ticker} - ${price} ({change_percent}% change)
            Volume: {volume}, Sector: {sector}
            
            Return valid JSON:
            {{
                "sentiment": "bullish/bearish/neutral",
                "confidence_score": 0.8,
                "key_insights": ["insight1", "insight2"],
                "recommendation": "buy/sell/hold", 
                "risk_level": "low/medium/high",
                "price_target": 150.0,
                "reasoning": "Brief explanation"
            }}""")
        ])
    
    def analyze_stock(self, stock_data: Dict[str, Any]) -> Optional[StockAnalysis]:
        """Analyze individual stock"""
        if not self.enabled:
            return self._create_fallback_analysis(stock_data)
        
        try:
            prompt_data = {
                "ticker": stock_data.get("ticker", ""),
                "price": stock_data.get("price", 0),
                "change_percent": stock_data.get("change_percent", 0),
                "volume": stock_data.get("volume", 0),
                "sector": stock_data.get("sector", "Unknown")
            }
            
            response = self.chat_model.invoke(self.stock_prompt.format_messages(**prompt_data))
            
            try:
                analysis_data = json.loads(response.content.strip())
                
                return StockAnalysis(
                    ticker=prompt_data["ticker"],
                    analysis_timestamp=datetime.now().isoformat(),
                    sentiment=analysis_data.get("sentiment", "neutral"),
                    confidence_score=float(analysis_data.get("confidence_score", 0.5)),
                    key_insights=analysis_data.get("key_insights", []),
                    recommendation=analysis_data.get("recommendation", "hold"),
                    risk_level=analysis_data.get("risk_level", "medium"),
                    price_target=analysis_data.get("price_target"),
                    reasoning=analysis_data.get("reasoning", "AI analysis")
                )
                
            except (json.JSONDecodeError, ValueError, KeyError):
                return self._create_fallback_analysis(stock_data)
        
        except Exception as e:
            print(f"⚠️ AI analysis error for {stock_data.get('ticker')}: {e}")
            return self._create_fallback_analysis(stock_data)
    
    def _create_fallback_analysis(self, stock_data: Dict[str, Any]) -> StockAnalysis:
        """Create basic analysis when AI is unavailable"""
        change_percent = stock_data.get("change_percent", 0)
        
        if change_percent > 2:
            sentiment, recommendation = "bullish", "hold"
        elif change_percent < -2:
            sentiment, recommendation = "bearish", "hold"
        else:
            sentiment, recommendation = "neutral", "hold"
        
        return StockAnalysis(
            ticker=stock_data.get("ticker", ""),
            analysis_timestamp=datetime.now().isoformat(),
            sentiment=sentiment,
            confidence_score=0.5,
            key_insights=[f"Price change: {change_percent}%"],
            recommendation=recommendation,
            risk_level="medium",
            price_target=None,
            reasoning="Basic rule-based analysis"
        )


# Global instance
ai_analyst = AIStockAnalyst()


def analyze_stock_data(stock_data: Dict[str, Any]) -> Optional[StockAnalysis]:
    """Analyze stock data using AI"""
    return ai_analyst.analyze_stock(stock_data)


def get_analysis_dict(analysis: StockAnalysis) -> Dict[str, Any]:
    """Convert analysis to dictionary"""
    return asdict(analysis) if analysis else {} 