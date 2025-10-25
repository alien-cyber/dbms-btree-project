# Donation Platform Setup Script for Windows PowerShell
Write-Host "🚀 Setting up Donation Platform..." -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.8 or higher." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16 or higher." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if PostgreSQL is installed
try {
    $psqlVersion = psql --version 2>&1
    Write-Host "✅ PostgreSQL found: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL is not installed. Please install PostgreSQL." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if MongoDB is installed
try {
    $mongoVersion = mongod --version 2>&1
    Write-Host "✅ MongoDB found" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB is not installed. Please install MongoDB." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ All required software is installed." -ForegroundColor Green

# Setup Backend
Write-Host "📦 Setting up backend..." -ForegroundColor Yellow
Set-Location backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
pip install -r requirements.txt

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
DATABASE_URL=postgresql://username:password@localhost/donation_platform
MONGODB_URL=mongodb://localhost:27017/donation_platform
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "⚠️  Please update the .env file with your actual database credentials." -ForegroundColor Yellow
}

Set-Location ..

# Setup Frontend
Write-Host "📦 Setting up frontend..." -ForegroundColor Yellow
Set-Location frontend

# Install dependencies
npm install

Set-Location ..

Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend\.env with your database credentials"
Write-Host "2. Start PostgreSQL and MongoDB services"
Write-Host "3. Create the database: createdb donation_platform"
Write-Host "4. Start the backend: cd backend; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload"
Write-Host "5. Start the frontend: cd frontend; npm start"
Write-Host ""
Write-Host "🌐 The application will be available at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend API: http://localhost:8000"
Write-Host "   API Documentation: http://localhost:8000/docs"
Write-Host ""
Read-Host "Press Enter to continue"
