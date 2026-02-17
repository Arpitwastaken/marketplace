# Marketplace

A modern P2P marketplace with intelligent matching.

## Features

- **Intelligent Matching** - Algorithm matches buyers/sellers based on tags (40pts), price (25pts), location (20pts), and condition (5pts)
- **ZIP Code Proximity** - Distance-based scoring using major US city zipcodes
- **User Auth** - Registration and login system
- **Listings** - Create buy/sell listings with categories, tags, and pricing
- **Offers** - Make and manage offers on listings
- **Save Favorites** - Heart listings to save for later

## Tech Stack

- Express.js backend
- Vanilla HTML/CSS/JS frontend
- In-memory data store (easily swappable to PostgreSQL)

## Running

```bash
cd C:\Users\arpit\.openclaw\workspace\projects\marketplace
npm install
npm start
```

Server runs on http://localhost:3000

## API Endpoints

- `GET /api/listings` - List all listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing
- `GET /api/matches` - Get matched buyer/seller pairs
- `POST /api/offers` - Make an offer

## Current Status

MVP complete. Next:
- Add image upload support
- Add detail view with messaging
- Add fair market value algorithm
- Redesign for 2010s-2020s vibe
