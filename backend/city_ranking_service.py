from pymongo import MongoClient, ASCENDING, DESCENDING
from database import city_rankings_collection, user_activities_collection
from typing import List, Dict, Any
from datetime import datetime
import asyncio

class CityRankingService:
    def __init__(self):
        self.collection = city_rankings_collection
        self.activities_collection = user_activities_collection
        self._create_indexes()
    
    def _create_indexes(self):
        """Create MongoDB indexes for efficient querying"""
        # Compound index for city rankings
        self.collection.create_index([
            ("total_donations", DESCENDING),
            ("city", ASCENDING)
        ])
        
        # Index for city lookups
        self.collection.create_index("city", unique=True)
        
        # Index for user activities
        self.activities_collection.create_index([
            ("user_id", ASCENDING),
            ("timestamp", DESCENDING)
        ])
        
        # Index for city-based activity queries
        self.activities_collection.create_index([
            ("city", ASCENDING),
            ("activity_type", ASCENDING)
        ])
    
    async def update_city_ranking(self, city: str, donation_amount: float, donor_id: int):
        """Update city ranking when a donation is made"""
        # Update city ranking document
        self.collection.update_one(
            {"city": city},
            {
                "$inc": {
                    "total_donations": donation_amount,
                    "total_donors": 1,
                    "donation_count": 1
                },
                "$addToSet": {"donor_ids": donor_id},
                "$set": {"last_updated": datetime.utcnow()}
            },
            upsert=True
        )
        
        # Log user activity
        await self._log_user_activity(donor_id, city, "donation", donation_amount)
        
        # Recalculate rankings
        await self._recalculate_rankings()
    
    async def _log_user_activity(self, user_id: int, city: str, activity_type: str, amount: float = None):
        """Log user activity for analytics"""
        activity = {
            "user_id": user_id,
            "city": city,
            "activity_type": activity_type,
            "amount": amount,
            "timestamp": datetime.utcnow()
        }
        self.activities_collection.insert_one(activity)
    
    async def _recalculate_rankings(self):
        """Recalculate city rankings based on total donations"""
        # Get all cities sorted by total donations
        cities = list(self.collection.find().sort("total_donations", DESCENDING))
        
        # Update ranks
        for rank, city_doc in enumerate(cities, 1):
            self.collection.update_one(
                {"_id": city_doc["_id"]},
                {
                    "$set": {
                        "rank": rank,
                        "average_donation": city_doc["total_donations"] / city_doc["donation_count"]
                    }
                }
            )
    
    async def get_top_cities(self, limit: int = 3) -> List[Dict[str, Any]]:
        """Get top N cities by total donations"""
        cities = list(self.collection.find().sort("total_donations", DESCENDING).limit(limit))
        return [
            {
                "city": city["city"],
                "total_donations": city["total_donations"],
                "total_donors": city["total_donors"],
                "rank": city["rank"],
                "average_donation": city["average_donation"]
            }
            for city in cities
        ]
    
    async def get_city_context(self, user_city: str, context_size: int = 3) -> Dict[str, Any]:
        """Get user's city ranking context (3 cities above and below)"""
        # Find user's city rank
        user_city_doc = self.collection.find_one({"city": user_city})
        if not user_city_doc:
            return {"user_city_rank": None, "user_city_context": []}
        
        user_rank = user_city_doc["rank"]
        
        # Get cities around user's city
        start_rank = max(1, user_rank - context_size)
        end_rank = user_rank + context_size
        
        context_cities = list(
            self.collection.find(
                {"rank": {"$gte": start_rank, "$lte": end_rank}}
            ).sort("rank", ASCENDING)
        )
        
        return {
            "user_city_rank": user_rank,
            "user_city_context": [
                {
                    "city": city["city"],
                    "total_donations": city["total_donations"],
                    "total_donors": city["total_donors"],
                    "rank": city["rank"],
                    "average_donation": city["average_donation"]
                }
                for city in context_cities
            ]
        }
    
    async def get_city_statistics(self, city: str) -> Dict[str, Any]:
        """Get detailed statistics for a specific city"""
        city_doc = self.collection.find_one({"city": city})
        if not city_doc:
            return None
        
        # Get recent activities for this city
        recent_activities = list(
            self.activities_collection.find(
                {"city": city}
            ).sort("timestamp", DESCENDING).limit(10)
        )
        
        return {
            "city": city_doc["city"],
            "total_donations": city_doc["total_donations"],
            "total_donors": city_doc["total_donors"],
            "rank": city_doc["rank"],
            "average_donation": city_doc["average_donation"],
            "donation_count": city_doc["donation_count"],
            "last_updated": city_doc["last_updated"],
            "recent_activities": recent_activities
        }
    
    async def get_global_statistics(self) -> Dict[str, Any]:
        """Get global platform statistics"""
        total_cities = self.collection.count_documents({})
        total_donations = sum(
            city["total_donations"] 
            for city in self.collection.find({}, {"total_donations": 1})
        )
        total_donors = sum(
            city["total_donors"] 
            for city in self.collection.find({}, {"total_donors": 1})
        )
        
        return {
            "total_cities": total_cities,
            "total_donations": total_donations,
            "total_donors": total_donors,
            "average_donation_per_city": total_donations / total_cities if total_cities > 0 else 0
        }

# Global instance
city_ranking_service = CityRankingService()
