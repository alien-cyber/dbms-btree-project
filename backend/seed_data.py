#!/usr/bin/env python3
"""
Sample Data Seeding Script for Donation Platform
This script creates sample data to demonstrate the platform functionality.
"""

import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import *
from city_ranking_service import city_ranking_service
import os
from dotenv import load_dotenv

load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@localhost/donation_platform")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Sample data
CITIES = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
    "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis",
    "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville",
    "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville"
]

CATEGORIES = [
    {"name": "Education", "description": "Educational initiatives and scholarships"},
    {"name": "Healthcare", "description": "Medical care and health programs"},
    {"name": "Environment", "description": "Environmental conservation and sustainability"},
    {"name": "Disaster Relief", "description": "Emergency response and disaster recovery"},
    {"name": "Community", "description": "Local community development projects"},
    {"name": "Technology", "description": "Tech education and digital inclusion"},
    {"name": "Arts & Culture", "description": "Supporting arts and cultural programs"},
    {"name": "Animal Welfare", "description": "Animal rescue and welfare programs"}
]

CAMPAIGNS = [
    {
        "title": "Clean Water for Rural Communities",
        "description": "Providing clean drinking water access to rural areas",
        "target_amount": 50000.0,
        "category": "Healthcare"
    },
    {
        "title": "STEM Education for Underprivileged Kids",
        "description": "Funding science and technology education programs",
        "target_amount": 75000.0,
        "category": "Education"
    },
    {
        "title": "Reforestation Project",
        "description": "Planting trees to combat climate change",
        "target_amount": 30000.0,
        "category": "Environment"
    },
    {
        "title": "Emergency Food Relief",
        "description": "Providing food assistance during natural disasters",
        "target_amount": 40000.0,
        "category": "Disaster Relief"
    },
    {
        "title": "Community Garden Initiative",
        "description": "Creating sustainable community gardens",
        "target_amount": 25000.0,
        "category": "Community"
    },
    {
        "title": "Digital Literacy Program",
        "description": "Teaching computer skills to seniors",
        "target_amount": 35000.0,
        "category": "Technology"
    },
    {
        "title": "Local Theater Renovation",
        "description": "Restoring historic community theater",
        "target_amount": 60000.0,
        "category": "Arts & Culture"
    },
    {
        "title": "Animal Shelter Expansion",
        "description": "Expanding local animal shelter facilities",
        "target_amount": 45000.0,
        "category": "Animal Welfare"
    }
]

def create_sample_users(db):
    """Create sample users with realistic data"""
    print("Creating sample users...")
    
    users = []
    for i in range(50):
        city = random.choice(CITIES)
        user = User(
            username=f"user{i+1:03d}",
            email=f"user{i+1:03d}@example.com",
            full_name=f"User {i+1}",
            city=city,
            phone_number=f"+1-{random.randint(200, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
            hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K",  # password: "password"
            is_active=True
        )
        db.add(user)
        users.append(user)
    
    db.commit()
    print(f"Created {len(users)} users")
    return users

def create_sample_categories(db):
    """Create sample categories"""
    print("Creating sample categories...")
    
    categories = []
    for cat_data in CATEGORIES:
        category = Category(
            name=cat_data["name"],
            description=cat_data["description"]
        )
        db.add(category)
        categories.append(category)
    
    db.commit()
    print(f"Created {len(categories)} categories")
    return categories

def create_sample_campaigns(db, users, categories):
    """Create sample campaigns"""
    print("Creating sample campaigns...")
    
    campaigns = []
    category_map = {cat.name: cat for cat in categories}
    
    for campaign_data in CAMPAIGNS:
        creator = random.choice(users)
        category = category_map[campaign_data["category"]]
        
        campaign = Campaign(
            title=campaign_data["title"],
            description=campaign_data["description"],
            target_amount=campaign_data["target_amount"],
            creator_id=creator.id,
            category_id=category.id,
            status="active"
        )
        db.add(campaign)
        campaigns.append(campaign)
    
    db.commit()
    print(f"Created {len(campaigns)} campaigns")
    return campaigns

