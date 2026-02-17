#!/bin/bash
# Marketplace v1.0 Setup Script

echo "========================================"
echo "  Marketplace - Quick Start"
echo "========================================"
echo ""

# Check if PostgreSQL is running
echo "[1/4] Checking PostgreSQL..."
if ! pg_isready -q; then
    echo "ERROR: PostgreSQL is not running. Please start it first."
    exit 1
fi
echo "OK - PostgreSQL is running"

# Create database
echo "[2/4] Creating database..."
createdb marketplace 2>/dev/null
if [ $? -ne 0 ]; then
    echo "OK - Database already exists"
fi

# Install dependencies
echo "[3/4] Installing dependencies..."
npm install

# Initialize database
echo "[4/4] Initializing database..."
export DATABASE_URL="postgresql://postgres:password@localhost:5432/marketplace"
npm run db:init

# Start server
echo ""
echo "========================================"
echo "  Starting Marketplace API..."
echo "========================================"
node src/index.js
