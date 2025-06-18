from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")

db = client["FinExBankData"]
balance = db["Balance"]
transactions = db["Transactions"]

balance.insert_one({
    "value": 500000,
    "date": datetime.strptime("2025-06-17", "%Y-%m-%d"),
    "changeFromPrevious": -130.50
})

transactions.insert_one({
    "sentTo": "Client1",
    "amount": 100000,
    "date": datetime.strptime("2025-06-17", "%Y-%m-%d"),
    "description": "Requested service from client1"
})
