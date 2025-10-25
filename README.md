# 🏆 Donation Platform - Comprehensive DBMS Project

A full-stack money donation platform showcasing advanced database management concepts using both **SQL (PostgreSQL)** and **NoSQL (MongoDB)** databases. Features city-based rankings with MongoDB indexing and comprehensive user data management.

## 🎯 Project Highlights

### Core Features
- ✅ **User Registration** with mandatory city information
- ✅ **City Rankings System** with top 3 cities display
- ✅ **User Context View** showing user's city + 3 cities above/below
- ✅ **MongoDB Indexing** for efficient city ranking queries
- ✅ **Real-time Updates** when donations are made
- ✅ **Campaign Management** with donation tracking
- ✅ **JWT Authentication** with secure user sessions

### Database Architecture
- **14 SQL Tables** with proper relationships and constraints
- **3 MongoDB Collections** with optimized indexing strategies
- **Hybrid Architecture** demonstrating SQL + NoSQL integration
- **Advanced Indexing** for performance optimization

## 🏗️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database for structured data
- **MongoDB** - Document database for rankings and analytics
- **SQLAlchemy** - ORM for database operations
- **JWT** - Authentication and authorization
- **Pydantic** - Data validation and serialization

### Frontend
- **React 18** - Modern JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing

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

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- MongoDB 4.4+

### Installation

#### For Windows Users:
1. **Clone and Setup**:
   ```cmd
   git clone <repository-url>
   cd donation-platform
   setup.bat
   ```
   Or use PowerShell:
   ```powershell
   git clone <repository-url>
   cd donation-platform
   .\setup.ps1
   ```

#### For Linux/Mac Users:
1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd donation-platform
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Configure Databases**:

   **For Windows:**
   ```cmd
   # Create PostgreSQL database
   createdb donation_platform
   
   # Start MongoDB (run as Administrator)
   mongod
   ```

   **For Linux/Mac:**
   ```bash
   # Create PostgreSQL database
   createdb donation_platform
   
   # Start MongoDB
   mongod
   ```

3. **Update Configuration**:
   ```bash
   # Edit backend/.env with your database credentials
   DATABASE_URL=postgresql://username:password@localhost/donation_platform
   MONGODB_URL=mongodb://localhost:27017/donation_platform
   SECRET_KEY=your-secret-key-here
   ```

4. **Start Services**:

   **For Windows:**
   ```cmd
   # Backend (Command Prompt 1)
   cd backend
   venv\Scripts\activate
   uvicorn main:app --reload
   
   # Frontend (Command Prompt 2)
   cd frontend
   npm start
   ```

   **For Linux/Mac:**
   ```bash
   # Backend (Terminal 1)
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload
   
   # Frontend (Terminal 2)
   cd frontend
   npm start
   ```

5. **Seed Sample Data** (Optional):

   **For Windows:**
   ```cmd
   cd backend
   venv\Scripts\activate
   python seed_data.py
   ```

   **For Linux/Mac:**
   ```bash
   cd backend
   source venv/bin/activate
   python seed_data.py
   ```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

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
- **Dashboard** - Overview with statistics and recent activity
- **City Rankings** - Interactive city leaderboard with top 3 and user context
- **Campaigns** - Browse, create, and donate to campaigns
- **Profile** - User profile management and donation history

### Key Components
- Responsive design with Tailwind CSS
- Real-time city ranking updates
- Interactive forms with validation
- Modal dialogs for actions
- Loading states and error handling

## 🔧 API Endpoints

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

## 📚 DBMS Concepts Demonstrated

### SQL Concepts
- **Normalization** - Proper table design with minimal redundancy
- **Foreign Keys** - Referential integrity between tables
- **Indexes** - Performance optimization for queries
- **Transactions** - ACID properties for data consistency
- **Constraints** - Data validation and integrity
- **Relationships** - One-to-many, many-to-many relationships

### NoSQL Concepts
- **Document Storage** - Flexible schema for analytics
- **Indexing** - Compound and single-field indexes
- **Aggregation** - Complex data processing
- **Real-time Updates** - Immediate data synchronization
- **Scalability** - Horizontal scaling preparation

### Advanced Features
- **Hybrid Architecture** - SQL + NoSQL integration
- **Real-time Updates** - Immediate ranking recalculation
- **Analytics** - Comprehensive reporting system
- **Performance Optimization** - Strategic indexing

## 🎯 Project Structure

```
donation-platform/
├── backend/
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic schemas
│   ├── database.py            # Database configuration
│   ├── auth.py                # Authentication logic
│   ├── city_ranking_service.py # MongoDB service
│   ├── main.py                # FastAPI application
│   ├── seed_data.py           # Sample data generator
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   ├── package.json          # Node.js dependencies
│   └── tailwind.config.js   # Tailwind configuration
├── setup.sh                  # Setup script
├── PROJECT_DOCUMENTATION.md  # Detailed documentation
└── README.md                 # This file
```

## 🏆 DBMS Project Presentation Points

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
- **Real-time Updates** with efficient data structures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created for educational purposes as a DBMS project demonstration.

## 🆘 Support

For questions or issues:
1. Check the [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) for detailed information
2. Review the API documentation at http://localhost:8000/docs
3. Check the console logs for error messages

---

**Built with ❤️ for DBMS Project Demonstration**
