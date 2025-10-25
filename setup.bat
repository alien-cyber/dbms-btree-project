@echo off
REM Donation Platform Setup Script for Windows
echo 🚀 Setting up Donation Platform...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL.
    pause
    exit /b 1
)

REM Check if MongoDB is installed
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB is not installed. Please install MongoDB.
    pause
    exit /b 1
)

echo ✅ All required software is installed.

REM Setup Backend
echo 📦 Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    (
        echo DATABASE_URL=postgresql://username:password@localhost/donation_platform
        echo MONGODB_URL=mongodb://localhost:27017/donation_platform
        echo SECRET_KEY=your-super-secret-key-change-this-in-production
        echo ALGORITHM=HS256
        echo ACCESS_TOKEN_EXPIRE_MINUTES=30
    ) > .env
    echo ⚠️  Please update the .env file with your actual database credentials.
)

cd ..

REM Setup Frontend
echo 📦 Setting up frontend...
cd frontend

REM Install dependencies
npm install

cd ..

echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update backend\.env with your database credentials
echo 2. Start PostgreSQL and MongoDB services
echo 3. Create the database: createdb donation_platform
echo 4. Start the backend: cd backend ^&^& venv\Scripts\activate ^&^& uvicorn main:app --reload
echo 5. Start the frontend: cd frontend ^&^& npm start
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Documentation: http://localhost:8000/docs
echo.
pause
