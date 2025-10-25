from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    city: str
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfile(BaseModel):
    id: int
    user_id: int
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    total_donated: float
    total_campaigns: int
    verification_status: str
    
    class Config:
        from_attributes = True

# Campaign Schemas
class CampaignBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_amount: float
    category_id: Optional[int] = None

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id: int
    current_amount: float
    creator_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Donation Schemas
class DonationBase(BaseModel):
    amount: float
    campaign_id: int
    message: Optional[str] = None
    is_anonymous: bool = False

class DonationCreate(DonationBase):
    pass

class Donation(DonationBase):
    id: int
    donor_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# City Ranking Schemas
class CityRanking(BaseModel):
    city: str
    total_donations: float
    total_donors: int
    rank: int
    average_donation: float

class CityRankingResponse(BaseModel):
    top_cities: List[CityRanking]
    user_city_context: List[CityRanking]
    user_city_rank: int

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
