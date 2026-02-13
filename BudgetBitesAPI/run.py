#!/usr/bin/env python
"""
Simple startup script for BudgetBites API
Run from the project root: python run.py
"""
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

from src.server.app import app
from src.utils.config import get_setting
import uvicorn


if __name__ == "__main__":
    host = get_setting("app.host", "0.0.0.0")
    try:
        port = int(get_setting("app.port", 8080))
    except (ValueError, TypeError):
        port = 8080
    
    print(f"Starting BudgetBites API on {host}:{port}...")
    uvicorn.run(app, host=host, port=port)
