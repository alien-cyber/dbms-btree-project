@echo off
REM Database Initialization Script for Windows
echo 🔧 Initializing Donation Platform Database...

cd backend

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Run database initialization
python init_db.py

echo.
echo 📋 Next steps:
echo 1. If initialization was successful, start the backend server
echo 2. Run: uvicorn main:app --reload
echo 3. Start the frontend in another terminal
echo.
pause
