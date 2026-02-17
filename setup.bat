@echo off
REM Marketplace v1.0 Setup Script

echo ========================================
echo   Marketplace - Quick Start
echo ========================================
echo.

REM Check if PostgreSQL is running
echo [1/4] Checking PostgreSQL...
sc query postgresql-x64-16 2>nul | findstr "RUNNING" >nul
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL is not running. Please start it first.
    exit /b 1
)
echo OK - PostgreSQL is running

REM Create database
echo [2/4] Creating database...
createdb marketplace 2>nul
if %errorlevel% neq 0 (
    echo OK - Database already exists
)

REM Install dependencies
echo [3/4] Installing dependencies...
call npm install

REM Initialize database
echo [4/4] Initializing database...
set DATABASE_URL=postgresql://postgres:password@localhost:5432/marketplace
call npm run db:init

REM Start server
echo.
echo ========================================
echo   Starting Marketplace API...
echo ========================================
node src\index.js
