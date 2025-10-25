#!/usr/bin/env python3
"""
Database Initialization Script
This script creates all the database tables and initializes the schema.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
from dotenv import load_dotenv

load_dotenv()

def init_database():
    """Initialize the database with all tables"""
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@localhost/donation_platform")
    
    print("🔧 Initializing database...")
    print(f"Database URL: {DATABASE_URL}")
    
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        print("✅ Database tables created successfully!")
        
        # Test connection
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Test query
        result = db.execute("SELECT 1").fetchone()
        if result:
            print("✅ Database connection successful!")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        print("\n📋 Troubleshooting steps:")
        print("1. Make sure PostgreSQL is running")
        print("2. Check your DATABASE_URL in .env file")
        print("3. Ensure the database 'donation_platform' exists")
        print("4. Verify your PostgreSQL credentials")
        return False
    
    return True

if __name__ == "__main__":
    success = init_database()
    if success:
        print("\n🎉 Database initialization completed!")
        print("You can now start the application.")
    else:
        print("\n❌ Database initialization failed.")
        print("Please fix the issues above and try again.")
