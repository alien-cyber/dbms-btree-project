from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from database import get_db, engine
from models import Base, User, Campaign, Donation, Category, Transaction, UserProfile
from schemas import (
    UserCreate, UserLogin, User as UserSchema, Token,
    CampaignCreate, Campaign as CampaignSchema,
    DonationCreate, Donation as DonationSchema,
    CategoryCreate, Category as CategorySchema,
    CityRankingResponse
)
from auth import (
    authenticate_user, create_access_token, get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash
)
from city_ranking_service import city_ranking_service

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Donation Platform API", version="1.0.0")

# User Registration and Authentication
@app.post("/register", response_model=UserSchema)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        city=user.city,
        phone_number=user.phone_number,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create user profile
    user_profile = UserProfile(user_id=db_user.id)
    db.add(user_profile)
    db.commit()
    
    return db_user

@app.post("/login", response_model=Token)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# Campaign Management
@app.post("/campaigns", response_model=CampaignSchema)
async def create_campaign(
    campaign: CampaignCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_campaign = Campaign(
        title=campaign.title,
        description=campaign.description,
        target_amount=campaign.target_amount,
        creator_id=current_user.id,
        category_id=campaign.category_id
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    
    # Update user profile
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if user_profile:
        user_profile.total_campaigns += 1
        db.commit()
    
    return db_campaign

@app.get("/campaigns", response_model=List[CampaignSchema])
async def get_campaigns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).offset(skip).limit(limit).all()
    return campaigns

@app.get("/campaigns/{campaign_id}", response_model=CampaignSchema)
async def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

# Donation Management
@app.post("/donations", response_model=DonationSchema)
async def create_donation(
    donation: DonationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify campaign exists
    campaign = db.query(Campaign).filter(Campaign.id == donation.campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Create donation
    db_donation = Donation(
        amount=donation.amount,
        donor_id=current_user.id,
        campaign_id=donation.campaign_id,
        message=donation.message,
        is_anonymous=donation.is_anonymous
    )
    db.add(db_donation)
    db.flush()  # Flush to get the donation ID without committing
    
    # Update campaign amount
    campaign.current_amount += donation.amount
    
    # Create transaction record
    transaction = Transaction(
        donation_id=db_donation.id,
        transaction_type="donation",
        amount=donation.amount,
        status="completed",
        payment_method="online",
        transaction_id=f"TXN_{db_donation.id}_{current_user.id}"
    )
    db.add(transaction)
    
    # Update user profile
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if user_profile:
        user_profile.total_donated += donation.amount
    
    db.commit()
    db.refresh(db_donation)
    
    # Update city ranking in MongoDB
    await city_ranking_service.update_city_ranking(
        current_user.city, donation.amount, current_user.id
    )
    
    return db_donation

@app.get("/donations", response_model=List[DonationSchema])
async def get_donations(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    donations = db.query(Donation).filter(Donation.donor_id == current_user.id).offset(skip).limit(limit).all()
    return donations

# City Rankings
@app.get("/city-rankings", response_model=CityRankingResponse)
async def get_city_rankings(current_user: User = Depends(get_current_active_user)):
    top_cities = await city_ranking_service.get_top_cities(3)
    city_context = await city_ranking_service.get_city_context(current_user.city, 3)
    
    return CityRankingResponse(
        top_cities=top_cities,
        user_city_context=city_context["user_city_context"],
        user_city_rank=city_context["user_city_rank"]
    )

@app.get("/city-rankings/{city}")
async def get_city_statistics(city: str):
    stats = await city_ranking_service.get_city_statistics(city)
    if not stats:
        raise HTTPException(status_code=404, detail="City not found")
    return stats

@app.get("/global-statistics")
async def get_global_statistics():
    return await city_ranking_service.get_global_statistics()

# Category Management
@app.post("/categories", response_model=CategorySchema)
async def create_category(
    category: CategoryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_category = Category(name=category.name, description=category.description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/categories", response_model=List[CategorySchema])
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

# User Profile Management
@app.get("/profile")
async def get_user_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {
        "user": current_user,
        "profile": profile
    }

@app.put("/profile")
async def update_user_profile(
    bio: str = None,
    profile_picture: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if bio is not None:
        profile.bio = bio
    if profile_picture is not None:
        profile.profile_picture = profile_picture
    
    db.commit()
    return profile

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
