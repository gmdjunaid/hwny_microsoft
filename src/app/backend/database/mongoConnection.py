from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")

db = client["FinExCompData"]
companyInfo = db["companyData"]

companyInfo.insert_one({
    "companyName": "IBM",
    "industry": "Technology",
    "revenue": 3600000000,
    "burnRate": 50000,
    "topExpenses": ["Rent", "Salaries", "Marketing"],
    "headCountGrowth": 20,
    "breakEvenAnalysis": 100000
})


# Company Name
# Industry
# Total Revenue
# Burn Rate
# Top 3 Expenses
# Head Count Growth over Time
# Break Even Analysis