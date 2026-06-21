import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

MONGODB_URI = os.getenv("MONGODB_URI")

print("MongoDB URI:", MONGODB_URI)

client = MongoClient(MONGODB_URI)

db = client["haven"]

profiles_collection = db["profiles"]
conversations_collection = db["conversations"]
users_collection = db["users"]
chat_sessions_collection = db["chat_sessions"]
memory_collection = db["memory"]