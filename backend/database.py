from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL Database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@localhost/donation_platform")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# MongoDB Database
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = MongoClient(MONGODB_URL)
mongodb = client.donation_platform

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# MongoDB Collections
city_rankings_collection = mongodb.city_rankings
user_activities_collection = mongodb.user_activities
analytics_collection = mongodb.analytics
