# Donation Platform - Comprehensive DBMS Project

## 🎯 Project Overview

This is a comprehensive money donation platform that showcases advanced database management concepts using both **SQL (PostgreSQL)** and **NoSQL (MongoDB)** databases. The platform features city-based rankings with MongoDB indexing for efficient queries and comprehensive user data management with SQL tables.

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.8+
- **SQL Database**: PostgreSQL for structured data
- **NoSQL Database**: MongoDB for city rankings and analytics
- **Authentication**: JWT-based authentication
- **API Documentation**: Automatic OpenAPI/Swagger documentation

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Context API for authentication
- **HTTP Client**: Axios for API communication

## 📊 Database Design

### SQL Tables (PostgreSQL)
1. **users** - User registration and authentication
2. **campaigns** - Donation campaigns
3. **donations** - Individual donations
4. **categories** - Campaign categories
5. **transactions** - Payment transactions
6. **user_profiles** - Extended user information
7. **notifications** - User notifications
8. **campaign_updates** - Campaign progress updates
9. **donation_goals** - Campaign milestone goals
10. **user_badges** - Achievement system
11. **campaign_analytics** - Campaign performance metrics
12. **payment_methods** - User payment options
13. **refunds** - Refund management
14. **city_statistics** - City-level statistics

### MongoDB Collections (with Indexing)
1. **city_rankings** - City donation rankings with compound indexes
2. **user_activities** - User activity logs with time-based indexes
3. **analytics** - Platform-wide analytics data

## 🚀 Key Features

### Core Functionality
- ✅ User registration with mandatory city information
- ✅ JWT-based authentication and authorization
- ✅ Campaign creation and management
- ✅ Donation processing with transaction tracking
- ✅ Real-time city ranking updates

### City Rankings System
- ✅ **Top 3 Cities Display**: Shows the highest donating cities
- ✅ **User Context View**: Displays user's city + 3 cities above and below
- ✅ **MongoDB Indexing**: Optimized queries using compound indexes
- ✅ **Real-time Updates**: Rankings update immediately after donations

### Advanced DBMS Features
- ✅ **Database Relationships**: Complex foreign key relationships
- ✅ **Indexing Strategy**: Both SQL and NoSQL indexing
- ✅ **Transaction Management**: ACID compliance for donations
- ✅ **Data Integrity**: Constraints and validations
- ✅ **Analytics**: Comprehensive reporting and statistics

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- MongoDB 4.4+

### Quick Setup
```bash
# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

### Manual Setup

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Start the server
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Database Setup
```bash
# PostgreSQL
createdb donation_platform

# MongoDB (start service)
mongod
```

## 🌐 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user info

### Campaigns
- `GET /campaigns` - List all campaigns
- `POST /campaigns` - Create new campaign
- `GET /campaigns/{id}` - Get campaign details

### Donations
- `POST /donations` - Make a donation
- `GET /donations` - Get user's donations

### City Rankings
- `GET /city-rankings` - Get city rankings with user context
- `GET /city-rankings/{city}` - Get specific city statistics
- `GET /global-statistics` - Get platform-wide statistics

### Categories
- `GET /categories` - List all categories
- `POST /categories` - Create new category

### Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

## 📈 MongoDB Indexing Strategy

### City Rankings Collection
```javascript
// Compound index for efficient ranking queries
db.city_rankings.createIndex({
  "total_donations": -1,
  "city": 1
})

// Unique index for city lookups
db.city_rankings.createIndex({
  "city": 1
}, {
  "unique": true
})
```

### User Activities Collection
```javascript
// Time-based queries
db.user_activities.createIndex({
  "user_id": 1,
  "timestamp": -1
})

// City-based analytics
db.user_activities.createIndex({
  "city": 1,
  "activity_type": 1
})
```

## 🎨 Frontend Features

### Pages
- **Dashboard**: Overview with statistics and recent activity
- **City Rankings**: Interactive city leaderboard
- **Campaigns**: Browse and create campaigns
- **Profile**: User profile management

### Components
- Responsive design with Tailwind CSS
- Real-time data updates
- Interactive forms with validation
- Modal dialogs for actions
- Loading states and error handling

## 🔧 Configuration

### Environment Variables
```env
# Database URLs
DATABASE_URL=postgresql://username:password@localhost/donation_platform
MONGODB_URL=mongodb://localhost:27017/donation_platform

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📚 DBMS Concepts Demonstrated

### SQL Concepts
- **Normalization**: Proper table design with minimal redundancy
- **Foreign Keys**: Referential integrity between tables
- **Indexes**: Performance optimization for queries
- **Transactions**: ACID properties for data consistency
- **Constraints**: Data validation and integrity
- **Views**: Complex query abstraction (can be added)

### NoSQL Concepts
- **Document Storage**: Flexible schema for analytics
- **Indexing**: Compound and single-field indexes
- **Aggregation**: Complex data processing
- **Sharding**: Horizontal scaling preparation
- **Replication**: Data redundancy and availability

### Advanced Features
- **Hybrid Architecture**: SQL + NoSQL integration
- **Real-time Updates**: Immediate ranking recalculation
- **Analytics**: Comprehensive reporting system
- **Scalability**: Designed for growth

## 🚀 Running the Application

1. **Start Databases**:
   ```bash
   # PostgreSQL
   pg_ctl start
   
   # MongoDB
   mongod
   ```

2. **Start Backend**:
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

4. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🎯 Project Highlights for DBMS Presentation

### Database Design Excellence
- **14 SQL Tables** with proper relationships
- **3 MongoDB Collections** with optimized indexing
- **Hybrid Architecture** showcasing both SQL and NoSQL
- **Real-world Application** with practical use cases

### Advanced Features
- **City Ranking System** with MongoDB indexing
- **Transaction Management** with ACID compliance
- **Analytics and Reporting** with complex queries
- **User Activity Tracking** with time-series data
- **Achievement System** with badge management

### Performance Optimization
- **Database Indexing** for fast queries
- **Compound Indexes** for complex operations
- **Query Optimization** with proper relationships
- **Caching Strategy** (can be implemented)

This project demonstrates comprehensive understanding of database management systems, from basic CRUD operations to advanced indexing strategies and hybrid database architectures.
