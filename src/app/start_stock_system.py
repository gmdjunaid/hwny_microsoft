"""
Stock System Startup Script
===========================

Simple script to start both the Pathway pipeline and FastAPI server.
Handles process management and provides a clean shutdown.

Usage:
    python3 start_stock_system.py
"""

import subprocess
import sys
import time
import signal
import os
from rich.console import Console
from rich.panel import Panel

console = Console()

class StockSystemManager:
    def __init__(self):
        self.pipeline_process = None
        self.api_process = None
        self.running = False
    
    def start_pipeline(self):
        """Start the Pathway pipeline"""
        console.print("🚀 Starting Pathway stock pipeline...")
        try:
            self.pipeline_process = subprocess.Popen(
                [sys.executable, "stock_api_pipeline.py"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            console.print("✅ Pipeline started")
            return True
        except Exception as e:
            console.print(f"❌ Failed to start pipeline: {e}")
            return False
    
    def start_api(self):
        """Start the FastAPI server"""
        console.print("🌐 Starting FastAPI server...")
        try:
            # Give pipeline a moment to initialize
            time.sleep(3)
            
            self.api_process = subprocess.Popen(
                [sys.executable, "-m", "uvicorn", "stock_api:app", "--host", "0.0.0.0", "--port", "8000"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            console.print("✅ API server started")
            console.print("🌐 API available at: http://localhost:8000")
            console.print("📖 API docs at: http://localhost:8000/docs")
            return True
        except Exception as e:
            console.print(f"❌ Failed to start API server: {e}")
            return False
    
    def stop_all(self):
        """Stop all processes"""
        console.print("\\n⏹️ Stopping all processes...")
        
        if self.api_process:
            self.api_process.terminate()
            try:
                self.api_process.wait(timeout=5)
                console.print("✅ API server stopped")
            except subprocess.TimeoutExpired:
                self.api_process.kill()
                console.print("🔥 API server force killed")
        
        if self.pipeline_process:
            self.pipeline_process.terminate()
            try:
                self.pipeline_process.wait(timeout=5)
                console.print("✅ Pipeline stopped")
            except subprocess.TimeoutExpired:
                self.pipeline_process.kill()
                console.print("🔥 Pipeline force killed")
        
        self.running = False
    
    def run(self):
        """Main run loop"""
        console.print(Panel.fit(
            "🏢 Stock Data System\\n\\n"
            "• Pathway Pipeline: Real-time stock data streaming\\n"
            "• FastAPI Server: REST API endpoints\\n"
            "• yfinance: No API keys needed!\\n\\n"
            "Press Ctrl+C to stop",
            title="Starting Stock System",
            border_style="green"
        ))
        
        # Start processes
        if not self.start_pipeline():
            return False
        
        if not self.start_api():
            self.stop_all()
            return False
        
        self.running = True
        
        # Monitor processes
        try:
            console.print("\\n✨ System running! Available endpoints:")
            console.print("  • GET /stocks - All stock data")
            console.print("  • GET /stocks/AAPL - Specific stock")
            console.print("  • GET /health - System health")
            console.print("  • GET /performance - Performance summary")
            console.print("\\n⌨️ Press Ctrl+C to stop the system")
            
            while self.running:
                # Check if processes are still running
                if self.pipeline_process and self.pipeline_process.poll() is not None:
                    console.print("❌ Pipeline process died!")
                    break
                
                if self.api_process and self.api_process.poll() is not None:
                    console.print("❌ API process died!")
                    break
                
                time.sleep(1)
                
        except KeyboardInterrupt:
            console.print("\\n👋 Shutdown requested by user")
        finally:
            self.stop_all()
        
        return True

def signal_handler(signum, frame):
    """Handle shutdown signals"""
    console.print("\\n🛑 Received shutdown signal")
    sys.exit(0)

def main():
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Check if we're in the right directory
    if not os.path.exists("stock_api_pipeline.py"):
        console.print("❌ Please run this script from the src/app directory")
        console.print("💡 Run: cd src/app && python3 start_stock_system.py")
        return False
    
    # Check dependencies
    try:
        import pathway
        import yfinance
        import fastapi
        import uvicorn
    except ImportError as e:
        console.print(f"❌ Missing dependency: {e}")
        console.print("💡 Run: pip3 install -r ../../requirements.txt")
        return False
    
    # Start the system
    manager = StockSystemManager()
    return manager.run()

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 