def create_sample_donations(db, users, campaigns):
    """Create sample donations and update city rankings"""
    print("Creating sample donations...")
    
    donations = []
    total_donations = 0
    
    for _ in range(200):  # Create 200 donations
        donor = random.choice(users)
        campaign = random.choice(campaigns)
        amount = round(random.uniform(10, 1000), 2)
        
        donation = Donation(
            amount=amount,
            donor_id=donor.id,
            campaign_id=campaign.id,
            message=random.choice([
                "Great cause!",
                "Happy to help!",
                "Keep up the good work!",
                "This is important",
                "Thank you for doing this",
                None, None, None  # Some donations without messages
            ]),
            is_anonymous=random.choice([True, False])
        )
        db.add(donation)
        donations.append(donation)
        
        # Update campaign amount
        campaign.current_amount += amount
        total_donations += amount
        
        # Create transaction record
        transaction = Transaction(
            donation_id=donation.id,
            transaction_type="donation",
            amount=amount,
            status="completed",
            payment_method="online",
            transaction_id=f"TXN_{donation.id}_{donor.id}"
        )
        db.add(transaction)
    
    db.commit()
    print(f"Created {len(donations)} donations totaling ${total_donations:,.2f}")
    return donations

async def update_mongodb_rankings(db, donations):
    """Update MongoDB city rankings"""
    print("Updating MongoDB city rankings...")
    
    # Group donations by city
    city_donations = {}
    for donation in donations:
        donor = db.query(User).filter(User.id == donation.donor_id).first()
        city = donor.city
        
        if city not in city_donations:
            city_donations[city] = []
        city_donations[city].append(donation)
    
    # Update MongoDB rankings
    for city, city_donation_list in city_donations.items():
        total_amount = sum(d.amount for d in city_donation_list)
        unique_donors = len(set(d.donor_id for d in city_donation_list))
        
        # Update city ranking for each donation
        for donation in city_donation_list:
            await city_ranking_service.update_city_ranking(
                city, donation.amount, donation.donor_id
            )
    
    print(f"Updated rankings for {len(city_donations)} cities")

def create_user_profiles(db, users):
    """Create user profiles"""
    print("Creating user profiles...")
    
    profiles = []
    for user in users:
        profile = UserProfile(
            user_id=user.id,
            bio=f"Passionate about making a difference in {user.city}",
            total_donated=0.0,  # Will be updated by donations
            total_campaigns=0,
            verification_status=random.choice(["verified", "unverified", "pending"])
        )
        db.add(profile)
        profiles.append(profile)
    
    db.commit()
    print(f"Created {len(profiles)} user profiles")
    return profiles

def update_user_statistics(db, users, donations, campaigns):
    """Update user statistics based on donations and campaigns"""
    print("Updating user statistics...")
    
    # Update total donated amounts
    user_donations = {}
    for donation in donations:
        donor_id = donation.donor_id
        if donor_id not in user_donations:
            user_donations[donor_id] = 0
        user_donations[donor_id] += donation.amount
    
    # Update campaign counts
    user_campaigns = {}
    for campaign in campaigns:
        creator_id = campaign.creator_id
        if creator_id not in user_campaigns:
            user_campaigns[creator_id] = 0
        user_campaigns[creator_id] += 1
    
    # Update profiles
    for user in users:
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if profile:
            profile.total_donated = user_donations.get(user.id, 0.0)
            profile.total_campaigns = user_campaigns.get(user.id, 0)

def create_sample_notifications(db, users):
    """Create sample notifications"""
    print("Creating sample notifications...")
    
    notifications = []
    for user in random.sample(users, 20):  # Notify 20 random users
        notification = Notification(
            user_id=user.id,
            title="Welcome to DonateHub!",
            message=f"Thank you for joining our community, {user.full_name}! Start exploring campaigns and help your city climb the rankings.",
            notification_type="system",
            is_read=random.choice([True, False])
        )
        db.add(notification)
        notifications.append(notification)
    
    db.commit()
    print(f"Created {len(notifications)} notifications")

async def main():
    """Main seeding function"""
    print("🌱 Starting database seeding...")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Create sample data
        users = create_sample_users(db)
        categories = create_sample_categories(db)
        campaigns = create_sample_campaigns(db, users, categories)
        donations = create_sample_donations(db, users, campaigns)
        profiles = create_user_profiles(db, users)
        
        # Update statistics
        update_user_statistics(db, users, donations, campaigns)
        create_sample_notifications(db, users)
        
        # Update MongoDB rankings
        await update_mongodb_rankings(db, donations)
        
        db.commit()
        print("✅ Database seeding completed successfully!")
        
        # Print summary
        print("\n📊 Sample Data Summary:")
        print(f"   Users: {len(users)}")
        print(f"   Categories: {len(categories)}")
        print(f"   Campaigns: {len(campaigns)}")
        print(f"   Donations: {len(donations)}")
        print(f"   Total Donation Amount: ${sum(d.amount for d in donations):,.2f}")
        print(f"   Cities Represented: {len(set(u.city for u in users))}")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(main())
